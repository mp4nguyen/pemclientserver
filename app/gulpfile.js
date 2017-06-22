
var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    gulpFilter = require('gulp-filter'),
    concat = require('gulp-concat');
// Scripts

gulp.task('myjs', function() {
    return gulp.src([
                        'common/**/**/*.js',
                        'modules/**/**/*.js',
                    ])
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/scripts'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts'));
});


var mainBowerFiles = require('main-bower-files');

gulp.task('mybower', function() {
    return gulp.src([
            "bower_components/socket.io-client/socket.io.js",
            "bower_components/jquery/dist/jquery.js",
            "bower_components/moment/moment.js",
            "bower_components/angular/angular.js",

            "bower_components/angular-ui-calendar/src/calendar.js",
            "bower_components/fullcalendar-scheduler/lib/fullcalendar.min.js",
            "bower_components/fullcalendar-scheduler/lib/gcal.js",
            "bower_components/fullcalendar-scheduler/scheduler.js",

            "bower_components/angular-animate/angular-animate.js",
            "bower_components/angular-cookies/angular-cookies.js",
            "bower_components/angular-resource/angular-resource.js",
            "bower_components/angular-sanitize/angular-sanitize.js",
            "bower_components/angular-touch/angular-touch.js",
            "bower_components/angular-ui-router/release/angular-ui-router.js",
            "bower_components/ui-router-extras/release/ct-ui-router-extras.js",
            "bower_components/AngularJS-Toaster/toaster.js",
            "bower_components/angular-toastr/dist/angular-toastr.tpls.js",
            "bower_components/lodash/lodash.js",
            "bower_components/fingerprint/fingerprint.js",

            "bower_components/angular-ui-grid/ui-grid.js",
            "bower_components/pdfmake/build/pdfmake.js",
            "bower_components/pdfmake/build/vfs_fonts.js",
            "bower_components/bootstrap/dist/js/bootstrap.js",
            "bower_components/jquery-ui/jquery-ui.js",
            "bower_components/angular-bootstrap/ui-bootstrap-tpls.js",
            "bower_components/checklist-model/checklist-model.js",
            "bower_components/toastr/toastr.js",
            "bower_components/ag-grid/dist/ag-grid.js",
            "bower_components/bootstrap-switch/dist/js/bootstrap-switch.js",
            "bower_components/angular-bootstrap-switch/dist/angular-bootstrap-switch.js",
            "bower_components/ng-idle/angular-idle.js",
            "bower_components/ui-select/dist/select.js",
            "bower_components/requirejs/require.js",
            "bower_components/angular-logX/release/amd/angular-logX.js",
            "bower_components/circular-json/build/circular-json.js",
            "bower_components/ZingChart-AngularJS/src/zingchart-angularjs.js",
            "bower_components/zingchart/client/zingchart.min.js",
            "bower_components/bootstrap-ui-datetime-picker/dist/datetime-picker.min.js",
            "bower_components/ui-router-extras/release/modular/ct-ui-router-extras.core.js",
            "bower_components/ui-router-extras/release/modular/ct-ui-router-extras.statevis.js",
            "bower_components/ui-router-extras/release/modular/ct-ui-router-extras.sticky.js",
            "bower_components/ui-router-extras/release/modular/ct-ui-router-extras.dsr.js",
            "bower_components/stacktrace/stacktrace.js",
            "bower_components/acute-select/acute/acute.select/acute.select.js",
            "bower_components/pdfmake/build/pdfmake.js",
            "bower_components/pdfmake/build/vfs_fonts.js"
    ])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('dist/vendor'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/vendor'));
});

gulp.task('mycss', function() {
    return gulp.src([
            "bower_components/toastr/toastr.css",
            "bower_components/ag-grid/dist/ag-grid.css",
            "bower_components/ag-grid/dist/theme-fresh.css",
            "bower_components/acute-select/acute/acute.select/acute.select.css",
            "styles/main.css",
            "styles/checkbox.css",
            "bower_components/angular-ui-grid/ui-grid.min.css",
            "bower_components/bootstrap/dist/css/bootstrap.css",
            "bower_components/ui-select/dist/select.css",
            "common/css/selectize.default.css",
            "common/css/font-awesome-4.5.0/css/font-awesome.min.css",
            "../assets/global/plugins/font-awesome/css/font-awesome.min.css",
            "../assets/global/plugins/simple-line-icons/simple-line-icons.min.css",
            "../assets/global/plugins/uniform/css/uniform.default.css",
            "../assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css",
            "../assets/global/plugins/bootstrap-daterangepicker/daterangepicker.min.css",
            "../assets/global/plugins/morris/morris.css",
            "../assets/global/plugins/fullcalendar/fullcalendar.min.css",
            "../assets/global/plugins/jqvmap/jqvmap/jqvmap.css",
            "../assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css",
            "../assets/global/plugins/select2/css/select2.min.css",
            "../assets/global/plugins/select2/css/select2-bootstrap.min.css",
            "../assets/global/css/components.min.css",
            "../assets/global/css/plugins.min.css",
            "../assets/layouts/layout3/css/layout.min.css",
            "../assets/layouts/layout3/css/themes/default.min.css",
            "../assets/layouts/layout3/css/custom.min.css",
            "../assets/pages/css/login-2.min.css"
    ])
        .pipe(concat('mycss.css'))
        .pipe(gulp.dest('dist/vendor'));
});
