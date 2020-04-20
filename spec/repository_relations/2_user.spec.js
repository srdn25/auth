const {
  user: repository,
  session: sessionRepo,
} = require('../../src/repository');
const { psql: { countSessionsInInclude } } = require('../../src/config');
const {
  user: ENTITY,
  session: ENTITY_SESSION,
  server: { fields: SERVER_FIELDS },
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
    const sessions = await sessionRepo.findBy({ userId: User.id });
    console.log(sessions);
  });
});
