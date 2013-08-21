/* Modernizr 2.6.2 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-opacity-csstransitions-history-svg-touch-teststyles-testprop-testallprops-prefixes-domprefixes
 */
;window.Modernizr=function(a,b,c){function z(a){i.cssText=a}function A(a,b){return z(l.join(a+";")+(b||""))}function B(a,b){return typeof a===b}function C(a,b){return!!~(""+a).indexOf(b)}function D(a,b){for(var d in a){var e=a[d];if(!C(e,"-")&&i[e]!==c)return b=="pfx"?e:!0}return!1}function E(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:B(f,"function")?f.bind(d||b):f}return!1}function F(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+n.join(d+" ")+d).split(" ");return B(b,"string")||B(b,"undefined")?D(e,b):(e=(a+" "+o.join(d+" ")+d).split(" "),E(e,b,c))}var d="2.6.2",e={},f=b.documentElement,g="modernizr",h=b.createElement(g),i=h.style,j,k={}.toString,l=" -webkit- -moz- -o- -ms- ".split(" "),m="Webkit Moz O ms",n=m.split(" "),o=m.toLowerCase().split(" "),p={svg:"http://www.w3.org/2000/svg"},q={},r={},s={},t=[],u=t.slice,v,w=function(a,c,d,e){var h,i,j,k,l=b.createElement("div"),m=b.body,n=m||b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:g+(d+1),l.appendChild(j);return h=["&#173;",'<style id="s',g,'">',a,"</style>"].join(""),l.id=g,(m?l:n).innerHTML+=h,n.appendChild(l),m||(n.style.background="",n.style.overflow="hidden",k=f.style.overflow,f.style.overflow="hidden",f.appendChild(n)),i=c(l,a),m?l.parentNode.removeChild(l):(n.parentNode.removeChild(n),f.style.overflow=k),!!i},x={}.hasOwnProperty,y;!B(x,"undefined")&&!B(x.call,"undefined")?y=function(a,b){return x.call(a,b)}:y=function(a,b){return b in a&&B(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=u.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(u.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(u.call(arguments)))};return e}),q.touch=function(){var c;return"ontouchstart"in a||a.DocumentTouch&&b instanceof DocumentTouch?c=!0:w(["@media (",l.join("touch-enabled),("),g,")","{#modernizr{top:9px;position:absolute}}"].join(""),function(a){c=a.offsetTop===9}),c},q.history=function(){return!!a.history&&!!history.pushState},q.opacity=function(){return A("opacity:.55"),/^0.55$/.test(i.opacity)},q.csstransitions=function(){return F("transition")},q.svg=function(){return!!b.createElementNS&&!!b.createElementNS(p.svg,"svg").createSVGRect};for(var G in q)y(q,G)&&(v=G.toLowerCase(),e[v]=q[G](),t.push((e[v]?"":"no-")+v));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)y(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof enableClasses!="undefined"&&enableClasses&&(f.className+=" "+(b?"":"no-")+a),e[a]=b}return e},z(""),h=j=null,e._version=d,e._prefixes=l,e._domPrefixes=o,e._cssomPrefixes=n,e.testProp=function(a){return D([a])},e.testAllProps=F,e.testStyles=w,e}(this,this.document);



/* Almost there */

(function () {

var ENTER = 13;
var SPACEBAR = 32;
var RIGHT_ARR = 39;

var images;
var loading = document.getElementById('loading');



function handleKey (e) {
  if (e.keyCode === ENTER
      || e.keyCode === SPACEBAR
      || e.keyCode === RIGHT_ARR) {
    
    var href = document.querySelector('.next').href;
    window.location = href;
  }
}

function render (el) {
  var img = new Image;
  var src = el.getAttribute('data-src');

  if (!src) return;

  // SVG fallback
  if (/\.svg/.test(src) && !Modernizr.svg) src = src.replace('.svg', '.png');

  if (Modernizr.opacity) el.style.opacity = 0;
  el.style.display = 'none';

  addListener('load', function () {
    el.style.display = '';
    if (Modernizr.opacity) el.style.opacity = 1;
  }, img);
  img.src = src;
  loading.appendChild(img);

  el.style.backgroundImage = 'url(' + src + ')';
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


// lt-ie8 check
if (!'querySelector' in document) {
  alert('Your browser is too old.');

  // maybe add class to body to "unhide" hidden img tags
  // but make sure display:none images do not load before showing
}

// Go to next page on spacebar or enter
addListener('keydown', handleKey);

// special magic for special cases

// Render images
images = document.querySelectorAll('div');
for (var i = 0; i < images.length; i++) render(images[i]);

// Really pre-load
// use array inserted on template and load into a hidden div

})();