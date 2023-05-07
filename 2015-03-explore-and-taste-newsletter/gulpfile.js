var gulp = require('../node_modules/gulp'),
	replace = require('../node_modules/gulp-replace'),
	inline = require('../node_modules/gulp-mc-inline-css'),

	APIKEY = '9705aa0c7600dd0bcb7825c2fe1f3c90-us4',
	file = './compiled/explore_and_taste.html',
	percorso_immagini = 'http://www.primominuto.net/email_test/explore_and_taste/';

gulp.task('default', function() {
	gulp.src([file])
		.pipe(inline(APIKEY))
	    .pipe(replace(/src="/g, 'src="../imgs/' + percorso_immagini))
	    .pipe(gulp.dest('./inlined'));
});
