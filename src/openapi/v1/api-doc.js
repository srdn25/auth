const OpenApi = require('openapi-backend');

const api = new OpenApi({
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Auth server',
      version: require('../../../package.json').version,
    },
    paths: {
      '/api/v1/user': {
        post: {
          operationId: 'createUser',
          requestBody: {
            description: 'User object to create',
            content: {
              'application/json': {},
            },
            responses: {
              200: { description: 'OK' },
            }
          }
        }
      }
    },
    handlers: {
      createUser: async (c, ctx) => {
        ctx.body = { operationId: c.operation.operationId }
      }
    },
  },

});

api.init();

module.exports = api;
