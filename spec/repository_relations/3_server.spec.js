const {
  server: repository,
  user: userRepo,
  session: sessionRepo,
} = require('../../src/repository');
const {
  server: ENTITY,
  user: ENTITY_USER,
  session: ENTITY_SESSION,
} = require('../entities.json');

describe('Server relations repository', function () {
  let Server;
  it('Server has many users in findBy', async () => {
    Server = await repository.findBy({
      by: { slug: ENTITY.raw.slug },
      relations: true,
    });

    expect(Server).to.have.all.keys([...ENTITY.fields, 'users']);
    expect(Server.users.length).to.equal(7);
    expect(Server.users[0]).to.have.all.keys(ENTITY_USER.fields);

    const serverById = await repository.findBy({
      by: { id: Server.id },
      relations: true,
    });

    expect(serverById).to.have.all.keys([...ENTITY.fields, 'users']);
    expect(serverById.users.length).to.equal(7);
    expect(serverById.users[0]).to.have.all.keys(ENTITY_USER.fields);
  });

  it('After delete server, all users with sessions belongs to this server, should remove', async () => {
    const countSessions = 1;
    const countUsers = 3;
    const server = await repository.create({
      ...ENTITY.raw,
      slug: 'ren_test',
      name: 'Check cascade delete',
      url: 'http://google.com/123',
    });

    // generate users with session for this server
    for(let i = 0; i < countUsers; i++) {
      const user = await userRepo.create({
        ...ENTITY_USER.raw,
        email: `em${i}ail@user.com`,
        serverId: server.id,
      });
      for(let a = 0; a < countSessions; a++) {
        await sessionRepo.create({
          ...ENTITY_SESSION.raw,
          userId: user.id,
          token: `jwt_${a}_ca${i}cade`,
        });
      }
    };

    const users = await userRepo.getAll({
      findBy: { serverId: server.id },
      order: [['createdAt', 'ASC']],
    });

    expect(users).has.all.keys(['count', 'rows']);
    expect(users.count).to.equal(countUsers);
    expect(users.rows[0].email).to.equal('em0ail@user.com');

    for await( let user of users.rows ) {
      const sessions = await sessionRepo.getAll({
        findBy: { userId: user.id },
        order: [['createdAt', 'ASC']],
      });

      expect(sessions).has.all.keys(['count', 'rows']);
      expect(sessions.count).to.equal(1);
    }

    await repository.removeById(server.id);

    const usersRemovedServer = await userRepo.getAll({
      findBy: { serverId: server.id },
      order: [['createdAt', 'ASC']],
    });

    expect(usersRemovedServer).has.all.keys(['count', 'rows']);
    expect(usersRemovedServer.count).to.equal(0);

    for await( let user of users.rows ) {
      const sessions = await sessionRepo.getAll({
        findBy: { userId: user.id },
        order: [['createdAt', 'ASC']],
      });

      expect(sessions).has.all.keys(['count', 'rows']);
      expect(sessions.count).to.equal(0);
    }
  });
});
