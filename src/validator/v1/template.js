const requiredMethods = [
  'create',
  'update',
  'findBy',
  'getAll',
];

const generateValidError = (name) => new Error(
  `${name.charAt(0).toUpperCase()}${name.slice(1)} method not exist, or this is not AJV`
);

module.exports = function (validator) {
  const compiled = {
    removeById: (data) => {
      const ajv = new Ajv();

      const schema = {
        type: 'object',
        required: [
          'id',
        ],
        properties: {
          id: {
            type: [
              'string',
              'number',
            ],
          }
        }
      };

      const validate = ajv.compile(schema);
      const valid = validate(data);

      if(!valid) throw validate.errors;

      return data;
    },
  };

  for (const method of requiredMethods) {
    if (!validator[method]) {
      throw generateValidError(method);
    }
    compiled[method] = validator[method];
  }

  return compiled;
};
