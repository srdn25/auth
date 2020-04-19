const { Sequelize } = require('../../src/psql/models');
const { user: repository } = require('../../src/repository');
const {
  user: ENTITY,
  sequelize: { error: { keys: SEQUELIZE_ERROR_KEYS } }
} = require('../entities.json');

describe('User repository', function () {
  let User;
  it('Create user', async () => {
    User = await repository.create(ENTITY.raw);

    expect(User).to.have.all.keys(ENTITY.fields);
  });

  it('Create user can return Sequelize object', async () => {
    const user = await repository.create({
      ...ENTITY.raw,
      email: 'sequelizeUser@user.ua',
    }, false);

    expect(user instanceof Sequelize.Model).to.be.true;
  });

  it('Create user. Email_serverId should be unique', async () => {
    let awaitError;
    try {
      await repository.create(ENTITY.raw)
    } catch (err) {
      awaitError = err;
    }

    expect(awaitError).to.have.all.keys(SEQUELIZE_ERROR_KEYS);
    expect(awaitError.name).to.equal('SequelizeUniqueConstraintError');
    expect(awaitError.errors).to.be.an('array');
    expect(awaitError.errors.length).to.equal(2);
    expect(awaitError.errors[0].message).to.equal('email must be unique');
    expect(awaitError.errors[1].message).to.equal('serverId must be unique');
  });

  it('FindById user can return Sequelize object', async () => {
    const user = await repository.findById(User.id, false);

    expect(user instanceof Sequelize.Model).to.be.true;
    expect(user.toJSON()).to.have.all.keys(ENTITY.fields);
  });

  it('Find user by ID', async () => {
    const user = await repository.findById(User.id);

    expect(user).to.have.all.keys(ENTITY.fields);
    expect(user).to.deep.equal(User);
  });

  it('FindByEmail user can return Sequelize object', async () => {
    const user = await repository.findByEmail(User.email, false);

    expect(user instanceof Sequelize.Model).to.be.true;
    expect(user.toJSON()).to.have.all.keys(ENTITY.fields);
  });

  it('Find user by Email', async () => {
    const user = await repository.findByEmail(User.email);

    expect(user).to.have.all.keys(ENTITY.fields);
    expect(user).to.deep.equal(User);
  });

  it('Delete user by WRONG ID', async () => {
    const result = await repository.removeById(12345);

    const checkUser = await repository.findById(User.id);

    expect(result).to.be.false;
    expect(checkUser).to.deep.equal(User);
  });

  it('Delete user by ID', async () => {
    const result = await repository.removeById(User.id);

    const checkUser = await repository.findById(User.id);

    expect(result).to.be.true;
    expect(checkUser).to.equal(null);
  });
});
