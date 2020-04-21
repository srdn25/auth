const {
  user: repository,
  session: sessionRepo,
  server: serverRepo,
} = require('../../src/repository');
const { psql: { countSessionsInInclude } } = require('../../src/config');
const {
  user: ENTITY,
  session: ENTITY_SESSION,
  server: { fields: SERVER_FIELDS, raw: { slug: SERVER_SLUG } },
} = require('../entities.json');

describe('User relations repository', function () {
  let User;
  it('User has many sessions in findByEmail', async () => {
    User = await repository.findBy({ email: ENTITY.raw.email }, true, true);

    expect(User).to.have.all.keys([...ENTITY.fields, 'sessions', 'server']);
    expect(User.server).to.be.an('object');
    expect(User.server).to.have.all.keys(SERVER_FIELDS);
    expect(User.sessions.length).to.equal(countSessionsInInclude);
    expect(User.sessions[0]).to.have.all.keys(ENTITY_SESSION.fields);
  });

  it('User has many sessions and belongs to server in findBy', async () => {
    User = await repository.findBy({ id: User.id }, true, true);

    expect(User).to.have.all.keys([...ENTITY.fields, 'sessions', 'server']);
    expect(User.sessions.length).to.equal(countSessionsInInclude);
    expect(User.sessions[0]).to.have.all.keys(ENTITY_SESSION.fields);
  });

  it('After delete user, all sessions belongs to this user, should remove', async () => {
    const countSessions = 7;
    const server = await serverRepo.findBy({ by: { slug: SERVER_SLUG } });
    const user = await repository.create({
      ...ENTITY.raw,
      serverId: server.id,
      email: 'checkCascade@delete.com',
    });

    for(let i = 0; i < countSessions; i++) {
      await sessionRepo.create({
        ...ENTITY_SESSION.raw,
        userId: user.id,
        token: `jwt_${i}_check-delete_cascade`,
      })
    };

    const sessions = await sessionRepo.getAll({
      findBy: { userId: user.id },
      order: [['createdAt', 'ASC']],
    });

    expect(sessions).has.all.keys(['count', 'rows']);
    expect(sessions.count).to.equal(countSessions);
    expect(sessions.rows[0].token).to.equal('jwt_0_check-delete_cascade');

    await repository.removeById(user.id);

    const sessionsRemovedUser = await sessionRepo.getAll({
      findBy: { userId: user.id },
      order: [['createdAt', 'ASC']],
    });

    expect(sessionsRemovedUser).has.all.keys(['count', 'rows']);
    expect(sessionsRemovedUser.count).to.equal(0);
  });
});
