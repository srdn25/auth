const OpenApi = require('openapi-backend').default;

const api = new OpenApi({
  definition: {
    openapi: '3.0.2',
    info: {
      title: 'Auth server',
      version: require('../../../package.json').version,
      contact: {
        email: 'srdn2417@gmail.com'
      }
    },
    tegs: [
      {
        name: 'User',
        description: 'User in system',
      }
    ],
    paths: {
      '/api/v1/user': {
        post: {
          tags: ['user'],
          operationId: 'createUser',
          requestBody: {
            required: true,
            description: 'User object to create',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                    },
                  }
                },
              },
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
      },
      validationFail: async (c, ctx) => {
        ctx.body = { err: c.validation.errors };
        ctx.status = 400;
      },
      notFound: async (c, ctx) => {
        console.log(c);
        ctx.body = { err: 'not found' };
        ctx.status = 404;
      },
    },
  },

});

api.init();

module.exports = api;
