const { Sequelize } = require('../../src/psql/models');
const {
  user: repository,
  server: serverRepo,
} = require('../../src/repository');
const {
  user: ENTITY,
  server: ENTITY_SERVER,
  sequelize: { error: { keys: SEQUELIZE_ERROR_KEYS } }
} = require('../entities.json');

describe('User repository', function () {
  let User;
  it('Create user', async () => {
    const server = await serverRepo.findBySlug(ENTITY_SERVER.raw.slug);
    User = await repository.create({
      ...ENTITY.raw,
      serverId: server.id,
    });

    expect(User).to.have.all.keys(ENTITY.fields);
  });

  it('Create user. Email_serverId should be unique', async () => {
    let awaitError;
    try {
      await repository.create({
        ...ENTITY.raw,
        serverId: User.serverId,
      })
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

  it('User should have hashed password and has validPassword method', async () => {
    const user = await repository.findById(User.id, false);
    const { password } = ENTITY.raw;
    const checkPassword = user.validPassword(password);
    expect(user.password).to.not.equal(password);
    expect(checkPassword).to.be.true;
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

  it('Create user can return Sequelize object', async () => {
    const server = await serverRepo.findBySlug(ENTITY_SERVER.raw.slug);
    const user = await repository.create({
      ...ENTITY.raw,
      serverId: server.id,
    }, false);

    expect(user instanceof Sequelize.Model).to.be.true;
    User = user.toJSON();
  });

  it('Find users by serverId with paginate', async () => {
    const server = await serverRepo.findBySlug(ENTITY_SERVER.raw.slug);

    for(let i = 0; i < 10; i++) {
      await repository.create({
        ...ENTITY.raw,
        serverId: server.id,
        email: `user_${i}@mail.com`,
      }, true);
    }

    const users = await repository.findByServerId(server.id, true, 1, 10);
    expect(users).to.have.all.keys(['count', 'rows']);
    expect(users.rows.length).to.equal(10);
    expect(users.rows[0]).to.have.all.keys(ENTITY.fields);
    expect(users.rows[0]).to.deep.equal(User);
  });

  it('Get all users with paginate and order', async () => {
    const usersAsc = await repository.getAllUsers(true, 1, 5, [['createdAt', 'ASC']]);
    expect(usersAsc).to.have.all.keys(['count', 'rows']);
    expect(usersAsc.rows.length).to.equal(5);
    expect(usersAsc.rows[0]).to.have.all.keys(ENTITY.fields);
    expect(usersAsc.rows[0]).to.deep.equal(User);

    const lastPage = Math.ceil(usersAsc.count / 5);
    const itemsOnLastPage = usersAsc.count - ((lastPage - 1) * 5);
    const usersDesc = await repository.getAllUsers(true, lastPage, 5, [['createdAt', 'Desc']]);
    expect(usersDesc).to.have.all.keys(['count', 'rows']);
    expect(usersDesc.rows.length).to.equal(itemsOnLastPage);
    expect(usersDesc.rows[itemsOnLastPage - 1]).to.have.all.keys(ENTITY.fields);
    expect(usersDesc.rows[itemsOnLastPage - 1]).to.deep.equal(User);
  });
});
