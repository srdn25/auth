'use strict';

const DEFAULT_SERVERS = [
  {
    name: 'Auth server',
    slug: process.env.SERVER_SLUG,
    url: 'https://localhost',
  },
];

module.exports = {
  up: async (queryInterface) => {
    let updatedAt, createdAt = updatedAt = new Date();

    await queryInterface.bulkInsert('server', DEFAULT_SERVERS.map((s) => ({
      ...s,
      createdAt,
      updatedAt,
    })));
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('server', { slug: DEFAULT_SERVERS.map((s) => s.slug) });
  }
};
