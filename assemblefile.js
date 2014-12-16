var assemble = require('assemble');
var render = require('template-render')(assemble);
var minify = require('gulp-minify-css');
var Loader = require('load-templates');
var ext = require('gulp-extname');
var path = require('path');

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
    .pipe(render({ layout: null }))
    .pipe(ext('.css'))
    .pipe(minify())
    .pipe(assemble.dest('_gh_pages/assets/css', { minimal: true }));
});

assemble.task('default', ['html', 'html2', 'blog', 'styles']);
