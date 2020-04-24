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
        name: 'user',
        description: 'User in system',
      },
      {
        name: 'server',
        description: 'Server is a customer owner of web application',
      }
    ],
    paths: {
      '/api/v1/server': {
        post: {
          tags: ['server'],
          operationId: 'createServer',
          requestBody: {
            description: 'Server object to create',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/createServer',
                },
              },
            },
          },
          responses: {
            201: { description: 'OK' },
          }
        }
      },
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
            201: { description: 'OK' },
          }
        }
      },
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
        createServer: {
          type: 'object',
          description: 'Register new server. Allow only for users with serverId = 1',
          properties: {
            name: {
              type: 'string',
            },
            slug: {
              type: 'string',
            },
            url: {
              type: 'string',
            },
          },
          required: [
            'name',
            'slug',
            'url',
          ],
        },
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
          },
          required: [
            'name',
            'email',
            'password',
          ]
        },
      },
      securitySchemes: {
        ApiKey: {
          type: 'apiKey',
          in: 'headers',
          name: 'security-api-key',
        },
      },
    },
  },
  security: {
    ApiKey: [],
  },
});

api.register('unauthorizedHandler', (c, req, res) => {
  return res.status(401).json({ err: 'unauthorized' })
});

api.registerSecurityHandler('ApiKey', (c) => {
  return c.request.headers['security-api-key'] === 'SuperSecretPassword';
});

api.init();

module.exports = api;
