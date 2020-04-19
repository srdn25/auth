const { server: repository } = require('../../src/repository');
const {
  server: ENTITY,
  user: ENTITY_USER,
} = require('../entities.json');

describe('Server relations repository', function () {
  let Server;
  it('Server has many users in findBySlug', async () => {
    Server = await repository.findBySlug(ENTITY.raw.slug, true, true);

    expect(Server).to.have.all.keys([...ENTITY.fields, 'users']);
    expect(Server.users.length).to.equal(1);
    expect(Server.users[0]).to.have.all.keys(ENTITY_USER.fields);
  });

  it('Server has many users in findById', async () => {
    Server = await repository.findById(Server.id, true, true);

    expect(Server).to.have.all.keys([...ENTITY.fields, 'users']);
    expect(Server.users.length).to.equal(1);
    expect(Server.users[0]).to.have.all.keys(ENTITY_USER.fields);
  });
});
