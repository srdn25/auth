const fs = require('fs');
const path = require('path');

module.exports = function ({ folder = './', filter = '.js', regex = null }) {
  const files = fs.readdirSync(folder);
  return files.sort().reduce((acc, file) => {
    const clearFilter = filter.replace(/\./g, '\\.');

    const isFiltered = new RegExp(`${clearFilter}$`, 'i').test(file);

    // all files in folder, exclude index
    if (isFiltered && !file.includes(`index${filter}`)) {
      const defaultKeyRegExp = new RegExp(`(.+)(?:${clearFilter})$`);
      let key = file.match(defaultKeyRegExp)[1];

      // set special key from part of name by regex
      if (regex) {
        key = file.match(regex)[1];
      }

      acc[key] = require(path.join(folder, file));
    }

    return acc;
  }, {});
};
