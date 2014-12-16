var assemble = require('assemble');
var render = require('template-render')(assemble);
var minify = require('gulp-minify-css');
var Loader = require('load-templates');
var ext = require('gulp-extname');
var path = require('path');
var LessPluginAutoPrefix = require('less-plugin-autoprefix');
var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];
var autoprefix = new LessPluginAutoPrefix({
  browsers: AUTOPREFIXER_BROWSERS
});

// test out layouts inside a before middleware
assemble.before(/\.md/, function (file, next) {
  file.data.layout = 'post';
  next();
});

assemble.engine('less', require('engine-less'));
assemble.option({layout: 'default'});
assemble.option('assets', '_gh_pages/assets');

assemble.layouts('templates/layouts/*.hbs');
assemble.partials('templates/includes/*.hbs');

assemble.task('html', function() {
  return assemble.src('templates/*.hbs')
    .pipe(assemble.dest('_gh_pages'));
});

assemble.task('html2', function() {
  return assemble.src('templates/*.hbs')
    .pipe(assemble.dest('_gh_pages/bkp'));
});

assemble.task('blog', function () {
  return assemble.src('templates/posts/*.md')
    .pipe(assemble.dest('_gh_pages/blog'));
});

assemble.task('styles', ['html', 'html2', 'blog'], function() {
  return assemble.src('styles/*.less')
    .pipe(render({
      layout: null,
      plugins: [autoprefix],
      paths: [path.join(__dirname, '/node_modules/normalize.css')]
    }))
    .pipe(ext('.css'))
    .pipe(minify())
    .pipe(assemble.dest('_gh_pages/assets/css', { minimal: true }));
});

assemble.task('default', ['html', 'html2', 'blog', 'styles']);
