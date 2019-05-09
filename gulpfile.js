const gulp = require('gulp');
const through = require('through2');
const concat = require('gulp-concat');
const htmlmin = require('gulp-htmlmin');
const batchReplace = require('gulp-batch-replace');
const uglify = require('gulp-uglify-es').default;
const rm = require('gulp-rm');
const fs = require('fs');

const browserSync = require('browser-sync');
const minifyCss = require('gulp-minify-css');

const rev = require('gulp-rev');
const revdel = require('gulp-rev-delete-original');


gulp.task('clean', function (done) {
    gulp.src('./dist/**/*', {read: false})
        .pipe(rm({async: false}));

    gulp.src('./rev-manifest.json', {read: false, allowEmpty: true})
        .pipe(rm({async: false}));
    done();
});

const scripts = [
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/moment/min/moment.min.js',
    'src/js/main.js'
];

const styles = [
    'node_modules/weathericons/css/weather-icons.min.css',
    'src/css/style.css'
];

const imgs = [
    'src/images/**/*'
];

const json = [
    'src/json/**/*'
];

const fonts = [
    'node_modules/weathericons/font/**/*'
];

gulp.task('clean:img', (done) => {
    gulp.src('./dist/img/**/*')
        .pipe(rm({async: false}));
    done();
});

gulp.task('clean:json', (done) => {
    gulp.src('./dist/json/**/*')
        .pipe(rm({async: false}));
    done();
});

gulp.task('clean:fonts', (done) => {
    gulp.src('./dist/font/**/*')
        .pipe(rm({async: false}));
    done();
});

gulp.task('clean:css', (done) => {
    gulp.src('./dist/css/**/*')
        .pipe(rm({async: false}));
    done();
});

gulp.task('clean:html', (done) => {
    gulp.src('./dist/index.html')
        .pipe(rm({async: false}));
    done();
});

gulp.task('clean:js', (done) => {
    gulp.src('./dist/js/**/*')
        .pipe(rm({async: false}));
    done();
});

gulp.task('img', (done) => {
    gulp.src(imgs)
        .pipe(gulp.dest('./dist/images/'));
    done();
});

gulp.task('json', (done) => {
    gulp.src(json)
        .pipe(gulp.dest('./dist/json/'));
    done();
});

gulp.task('fonts', (done) => {
    gulp.src(fonts)
        .pipe(gulp.dest('./dist/font/'));
    done();
});

gulp.task('script', (done) => {

    gulp.src(scripts)
        .pipe(concat('script.js'))
        .pipe(uglify().on('error', function (e) {
            console.log(e);
        }))
        .pipe(gulp.dest('./dist/js'));
    done();
});

gulp.task('style', (done) => {
    gulp.src(styles)
        .pipe(concat('style.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest('./dist/css'));
    done();
});

gulp.task('html', (done) => {
    gulp.src('src/index.html')
        .pipe(gulp.dest('./dist'));
    done();
});

gulp.task('build:img', (done) => {
    if (!fs.existsSync('./rev-manifest.json')) {
        fs.writeFileSync('./rev-manifest.json', '{}');
    }
    gulp.src('./dist/images/**/*')
        .pipe(rev())
        .pipe(gulp.dest('./dist/images'))
        .pipe(revdel())
        .pipe(rev.manifest({
            merge: true // merge with the existing manifest if one exists
        }))
        .pipe(gulp.dest('./'));
    done();
});

gulp.task('build:css', (done) => {
    const replaceAssets = [];

    return gulp.src('./dist/css/*.css')
        .pipe(through.obj(function (chunk, enc, cb) {

            const json_assets = JSON.parse(fs.readFileSync('./rev-manifest.json'));

            for (const original in json_assets) {
                const item = json_assets[original];
                replaceAssets.push([original, item]);
            }

            cb(null, chunk)
        }))
        .pipe(batchReplace(replaceAssets))
        .pipe(rev())
        .pipe(gulp.dest('./dist/css'))
        .pipe(revdel())
        .pipe(rev.manifest({
            merge: true // merge with the existing manifest if one exists
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('build:js', (done) => {

    return gulp.src('./dist/js/*.js')
        .pipe(rev())
        .pipe(gulp.dest('./dist/js'))
        .pipe(revdel())
        .pipe(rev.manifest({
            merge: true // merge with the existing manifest if one exists
        }))
        .pipe(gulp.dest('./'));

});

gulp.task('build:html', () => {

    const replaceAssets = [];

    return gulp.src('src/index.html')

        .pipe(through.obj(function (chunk, enc, cb) {

            const json_assets = JSON.parse(fs.readFileSync('./rev-manifest.json'));

            for (const original in json_assets) {
                const item = json_assets[original];
                replaceAssets.push([original, item]);
            }

            cb(null, chunk)
        }))
        .pipe(batchReplace(replaceAssets))
        .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
        .pipe(gulp.dest('./dist/'), {overwrite: true});

});
/* Reload task */
gulp.task('bs-reload', (done) => {
    browserSync.reload();
    done();
});

/* Prepare Browser-sync for localhost */
gulp.task('browser-sync', (done) => {
    browserSync.init(['dist/css/*.css', 'dist/js/*.js'], {
        server: {
            baseDir: './dist'
        },
        watchEvents : [ 'change', 'add', 'unlink', 'addDir', 'unlinkDir' ]
    });
    done();
});

gulp.task('build', gulp.series('build:img', 'build:css', 'build:js', 'build:html'), (done) => {
    done();
});

gulp.task('default', gulp.parallel('img', 'json', 'fonts', 'style', 'script', 'html'), (done) => {
    done();
});

gulp.task('watch', gulp.series('default', 'browser-sync'), () => {

    gulp.watch(['src/css/**/*.css'], gulp.series('style'));

    gulp.watch(['src/js/**/*.js'], gulp.series('script'));

    gulp.watch(['src/images/**/*'], gulp.series('img'));

    gulp.watch(['src/json/**/*'], gulp.series('json'));

    gulp.watch(['src/index.html'], gulp.series('html', 'bs-reload'));
});
