const { server: serverRepo } = require('../repository');

const create = async (data) => {
  const saved = await serverRepo.create(data);
  // TODO: DTO, access to data
  return saved;
};

module.exports = {
  create,
};
