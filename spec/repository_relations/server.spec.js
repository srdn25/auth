const { server: repository } = require('../../src/repository');
const {
  server: ENTITY,
  user: ENTITY_USER,
} = require('../entities.json');

describe('Server relations repository', function () {
  let Server;
  it('Server has many users in findBy', async () => {
    Server = await repository.findBy({
      slug: ENTITY.raw.slug
    }, true, true);

    expect(Server).to.have.all.keys([...ENTITY.fields, 'users']);
    expect(Server.users.length).to.equal(7);
    expect(Server.users[0]).to.have.all.keys(ENTITY_USER.fields);

    const serverById = await repository.findBy({ id: Server.id }, true, true);

    expect(serverById).to.have.all.keys([...ENTITY.fields, 'users']);
    expect(serverById.users.length).to.equal(7);
    expect(serverById.users[0]).to.have.all.keys(ENTITY_USER.fields);
  });
});
