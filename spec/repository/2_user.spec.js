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
    const server = await serverRepo.findBy({ by: { slug: SERVER_SLUG } });
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
    const user = await repository.findBy({ by: { id: User.id }, raw: false });

    expect(user instanceof Sequelize.Model).to.be.true;
    expect(user.toJSON()).to.have.all.keys(ENTITY.fields);
  });

  it('Find user by ID or Email', async () => {
    const userById = await repository.findBy({ by: { id: User.id } });

    expect(userById).to.have.all.keys(ENTITY.fields);
    expect(userById).to.deep.equal(User);

    const userByEmail = await repository.findBy({ by: { email: User.email } });

    expect(userByEmail).to.have.all.keys(ENTITY.fields);
    expect(userByEmail).to.deep.equal(User);
  });

  it('User should have hashed password and has validPassword method', async () => {
    const user = await repository.findBy({ by: { id: User.id }, raw: false });
    const { password } = ENTITY.raw;
    const checkPassword = user.validPassword(password);
    expect(user.password).to.not.equal(password);
    expect(checkPassword).to.be.true;
  });

  it('Delete user by WRONG ID', async () => {
    const result = await repository.removeById(12345);

    const checkUser = await repository.findBy({ by: { id: User.id } });

    expect(result).to.be.false;
    expect(checkUser).to.deep.equal(User);
  });

  it('Delete user by ID', async () => {
    const result = await repository.removeById(User.id);

    const checkUser = await repository.findBy({ by: { id: User.id } });

    expect(result).to.be.true;
    expect(checkUser).to.equal(null);
  });

  it('Create user can return Sequelize object', async () => {
    const server = await serverRepo.findBy({ by: { slug: SERVER_SLUG } });
    const user = await repository.create({
      ...ENTITY.raw,
      serverId: server.id,
    }, false);

    expect(user instanceof Sequelize.Model).to.be.true;
    User = user.toJSON();
  });

  it('Find users by serverId with paginate', async () => {
    const server = await serverRepo.findBy({ by: { slug: SERVER_SLUG } });

    for(let i = 0; i < 10; i++) {
      await repository.create({
        ...ENTITY.raw,
        serverId: server.id,
        email: `user_${i}@mail.com`,
      });
    }

    const users = await repository.findByServerId(server.id, true, 1, 10);
    expect(users).to.have.all.keys(['count', 'rows']);
    expect(users.rows.length).to.equal(10);
    expect(users.rows[0]).to.have.all.keys(ENTITY.fields);
    expect(users.rows[0]).to.deep.equal(User);
  });

  it('Get all users with paginate and order', async () => {
    const usersAsc = await repository.getAll({
      page: 1,
      perPage: 5,
      order: [['createdAt', 'ASC']],
    });
    expect(usersAsc).to.have.all.keys(['count', 'rows']);
    expect(usersAsc.rows.length).to.equal(5);
    expect(usersAsc.rows[0]).to.have.all.keys(ENTITY.fields);
    expect(usersAsc.rows[0]).to.deep.equal(User);

    const lastPageCalc = lastPage(usersAsc.count, 5);
    const itemsOnLastPageCalc = itemsOnLastPage(usersAsc.count, 5);

    const usersDesc = await repository.getAll({
      page: lastPageCalc,
      perPage: 5,
      order: [['createdAt', 'DESC']],
    });
    expect(usersDesc).to.have.all.keys(['count', 'rows']);
    expect(usersDesc.rows.length).to.equal(itemsOnLastPageCalc);
    expect(usersDesc.rows[itemsOnLastPageCalc - 1]).to.have.all.keys(ENTITY.fields);
    expect(usersDesc.rows[itemsOnLastPageCalc - 1]).to.deep.equal(User);
  });

  it('Update user', async () => {
    const updateData = { name: 'updated Name' };
    const updatedRows = await repository.update(updateData, { id: User.id });

    expect(updatedRows).to.equal(1);

    const updatedUser = await repository.findBy({ by: { id: User.id } });
    expect(updatedUser).to.have.all.keys(ENTITY.fields);
    expect(updatedUser.name).to.equal(updateData.name);
  });

  it('Update user INFO jsonb', async () => {
    const jsonbInfo = { info: { game: 1, cash: 123 } };

    const updatedRows = await repository.update(jsonbInfo, { id: User.id });

    expect(updatedRows).to.equal(1);

    const updatedUser = await repository.findBy({ by: { id: User.id } });
    expect(updatedUser).to.have.all.keys(ENTITY.fields);
    expect(updatedUser.info).to.have.all.keys(Object.keys(jsonbInfo.info));
    expect(updatedUser.info.game).to.equal(jsonbInfo.info.game);
    expect(updatedUser.info.cash).to.equal(jsonbInfo.info.cash);

    const updatedRowsInfo = await repository.update({
      info: {
        ...updatedUser.info,
        newField: 'abc',
      },
    }, { id: User.id });

    expect(updatedRowsInfo).to.equal(1);

    const updatedUserInfo = await repository.findBy({ by: { id: User.id } });
    expect(updatedUserInfo).to.have.all.keys(ENTITY.fields);
    expect(updatedUserInfo.info).to.have.all.keys([...Object.keys(jsonbInfo.info), 'newField']);
    expect(updatedUserInfo.info.game).to.equal(jsonbInfo.info.game);
    expect(updatedUserInfo.info.cash).to.equal(jsonbInfo.info.cash);
    expect(updatedUserInfo.info.newField).to.equal('abc');
  });
});
