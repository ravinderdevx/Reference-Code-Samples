const fs        = require('fs');
const path      = require('path');

var routers = {};
const files = fs.readdirSync(__dirname);
const basename  = path.basename(__filename);

const router_files = files.filter((file) => {
  return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
});

router_files.forEach((file) => {
    let router = require(path.join(__dirname, file));
    let router_name = file.split('.')[0];
    routers[`${router_name}Router`] = router;
});

module.exports = routers;