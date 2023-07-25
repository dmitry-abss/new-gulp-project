const gulp = require('gulp');

require('./gulp/dev')
require('./gulp/docs')

gulp.task(
    'default',
    gulp.series(
      'clean:dev',
      gulp.parallel('images:dev', 'html:dev', 'sass:dev', 'js:dev'),
      gulp.parallel('server:dev', 'watch:dev')
    )
  );

  gulp.task(
    'docs',
    gulp.series(
      'clean:docs',
      gulp.parallel('images:docs', 'html:docs', 'sass:docs', 'js:docs'),
      gulp.parallel('server:docs', 'watch:docs')
    )
  );