const OpenApi = require('openapi-backend').default;

const api = new OpenApi({
  validate: true,
  definition: {
    openapi: '3.0.2',
    info: {
      title: 'Auth server',
      version: require('../../../package.json').version,
      contact: {
        email: 'srdn2417@gmail.com'
      }
    },
    tags: [
      {
        name: 'User',
        description: 'User in system',
      },
      {
        name: 'createUser',
      }
    ],
    paths: {
      '/api/v1/user': {
        post: {
          tags: ['user'],
          operationId: 'createUser',
          requestBody: {
            description: 'User object to create',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/createUser',
                },
              },
            },
          },
          responses: {
            200: { description: 'OK' },
          }
        }
      }
    },
    components: {
      securitySchemes: {
        apiKey: {
          type: 'apiKey',
          in: 'header',
          name: 'security-api-key'
        }
      },
      schemas: {
        createUser: {
          type: 'object',
          description: 'serverId will get from server token',
          properties: {
            name: {
              type: 'string',
            },
            email: {
              type: 'string',
            },
            password: {
              type: 'string',
            },
          }
        }
      },
    },
  },

});

api.register('unauthorizedHandler', (c, req, res) => {
  return res.status(401).json({ err: 'unauthorized' })
});

api.registerSecurityHandler('ApiKey', (c) => {
  const authorized = c.request.headers['security-api-key'] === 'SuperSecretPassword';
  return authorized;
});

api.init();

module.exports = api;
