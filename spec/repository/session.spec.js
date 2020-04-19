const { session: repository } = require('../../src/repository');
const { session: ENTITY } = require('../entities.json');

describe('Session repository', function () {
  let Session;
  it('Create session', async () => {
    Session = await repository.create(ENTITY.raw);
    const session = Session.toJSON();

    expect(session).to.have.all.keys(ENTITY.fields);
  });

  it('Find session by ID', async () => {
    let session = await repository.findById(Session.id);
    session = session.toJSON();

    expect(session).to.have.all.keys(ENTITY.fields);
    expect(session).to.deep.equal(Session.toJSON());
  });

  it('Delete session by WRONG ID', async () => {
    const result = await repository.removeById(12345);

    const checkSession = await repository.findById(Session.id);

    expect(result).to.be.false;
    expect(checkSession.toJSON()).to.deep.equal(Session.toJSON());
  });

  it('Delete session by ID', async () => {
    const result = await repository.removeById(Session.id);

    const checkSession = await repository.findById(Session.id);

    expect(result).to.be.true;
    expect(checkSession).to.equal(null);
  });
});
