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
  var shifted = pages.slice(1);

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

  slugs.push(shifted[0].slug);

  // reference to "root" dir for removing it on next build
  fs.writeFileSync(latestPath, shifted[0].slug);

  // index.html
  fs.writeFileSync(__dirname + '/index.html', template({
    filepath: filepath,
    slug: pages[0].slug,
    next: join('/', slugs[0]),
    title: pages[0].title,
    images: pages[0].images,
    pages: JSON.stringify(pages),
    link: data.link
  }));

  // images + coda
  _.each(shifted, function (page, i) {
    var next = (i == shifted.length - 1) ? null : shifted[i + 1].slug;
    var dir = join(__dirname, slugs.join('/'));

    if (next) slugs.push(next);

    console.log('creating ' + page.title);

    mkdirp.sync(dir);
    
    fs.writeFileSync(dir + '/index.html', template({
      filepath: filepath,
      slug: page.slug,
      next: next ? '/' + slugs.join('/') : data.link,
      title: page.title,
      background: page.background,
      pages: JSON.stringify(pages),
      link: data.link
    }));
  });

  // start server if any
  if (_.isFunction(callback)) callback();
}



if (require.main === module) {
  build({ filepath: process.argv[2] }, function () {
    console.log('done');
  });
}