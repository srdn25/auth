const { Sequelize } = require('../../src/psql/models');
const { session: repository } = require('../../src/repository');
const { session: ENTITY } = require('../entities.json');

describe('Session repository', function () {
  let Session;
  it('Create session', async () => {
    Session = await repository.create(ENTITY.raw);

    expect(Session).to.have.all.keys(ENTITY.fields);
  });

  it('Create session can return Sequelize object', async () => {
    const session = await repository.create(ENTITY.raw, false);

    expect(session instanceof Sequelize.Model).to.be.true;
  });

  it('FindById session can return Sequelize object', async () => {
    const session = await repository.findById(Session.id, false);

    expect(session instanceof Sequelize.Model).to.be.true;
    expect(session.toJSON()).to.have.all.keys(ENTITY.fields);
  });

  it('Find session by ID', async () => {
    const session = await repository.findById(Session.id);

    expect(session).to.have.all.keys(ENTITY.fields);
    expect(session).to.deep.equal(Session);
  });

  it('Delete session by WRONG ID', async () => {
    const result = await repository.removeById(12345);

    const checkSession = await repository.findById(Session.id);

    expect(result).to.be.false;
    expect(checkSession).to.deep.equal(Session);
  });

  it('Delete session by ID', async () => {
    const result = await repository.removeById(Session.id);

    const checkSession = await repository.findById(Session.id);

    expect(result).to.be.true;
    expect(checkSession).to.equal(null);
  });
});
