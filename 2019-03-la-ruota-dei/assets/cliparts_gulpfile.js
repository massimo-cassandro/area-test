/* eslint-env node */
// gulpfile cliparts


/*
  Questa procedura esegue la minificazione e ottimizzazione delle cliparts SVG
  e le combina in un unico file `cliparts.svg`

  La procedura esegue inoltre la costruzione del file `cliparts_list.js`,
  utilizzato dall'applicazione e dalla pagina di riepilogo `demo-cliparts.html`

*/

var gulp = require('gulp')
	,rename = require('gulp-rename')
	,file = require('gulp-file')
	,chmod = require('gulp-chmod')
	,svgstore = require('gulp-svgstore')
	,svgmin = require('gulp-svgmin')
;


var cliparts_list = []; // lista delle cliparts, utilizzate per il file demo

gulp.task('cliparts', function() {
	return gulp.src([ 'cliparts/*.svg'])

    	.pipe(rename(function (path) {

					var clip_name_parts = path.basename.split('--');

					path.basename = 'clipart-' + clip_name_parts[0];

					if(clip_name_parts.length === 2) {
						cliparts_list.push([clip_name_parts[1], path.basename]); // definizione, id
					} else {
						cliparts_list.push([clip_name_parts[0], path.basename]); // definizione, id
					}
	        return path;
	    }))
	    .pipe(svgmin(function () {
	        return {
		        // https://github.com/svg/svgo/tree/master/plugins
			    plugins: [
			    	{ cleanupIDs: { remove: true, minify: true } }
			    	, { removeDoctype: true }
			    	, { removeComments: true }
			    	, { removeTitle: true }
			    	, { removeDimensions: true }
		        , { cleanupNumericValues: { floatPrecision: 3  } }
		        , { convertColors: { names2hex: true, rgb2hex: true } }
            , { removeAttrs: { attrs: ['(fill|stroke|class|style|font-weight)'] } }
			    ]
			    //,js2svg: { pretty: true }
			};
	    }))
	    .pipe(svgstore())
      //.pipe( rename('cliparts.svg') )
    	.pipe(chmod(0o755))
    	.pipe(gulp.dest('./'));
});

gulp.task('cliparts_list', ['cliparts'], function() {
	var str = '// lista id cliparts per demo\n' +
		'// NB: questo file è generato dallo script gulpfile_cliparts.js, eventuali modifiche saranno sovrascritte\n' +
		'var cliparts_list = ' + JSON.stringify(cliparts_list, null, " ") + ';';

	return file('cliparts_list.js', str, { src: true })
    .pipe(gulp.dest('./'));
});
gulp.task('default', ['cliparts', 'cliparts_list']);
