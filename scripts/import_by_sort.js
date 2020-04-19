const fs = require('fs');
const path = require('path');

module.exports = function ({ folder, filter }) {
  const files = fs.readdirSync(folder);
  files.sort().forEach((file) => {
    if (filter.test(file)) {
      require(path.join(folder, file))
    }
  });
};
