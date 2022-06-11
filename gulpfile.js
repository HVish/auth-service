/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const ts = require('gulp-typescript');
const nodemon = require('gulp-nodemon');
const FileCache = require('gulp-file-cache');

let cache = new FileCache();

const tsProject = ts.createProject(path.join(__dirname, 'tsconfig.json'));

const paths = {
  public: ['public/**/*.ts', 'public/**/*.tsx'],
  src: ['src/**/*.ts'],
  dest: 'dist',
};

function compileReact() {
  const stream = gulp
    .src(paths.public)
    .pipe(cache.filter()) // remember files
    .pipe(cache.cache()) // cache them
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: [
          '@babel/preset-env',
          '@babel/preset-react',
          '@babel/preset-typescript',
        ],
      })
    )
    .pipe(concat('public/main.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dest));
  return stream; // important for gulp-nodemon to wait for completion
}

function compileTs() {
  const stream = gulp
    .src(paths.src)
    // Caching file causes issue in rebuilding after file change
    // .pipe(cache.filter()) // remember files
    // .pipe(cache.cache()) // cache them
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dest)); // write them
  return stream; // important for gulp-nodemon to wait for completion
}

function clean(done) {
  fs.rm(paths.dest, { recursive: true, force: true }, function () {
    fs.unlink(path.join(__dirname, '.gulp-cache'), () => {
      cache = new FileCache(); // create file cache again
      done();
    });
  });
}

const build = gulp.series(compileReact, compileTs);

function watch(done) {
  nodemon({
    script: 'dist/index.js',
    ext: 'ts',
    watch: ['public', 'src'], // watch ES2015 code
    tasks: ['build'], // compile synchronously onChange
    done: done,
  });
}

module.exports.clean = clean;
module.exports.build = build;
module.exports.default = gulp.series(clean, build, watch);
