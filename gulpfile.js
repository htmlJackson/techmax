import gulp from 'gulp';
import plumber from 'gulp-plumber';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import postcss from 'gulp-postcss';
import csso from 'postcss-csso';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import rename from 'gulp-rename';
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser';
import squoosh from 'gulp-libsquoosh';
import svgo from 'gulp-svgmin';
import del from 'del';
import svgstore from 'gulp-svgstore';
const sass = gulpSass(dartSass);

// Styles
const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// HTML
const html = () =>
  gulp.src('source/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'))
    .pipe(browser.stream());

// Scripts
const scripts = () =>
  gulp.src('source/js/*.js')
    .pipe(terser())
    .pipe(gulp.dest('build/js'));


// Server
const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
    port: 3005,
  });
  done();
}

// Images
const optimizeImages = () =>
  gulp.src('source/img/**/*.{jpg,png}')
  .pipe(squoosh())
  .pipe(gulp.dest('build/img'));

const copyImages = () =>
  gulp.src('source/img/**/*.{jpg,png}')
  .pipe(gulp.dest('build/img'));

// WEBP
export const generateWebp = () =>
  gulp.src('source/img/**/*.{jpg,png}')
    .pipe(squoosh({
      webp: {}
    }))
    .pipe(gulp.dest('build/img'));

// SVG
const svg = () =>
  gulp.src(['source/img/*.svg', '!source/img/icons/*.svg'])
    .pipe(svgo())
    .pipe(gulp.dest('build/img'));

// SVG sprite
const sprite = () =>
  gulp.src('source/img/icons/*.svg')
    .pipe(svgo())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img'))

// Copy
const copy = (done) =>
  gulp.src([
    'source/fonts/*.{woff2,woff}',
    'source/*.ico'
  ], {
    base: 'source'
  })
    .pipe(gulp.dest('build'));

// Clean
const clean = () =>
  del('build');

// Watcher
const watcher = () => {
  gulp.watch('source/img/**/*.{jpg,png,svg}', gulp.series(optimizeImages, svg));
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/js/*.js', gulp.series(scripts));
  gulp.watch('source/*.html', gulp.series(html));
  // gulp.watch('source/*.html').on('change', browser.reload);
}


// Build

export const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  // generateWebp,
  gulp.parallel(
    styles,
    html,
    scripts,
    svg,
    sprite,
  ),
);

export default gulp.series(
  clean,
  copy,
  copyImages,
  // generateWebp,
  gulp.parallel(
    html,
    styles,
    scripts,
    svg,
    sprite,
  ),
  gulp.series(
    server,
    watcher,
  ),
);
