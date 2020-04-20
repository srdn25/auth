const { Sequelize } = require('../../src/psql/models');
const { lastPage, itemsOnLastPage } = require('../../src/helper');
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

  it('Delete server by WRONG ID', async () => {
    const result = await repository.removeById(12345);

    const checkServer = await repository.findBy({ id: Server.id });

    expect(result).to.be.false;
    expect(checkServer).to.deep.equal(Server);
  });

  it('Delete server by ID', async () => {
    const result = await repository.removeById(Server.id);

    const checkServer = await repository.findBy({ id: Server.id });

    expect(result).to.be.true;
    expect(checkServer).to.equal(null);
  });

  it('Create server can return Sequelize object', async () => {
    const server = await repository.create(ENTITY.raw, false);

    expect(server instanceof Sequelize.Model).to.be.true;

    Server = server.toJSON();

    for(let i = 0; i < 10; i++) {
      await repository.create({
        ...ENTITY.raw,
        slug: `server_${i}`,
        name: `Name ${i}`,
        url: `http://link${i}.com`
      }, true);
    }
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

  it('Find server by ID or Slug', async () => {
    const serverById = await repository.findBy({ id: Server.id });

    expect(serverById).to.have.all.keys(ENTITY.fields);
    expect(serverById).to.deep.equal(Server);

    const serverBySlug = await repository.findBy({ slug: Server.slug });

    expect(serverBySlug).to.have.all.keys(ENTITY.fields);
    expect(serverBySlug).to.deep.equal(Server);
  });

  it('FindBy server can return Sequelize object', async () => {
    const server = await repository.findBy({ id: Server.id }, false);

    expect(server instanceof Sequelize.Model).to.be.true;
    expect(server.toJSON()).to.have.all.keys(ENTITY.fields);
  });

  it('Get all servers with paginate and order', async () => {
    const serversAsc = await repository.getAll(true, 1, 3, [['createdAt', 'ASC']]);
    expect(serversAsc).to.have.all.keys(['count', 'rows']);
    expect(serversAsc.rows.length).to.equal(3);
    expect(serversAsc.rows[0]).to.have.all.keys(ENTITY.fields);
    expect(serversAsc.rows[0]).to.deep.equal(Server);

    const lastPageCalc = lastPage(serversAsc.count, 3);
    const itemsOnLastPageCalc = itemsOnLastPage(serversAsc.count, 3);

    const serversDesc = await repository.getAll(true, lastPageCalc, 3, [['createdAt', 'Desc']]);
    expect(serversDesc).to.have.all.keys(['count', 'rows']);
    expect(serversDesc.rows.length).to.equal(itemsOnLastPageCalc);
    expect(serversDesc.rows[itemsOnLastPageCalc - 1]).to.have.all.keys(ENTITY.fields);
    expect(serversDesc.rows[itemsOnLastPageCalc - 1]).to.deep.equal(Server);
  });

  it('Update server', async () => {
    const updateData = { name: 'SERVER is Updated' };
    const updatedRows = await repository.update(updateData, { id: Server.id });

    expect(updatedRows).to.equal(1);

    const updatedServer = await repository.findBy({ id: Server.id });
    expect(updatedServer).to.have.all.keys(ENTITY.fields);
    expect(updatedServer.name).to.equal(updateData.name);
  });
});
