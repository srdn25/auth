'use strict';

const DEFAULT_USERS = [
  {
    name: process.env.ADMIN_NAME,
    email: 'srdn2417@gmail.com',
    password: process.env.ADMIN_PASSWORD,
  },
];

module.exports = {
  up: async (queryInterface) => {
    let updatedAt, createdAt = updatedAt = new Date();

    const [{ id: serverId } ] = await queryInterface.rawSelect(
      'server',
      {
        plain: false,
        where: { slug: process.env.SERVER_SLUG },
      },
      ['id'],
    );

    await queryInterface.bulkInsert('user', DEFAULT_USERS.map((u) => ({
      ...u,
      serverId,
      createdAt,
      updatedAt,
    })));
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('user', { email: DEFAULT_USERS.map((u) => u.email) });
  }
};
