const {
  session: repository,
  user: userRepo,
} = require('../../src/repository');
const {
  session: ENTITY,
  user: { fields: USER_FIELDS, raw: { email: USER_EMAIL } },
  server: { fields: SERVER_FIELDS },
} = require('../entities.json');

describe('Session relations repository', function () {
  let Session;
  it('FindBy. Session belongs to user and user belongs to server', async () => {
    const user = await userRepo.findBy({ email: USER_EMAIL });
    Session = await repository.findBy({ userId: user.id }, true, true);

    expect(Session).to.have.all.keys([...ENTITY.fields, 'user']);
    expect(Session.user).to.be.an('object');
    expect(Session.user).to.have.all.keys([...USER_FIELDS, 'server']);
    expect(Session.user.server).to.be.an('object');
    expect(Session.user.server).to.have.all.keys(SERVER_FIELDS);
  });
});
