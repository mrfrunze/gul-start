let gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require("gulp-rename"),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin');

    // gulp clear async - start firts clear with async after build
    gulp.task('clear', async function(){
        del.sync('dist');
    });

    // gulp images
    gulp.task('images', function(){
        return gulp.src('app/img/**/*')
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 75, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(gulp.dest('app/img'))
        .pipe(browserSync.reload({stream: true}))
    })

    // gulp scss (expanded) - to do perfect cod
    gulp.task('scss', function () {
        return gulp.src('app/scss/**/*.scss')
          .pipe(sass({outputStyle: 'compressed'}))
          .pipe(autoprefixer({
            overrideBrowserslist : ['last 9 versions']
          }))
          .pipe(rename({suffix: '.min'}))
          .pipe(gulp.dest('app/css'))
          .pipe(browserSync.reload({stream: true}))
    });

    // объеденяем все css gulp css
    gulp.task('css', function (){
        return gulp.src([
            'node_modules/normalize.css/normalize.css',
            'node_modules/slick-carousel/slick/slick.css',
            'node_modules/magnific-popup/dist/magnific-popup.css'
        ])
          .pipe(concat('_libs.scss'))
          .pipe(gulp.dest('app/scss'))
          .pipe(browserSync.reload({stream: true}))
    });

    gulp.task('html', function (){
        return gulp.src('app/*.html')
            .pipe(browserSync.reload({stream: true}))
    });

    gulp.task('script', function (){
        return gulp.src('app/js/*.js')
            .pipe(browserSync.reload({stream: true}))
    });

    // gulp js
    gulp.task('js', function (){
        return gulp.src([
            'node_modules/jquery/dist/jquery.js',
            'node_modules/slick-carousel/slick/slick.js',
            'node_modules/magnific-popup/dist/jquery.magnific-popup.js'
        ])
            .pipe(concat('libs.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest('app/js'))
            .pipe(browserSync.reload({stream: true}))
    });

    gulp.task('browser-sync', function() {
        browserSync.init({
            server: {
                baseDir: "app/"
            }
        });
    });

    // add folder dis for internet gulp build
    gulp.task('export', async function(){
        let buildHtml = gulp.src('app/**/*.html')
        .pipe(gulp.dest('dist'));

        let buildCss = gulp.src('app/css/**/*.css')
        .pipe(gulp.dest('dist/css'));

        let buildFonts = gulp.src('app/fonts/**/*.*')  // may be have others ttf wov wov 2 
        .pipe(gulp.dest('dist/fonts'));

        let buildJs = gulp.src('app/js/**/*.js')
        .pipe(gulp.dest('dist/js'));

        let buildImg = gulp.src('app/img/**/*.*')
        .pipe(gulp.dest('dist/img'));
    });


// gulp watch
gulp.task('watch', function () {
    gulp.watch('app/scss/**/*.scss', gulp.parallel('scss'));
    gulp.watch('app/*.html', gulp.parallel('html'));
    gulp.watch('app/js/*.js', gulp.parallel('script'));
});

// start firts clear with async after build
gulp.task('build', gulp.series('clear', 'export'));

// gulp
gulp.task('default', gulp.parallel('css', 'scss', 'js', 'browser-sync', 'watch'));