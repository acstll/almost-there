var fs = require('fs');
var join = require('path').join;
var exec = require('child_process').exec;
var _ = require('lodash');
var mkdirp = require('mkdirp');

var data = require('./data.json');

_.templateSettings.variable = 'data';
var template = _.template(fs.readFileSync(__dirname + '/template.html', 'utf-8'));

var slugs = [];

var clean = false;
var latestPath = join(__dirname, 'latest');
var latest = fs.existsSync(latestPath)
  ? fs.readFileSync(latestPath, { encoding: 'utf-8' })
  : null;



module.exports = build;



function build (options, callback) {
  var filepath;
  var pages = data.pages;

  // remove folders from latest build
  if (!clean && typeof latest === 'string') {
    console.log('removing latest build...', latest);

    return exec('rm -r ' + latest, function (err) {
      if (err) console.warn(err);

      clean = true;
      build(options, callback);
    });
  }

  if (typeof options === 'function') callback = options;
  options = options || {};

  filepath = options.filepath || data.filepath;

  console.log('building...');

  slugs.push(pages[0].slug);

  // reference to "root" dir for removing it on next build
  fs.writeFileSync(latestPath, pages[0].slug);

  // index.html
  fs.writeFileSync(__dirname + '/index.html', template({
    filepath: filepath,
    next: join('/', slugs[0]),
    title: 'Aleix Plademunt',
    preload: JSON.stringify(pages[0].images)
  }));

  // images + coda
  _.each(pages, function (page, i) {
    var next = (i == pages.length - 1) ? null : pages[i + 1].slug;
    var dir = join(__dirname, slugs.join('/'));

    if (next) slugs.push(next);

    console.log('creating ' + page.title);

    mkdirp.sync(dir);
    
    fs.writeFileSync(dir + '/index.html', template({
      filepath: filepath,
      next: next ? '/' + slugs.join('/') : data.link,
      title: page.title,
      background: page.background,
      images: page.images,
      preload: next ? JSON.stringify(pages[i + 1].images) : null
    }));
  });

  // start server if any
  callback();
}



if (require.main === module) {
  build({ filepath: process.argv[2] }, function () {
    console.log('done');
  });
}