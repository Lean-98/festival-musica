const { src, dest, watch, parallel } = require('gulp');

// CSS
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');

// Imagenes
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

// Javascript
const terser = require('gulp-terser-js');

function CSS ( done ) {
    src('src/scss/**/*.scss') // Identificar el archivo .SCSS a compilar
        .pipe(sourcemaps.init())
        .pipe( plumber())
        .pipe( sass() ) // Compilarlo
        .pipe ( postcss([autoprefixer(), cssnano()]) )
        .pipe(sourcemaps.write('.'))
        .pipe( dest('build/CSS') ) // Almacenarla en HDD
    done();
}

function imagenes( done ) {
    const opciones = {
        optimizationLevel: 3

    }
    src('src/img/**/*.{png,jpg}')   
    .pipe( cache( imagemin(opciones) ) )
    .pipe( dest('build/img') )
    done();
}

function versionWebp ( done ) {

    const opciones = {
        quality:60
    };

    src('src/img/**/*.{png,jpg}') // Identificar el archivo a compilar
        .pipe( webp(opciones) ) 
        .pipe( dest('build/img') ) // Almacenarla en HDD

    done();
}

function versionAvif ( done ) {

    const opciones = {
        quality:60
    };

    src('src/img/**/*.{png,jpg}') // Identificar el archivo a compilar
        .pipe( avif(opciones) ) 
        .pipe( dest('build/img') ) // Almacenarla en HDD

    done();
}

function javascript ( done ) {
   src('src/js/**/*.js')
       .pipe(sourcemaps.init())
       .pipe(terser() )
       .pipe(sourcemaps.write('.'))
       .pipe(dest('build/js'));
    
    done();
}

function dev ( done ) {
    watch('src/scss/**/*.scss', CSS); // Identifica el archivo y que tarea le voy a mandar a llamar
    watch('src/js/**/*.js', javascript);
    done();
}


exports.CSS = CSS;
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel (imagenes, versionWebp, versionAvif, javascript, dev);