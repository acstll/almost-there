/* Almost there */

(function (global) {

var ENTER = 13;
var SPACEBAR = 32;
var RIGHT_ARR = 39;

var pages = global.pages;
var currentIndex = _.findIndex(pages, { slug: global.slug });

var imagesEl = document.getElementById('images');
var loadingEl = document.getElementById('loading-box');
var spinnerEl = document.getElementById('spinner');
var textEl = document.getElementById('text');
var nextEl = document.getElementById('next');



function handler (e) {
  if (e.type == 'click') {
    e.preventDefault();

    return next();
  }

  if (e.keyCode === ENTER || e.keyCode === SPACEBAR || e.keyCode === RIGHT_ARR) {
    next();
  }
}

function next () {
  if (Modernizr.history) {
    var page = pages[++currentIndex];
    
    if (!page) {
      window.location = global.link;
      return;
    }
    
    return run(page, true);
  }

  window.location = nextEl.href;
}

function run (page, push) {
  var nextPage = pages[currentIndex + 1];
  var nextImages = nextPage ? nextPage.images : [];
  var timer = document.getElementById('timer');
  var i;

  // Set title.
  document.body.title = page.title;

  // Set background.
  document.body.className = page.background;

  // Clean up.
  imagesEl.innerHTML = '';
  textEl.innerHTML = '';
  loadingEl.innerHTML = '';
  if (timer) timer.parentNode.removeChild(timer);

  // Next URL.
  nextEl.href = nextPage ? url() + nextPage.slug : global.link;

  // Preload follow up images.
  if (nextImages.length) {
    _.each(nextImages, function (image) { load(image.src, true); });
  }

  // Render.
  // el -> class: position-n size-n orientation, style: z-index
  _.each(page.images, function (image) {
    var el = document.createElement('div');

    el.className = image.class + ' position-' + image.position + ' size-' + image.size + ' ' + image.orientation;
    el.style.zIndex = image.z;

    render(el, {
      src: image.src,
      action: image.action,
      delay: image.delay,
      slug: page.slug,
      text: page.text
    });
  });

  // URL.
  if (push) window.history.pushState({ slug: page.slug }, page.slug, url());
}

function url () {
  return _.reduce(pages, reducer, '/');

  function reducer (url, page, key) {
    if (key > currentIndex || page.slug === '') return url;
    url = url + page.slug + '/';
    return url;
  }
}

function render (el, data) {
  var img;
  var src = data.src;
  var action = data.action;
  var delay = data.delay || 500;

  if (!src) return;

  spin(true);

  // SVG fallback.
  if (/\.svg/.test(src) && !Modernizr.svg) src = src.replace('.svg', '.png');

  el.style.display = 'none';

  img = load(src);
  addListener('load', show, img);
  loadingEl.appendChild(img);

  function show () {
    spin(false);
    
    if (action === 'hold') {
      _.delay(function () { el.style.display = ''; }, delay);
      return;
    }

    if (action === 'remove') {
      _.delay(function () { el.style.display = 'none'; }, delay);
    }

    el.style.display = '';
    
    // For '8.2 minutes' page only.
    if (data.slug === '8.2-minutes') showTimer();
  }

  if (data.text) _.delay(function () {
    textEl.innerHTML = data.text;
    textEl.style.display = 'block';
  }, 1000);

  el.style.backgroundImage = 'url(' + img.src + ')';
  imagesEl.appendChild(el);
}



// Helpers.

function load (src, preload) {
  if (!src) return;

  var img = new Image();
  img.src = global.filepath + src;
  if (preload) loadingEl.appendChild(img);
  return img;
}

// IE8 bullshit
function addListener (type, handler, el) {
  el = el || document;

  if ('addEventListener' in el) {
    el.addEventListener(type, handler, false);
  } else {
    el.attachEvent('on' + type, handler);
  }

  return el;
}

function spin (start) {
  var display = start ? 'block' : '';
  spinnerEl.style.display = display;
}



// Timer for 8.2 minutes page.

function showTimer () {
  var markup = timerMarkup();
  var ahead = Date.now() + 492000;
  var running = setInterval(tick, 999);
  
  function tick () {
    var point = ahead - Date.now();
    var moment = new Date(point);

    if (point <= 0) clear();

    markup.min.textContent = moment.getMinutes();
    markup.sec.textContent = pad(moment.getSeconds());
  }  

  function clear () {
    clearInterval(running);
    document.body.removeChild(markup.el);
  }

  function pad (value) {
    var number = value.toString();
    return (number.length === 1) ? '0' + number : number; 
  }

  document.body.appendChild(markup.el);
}

function timerMarkup () {
  var container = document.createElement('div');
  var min = document.createTextNode('-');
  var colon = document.createTextNode(':');
  var sec = document.createTextNode('--');
  
  container.id = 'timer';
  container.appendChild(min);
  container.appendChild(colon);
  container.appendChild(sec);

  return {
    el: container,
    min: min,
    sec: sec
  };
}

function pop (e) {
  var slug = e.state ? e.state.slug : global.slug;
  currentIndex = !slug ? 0 : _.findIndex(pages, { slug: slug });
  run(pages[currentIndex], false);
}



run(pages[currentIndex], false);

// Listen.

if (Modernizr.history) {
  addListener('popstate', pop, global);
  addListener('click', handler, nextEl);  
}

addListener('keydown', handler);
if (Modernizr.touch) Hammer(nextEl).on('swipeleft', next);

})(window);