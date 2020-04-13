const { server: repository } = require('../../src/repository');
const { server: ENTITY } = require('../entities.json');

describe('Server repository', function () {
  let Server;
  it('Create server', async () => {
    Server = await repository.create(ENTITY.raw);
    const server = Server.toJSON();

    expect(server).to.have.all.keys(ENTITY.fields);
  });
});
