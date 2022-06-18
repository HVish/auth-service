/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const ts = require('gulp-typescript');
const nodemon = require('gulp-nodemon');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');

const tsProject = ts.createProject(path.join(__dirname, 'tsconfig.json'));

const paths = {
  views: ['src/views/client.entry.tsx', 'src/views/server.entry.tsx'],
  src: ['src/**/*.ts', '!src/views/*'],
  dest: 'dist',
};

function clientEntry() {
  const stream = gulp
    .src('src/views/client.entry.tsx')
    .pipe(webpackStream(require('./webpack.config.client'), webpack))
    .pipe(gulp.dest(path.join(paths.dest, 'public')));
  return stream; // important for gulp-nodemon to wait for completion
}

function serverEntry() {
  const stream = gulp
    .src('src/views/server.entry.tsx')
    .pipe(webpackStream(require('./webpack.config.server'), webpack))
    .pipe(gulp.dest(path.join(paths.dest, 'public')));
  return stream; // important for gulp-nodemon to wait for completion
}

function compileTs() {
  const stream = gulp
    .src(paths.src)
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dest)); // write them
  return stream; // important for gulp-nodemon to wait for completion
}

function clean(done) {
  fs.rm(paths.dest, { recursive: true, force: true }, () => done());
}

const build = gulp.parallel(clientEntry, serverEntry, compileTs);

function watch(done) {
  nodemon({
    script: 'dist/index.js',
    ext: 'ts,tsx',
    watch: ['src'], // watch ES2015 code
    tasks: ['build'], // compile synchronously onChange
    done: done,
  });
}

module.exports.clean = clean;
module.exports.build = build;
module.exports.default = gulp.series(clean, build, watch);
