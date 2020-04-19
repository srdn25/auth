const { Sequelize } = require('../../src/psql/models');
const { server: repository } = require('../../src/repository');
const {
  server: ENTITY,
  sequelize: { error: { keys: SEQUELIZE_ERROR_KEYS } }
} = require('../entities.json');

describe('Server repository', function () {
  let Server;
  it('Create server', async () => {
    Server = await repository.create(ENTITY.raw);

    expect(Server).to.have.all.keys(ENTITY.fields);
  });

  it('Create server can return Sequelize object', async () => {
    const server = await repository.create({
      ...ENTITY.raw,
      slug: 'raw_object',
      name: 'Other server for check Sequelize',
      url: 'http://google.com',
    }, false);

    expect(server instanceof Sequelize.Model).to.be.true;
  });

  it('Create server. Slug should be unique', async () => {
    let awaitError;

    try {
      await repository.create({
        ...ENTITY.raw,
        name: 'Check server uniq',
        url: 'http://uniq.com',
      }, false);
    } catch (err) {
      awaitError = err;
    }

    expect(awaitError).to.have.all.keys(SEQUELIZE_ERROR_KEYS);
    expect(awaitError.name).to.equal('SequelizeUniqueConstraintError');
    expect(awaitError.errors).to.be.an('array');
    expect(awaitError.errors.length).to.equal(1);
    expect(awaitError.errors[0].message).to.equal('slug must be unique');
  });

  it('Create server. Name should be unique', async () => {
    let awaitError;

    try {
      await repository.create({
        ...ENTITY.raw,
        slug: 'check_server_uniq',
        url: 'http://uniq.com',
      }, false);
    } catch (err) {
      awaitError = err;
    }

    expect(awaitError).to.have.all.keys(SEQUELIZE_ERROR_KEYS);
    expect(awaitError.name).to.equal('SequelizeUniqueConstraintError');
    expect(awaitError.errors).to.be.an('array');
    expect(awaitError.errors.length).to.equal(1);
    expect(awaitError.errors[0].message).to.equal('name must be unique');
  });

  it('Create server. Url should be unique', async () => {
    let awaitError;

    try {
      await repository.create({
        ...ENTITY.raw,
        name: 'Check server uniq',
        slug: 'check_server_uniq',
      }, false);
    } catch (err) {
      awaitError = err;
    }

    expect(awaitError).to.have.all.keys(SEQUELIZE_ERROR_KEYS);
    expect(awaitError.name).to.equal('SequelizeUniqueConstraintError');
    expect(awaitError.errors).to.be.an('array');
    expect(awaitError.errors.length).to.equal(1);
    expect(awaitError.errors[0].message).to.equal('url must be unique');
  });

  it('Find server by ID', async () => {
    const server = await repository.findById(Server.id);

    expect(server).to.have.all.keys(ENTITY.fields);
    expect(server).to.deep.equal(Server);
  });

  it('FindById server can return Sequelize object', async () => {
    const server = await repository.findById(Server.id, false);

    expect(server instanceof Sequelize.Model).to.be.true;
    expect(server.toJSON()).to.have.all.keys(ENTITY.fields);
  });

  it('Find server by slug', async () => {
    const server = await repository.findBySlug(Server.slug);

    expect(server).to.have.all.keys(ENTITY.fields);
    expect(server).to.deep.equal(Server);
  });

  it('FindBySlug server can return Sequelize object', async () => {
    const server = await repository.findBySlug(Server.slug, false);

    expect(server instanceof Sequelize.Model).to.be.true;
    expect(server.toJSON()).to.have.all.keys(ENTITY.fields);
  });
});
