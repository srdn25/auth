const { server: repository } = require('../../src/repository');
const { server: ENTITY } = require('../entities.json');

describe('Server repository', function () {
  let Server;
  it('Create server', async () => {
    Server = await repository.create(ENTITY.raw);
    const server = Server.toJSON();

    expect(server).to.have.all.keys(ENTITY.fields);
  });

  it('Find server by ID', async () => {
    let server = await repository.findById(Server.id);
    server = server.toJSON();

    expect(server).to.have.all.keys(ENTITY.fields);
    expect(server).to.deep.equal(Server.toJSON());
  });

  it('Find server by slug', async () => {
    let server = await repository.findBySlug(Server.slug);
    server = server.toJSON();

    expect(server).to.have.all.keys(ENTITY.fields);
    expect(server).to.deep.equal(Server.toJSON());
  });
});
