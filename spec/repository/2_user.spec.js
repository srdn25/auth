const { Sequelize } = require('../../src/psql/models');
const { lastPage, itemsOnLastPage } = require('../../src/helper');
const {
  user: repository,
  server: serverRepo,
} = require('../../src/repository');
const {
  user: ENTITY,
  server: { raw: { slug: SERVER_SLUG } },
  sequelize: { error: { keys: SEQUELIZE_ERROR_KEYS } }
} = require('../entities.json');

describe('User repository', function () {
  let User;
  it('Create user', async () => {
    const server = await serverRepo.findBy({ slug: SERVER_SLUG });
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

  it('FindBy user can return Sequelize object', async () => {
    const user = await repository.findBy({ id: User.id }, false);

    expect(user instanceof Sequelize.Model).to.be.true;
    expect(user.toJSON()).to.have.all.keys(ENTITY.fields);
  });

  it('Find user by ID or Email', async () => {
    const userById = await repository.findBy({ id: User.id });

    expect(userById).to.have.all.keys(ENTITY.fields);
    expect(userById).to.deep.equal(User);

    const userByEmail = await repository.findBy({ email: User.email });

    expect(userByEmail).to.have.all.keys(ENTITY.fields);
    expect(userByEmail).to.deep.equal(User);
  });

  it('User should have hashed password and has validPassword method', async () => {
    const user = await repository.findBy({ id: User.id }, false);
    const { password } = ENTITY.raw;
    const checkPassword = user.validPassword(password);
    expect(user.password).to.not.equal(password);
    expect(checkPassword).to.be.true;
  });

  it('Delete user by WRONG ID', async () => {
    const result = await repository.removeById(12345);

    const checkUser = await repository.findBy({ id: User.id });

    expect(result).to.be.false;
    expect(checkUser).to.deep.equal(User);
  });

  it('Delete user by ID', async () => {
    const result = await repository.removeById(User.id);

    const checkUser = await repository.findBy({ id: User.id });

    expect(result).to.be.true;
    expect(checkUser).to.equal(null);
  });

  it('Create user can return Sequelize object', async () => {
    const server = await serverRepo.findBy({ slug: SERVER_SLUG });
    const user = await repository.create({
      ...ENTITY.raw,
      serverId: server.id,
    }, false);

    expect(user instanceof Sequelize.Model).to.be.true;
    User = user.toJSON();
  });

  it('Find users by serverId with paginate', async () => {
    const server = await serverRepo.findBy({ slug: SERVER_SLUG });

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
    const usersAsc = await repository.getAll(true, 1, 5, [['createdAt', 'ASC']]);
    expect(usersAsc).to.have.all.keys(['count', 'rows']);
    expect(usersAsc.rows.length).to.equal(5);
    expect(usersAsc.rows[0]).to.have.all.keys(ENTITY.fields);
    expect(usersAsc.rows[0]).to.deep.equal(User);

    const lastPageCalc = lastPage(usersAsc.count, 5);
    const itemsOnLastPageCalc = itemsOnLastPage(usersAsc.count, 5);

    const usersDesc = await repository.getAll(true, lastPageCalc, 5, [['createdAt', 'Desc']]);
    expect(usersDesc).to.have.all.keys(['count', 'rows']);
    expect(usersDesc.rows.length).to.equal(itemsOnLastPageCalc);
    expect(usersDesc.rows[itemsOnLastPageCalc - 1]).to.have.all.keys(ENTITY.fields);
    expect(usersDesc.rows[itemsOnLastPageCalc - 1]).to.deep.equal(User);
  });
});
