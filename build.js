var fs = require('fs');
var join = require('path').join;
var exec = require('child_process').exec;
var _ = require('lodash');
var mkdirp = require('mkdirp');

var template = require('./templates');
var data = require('./data.json');

var slugs = [];

var clean = false;
var latestPath = join(__dirname, 'latest');
var latest = fs.existsSync(latestPath)
  ? fs.readFileSync(latestPath, { encoding: 'utf-8' })
  : null;



module.exports = build;



function build (options, callback) {
  var filepath;
  var images = data.images;

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

  slugs.push(images[0].slug);

  // reference to "root" dir for removing it on next build
  fs.writeFileSync(latestPath, images[0].slug);

  // index.html
  fs.writeFileSync(__dirname + '/index.html', template.text({
    next: join('/', slugs[0]),
    title: 'Aleix Plademunt',
    text: 'Aleix Plademunt'
  }));

  // image pages + coda
  _.each(images, function (image, i) {
    var next = (i == images.length - 1) ? null : images[i + 1].slug;

    var type = next ? 'images' : 'text';
    var dir = join(__dirname, slugs.join('/'));

    if (next) slugs.push(next);

    mkdirp.sync(dir);
    
    fs.writeFileSync(dir + '/index.html', template[type]({
      next: '/' + slugs.join('/'),
      title: image.title
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