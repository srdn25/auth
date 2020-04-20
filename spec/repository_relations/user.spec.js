const { user: repository } = require('../../src/repository');
const {
  user: ENTITY,
  session: ENTITY_SESSION,
} = require('../entities.json');

describe('Session relations repository', function () {
  let User;
  it('User has many sessions in findByEmail', async () => {
    User = await repository.findBy({ email: ENTITY.raw.email }, true, true);

    expect(User).to.have.all.keys([...ENTITY.fields, 'sessions']);
    expect(User.sessions.length).to.equal(1);
    expect(User.sessions[0]).to.have.all.keys(ENTITY_SESSION.fields);
  });

  it('User has many sessions in findById', async () => {
    User = await repository.findBy({ id: User.id }, true, true);

    expect(User).to.have.all.keys([...ENTITY.fields, 'sessions']);
    expect(User.sessions.length).to.equal(1);
    expect(User.sessions[0]).to.have.all.keys(ENTITY_SESSION.fields);
  });
});
