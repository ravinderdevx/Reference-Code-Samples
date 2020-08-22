'use strict';
const fs        = require('fs');
const path      = require('path');
const { filterModelName }  = require('../common/utilities/general');

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`, { useNewUrlParser: true }, () => {
    console.log("Connected to MongoDB");
});

var models = {};
const models_path = `${__dirname}/models`;
const files = fs.readdirSync(models_path);
const basename  = path.basename(__filename);

const model_files = files.filter((file) => {
  return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
});

model_files.forEach((file) => {
    let model = require(path.join(models_path, file));
    let model_name = filterModelName(file.split('.')[0]);
    //console.log(model_name);
    models[model_name] = model;
});


module.exports = models;