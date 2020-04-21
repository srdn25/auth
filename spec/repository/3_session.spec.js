const { Sequelize } = require('../../src/psql/models');
const { lastPage, itemsOnLastPage } = require('../../src/helper');
const {
  session: repository,
  user: userRepo,
} = require('../../src/repository');
const {
  session: ENTITY,
  user: { raw: { email: USER_EMAIL } },
  sequelize: { error: { keys: SEQUELIZE_ERROR_KEYS } }
} = require('../entities.json');

describe('Session repository', function () {
  let Session;
  it('Create session', async () => {
    const user = await userRepo.findBy({ by: { email: USER_EMAIL } });
    Session = await repository.create({
      ...ENTITY.raw,
      userId: user.id,
    });

    expect(Session).to.have.all.keys(ENTITY.fields);
  });

  it('Create session can return Sequelize object', async () => {
    const session = await repository.create({
      ...ENTITY.raw,
      token: 'jwtOther',
      userId: Session.userId,
    }, false);

    expect(session instanceof Sequelize.Model).to.be.true;
  });

  it('Create session. Token should be unique', async () => {
    let awaitError;

    try {
      await repository.create({
        ...ENTITY.raw,
        userId: Session.userId,
      }, false);
    } catch (err) {
      awaitError = err;
    }

    expect(awaitError).to.have.all.keys(SEQUELIZE_ERROR_KEYS);
    expect(awaitError.name).to.equal('SequelizeUniqueConstraintError');
    expect(awaitError.errors).to.be.an('array');
    expect(awaitError.errors.length).to.equal(1);
    expect(awaitError.errors[0].message).to.equal('token must be unique');
  });

  it('FindBy session can return Sequelize object', async () => {
    const session = await repository.findBy({ by: { id: Session.id }, raw: false });

    expect(session instanceof Sequelize.Model).to.be.true;
    expect(session.toJSON()).to.have.all.keys(ENTITY.fields);
  });

  it('Find session', async () => {
    const session = await repository.findBy({ by: { id: Session.id } });

    expect(session).to.have.all.keys(ENTITY.fields);
    expect(session).to.deep.equal(Session);
  });

  it('Get all sessions with paginate and order', async () => {
    for(let i = 0; i < 10; i++) {
      await repository.create({
        ...ENTITY.raw,
        token: `token_${i}`,
        userId: Session.userId,
      }, true);
    };

    const sessionsAsc = await repository.getAll({
      page: 1,
      perPage: 5,
      order: [['createdAt', 'ASC']],
    });
    expect(sessionsAsc).to.have.all.keys(['count', 'rows']);
    expect(sessionsAsc.rows.length).to.equal(5);
    expect(sessionsAsc.rows[0]).to.have.all.keys(ENTITY.fields);
    expect(sessionsAsc.rows[0]).to.deep.equal(Session);

    const lastPageCalc = lastPage(sessionsAsc.count, 5);
    const itemsOnLastPageCalc = itemsOnLastPage(sessionsAsc.count, 5);

    const sessionsDesc = await repository.getAll({
      page: lastPageCalc,
      perPage: 5,
      order: [['createdAt', 'DESC']],
    });
    expect(sessionsDesc).to.have.all.keys(['count', 'rows']);
    expect(sessionsDesc.rows.length).to.equal(itemsOnLastPageCalc);
    expect(sessionsDesc.rows[itemsOnLastPageCalc - 1]).to.have.all.keys(ENTITY.fields);
    expect(sessionsDesc.rows[itemsOnLastPageCalc - 1]).to.deep.equal(Session);
  });

  it('Get all sessions can find by', async () => {
    const sessions = await repository.getAll({
      page: 1,
      perPage: 5,
      findBy: {
        token: ENTITY.raw.token,
      },
    });
    expect(sessions).to.have.all.keys(['count', 'rows']);
    expect(sessions.rows.length).to.equal(1);
    expect(sessions.rows[0]).to.have.all.keys(ENTITY.fields);
    expect(sessions.rows[0]).to.deep.equal(Session);
  });

  it('Delete session by WRONG ID', async () => {
    const result = await repository.removeById(12345);

    const checkSession = await repository.findBy({ by: { id: Session.id } });

    expect(result).to.be.false;
    expect(checkSession).to.deep.equal(Session);
  });

  it('Delete session by ID', async () => {
    const result = await repository.removeById(Session.id);

    const checkSession = await repository.findBy({ by: { id: Session.id } });

    expect(result).to.be.true;
    expect(checkSession).to.equal(null);
  });
});
