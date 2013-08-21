var fs = require('fs');
var _ = require('lodash');



_.templateSettings.variable = 'data';

exports.text = _.template(fs.readFileSync(__dirname + '/text.html', 'utf-8'));
exports.images = _.template(fs.readFileSync(__dirname + '/images.html', 'utf-8'));