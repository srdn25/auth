const { Sequelize } = require('../../src/psql/models');
const psql = require('../../src/psql/models');
const {
  lastPage,
  itemsOnLastPage,
  compareHashPassword,
  hashUserPassword,
} = require('../../src/helper');
const {
  getPlainFromSequelize,
} = require('../../src/helper/postgresHelpers');

describe('Helpers index', function () {
  const Password = {
    raw: 'secret',
    hash: null,
  };

  it('Get last page', () => {
    const calc = lastPage(35, 8);

    expect(calc).to.equal(5);
  });

  it('Get count items on last page', () => {
    const calc = itemsOnLastPage(35, 8);

    expect(calc).to.equal(3);
  });

  it('Get simple object from Sequelize object', async () => {
    const seqServer = await psql.server.create({
      "name": "Test helpers",
      "slug": "test_helpers",
      "url": "http://localhost/1abc/helpers"
    });
    const calc = getPlainFromSequelize(seqServer, true);

    expect(seqServer instanceof Sequelize.Model).to.be.true;
    expect(calc instanceof Sequelize.Model).to.be.false;
  });

  it('Hash user password', () => {
    Password.hash = hashUserPassword(Password.raw);
    expect(Password.hash).to.not.equal(Password.raw);
  });

  it('Compare user password', () => {
    expect(compareHashPassword(Password.raw, Password.hash)).to.be.true;
  });
});
