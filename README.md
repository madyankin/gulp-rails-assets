## Rails assets manifest management for Gulp

```js
var gulp   = require('gulp');
var assets = require('./');

gulp.task('assets', function() {
  return gulp.src('./app/assets/**/*.{js,css}')
    .pipe(assets({manifest: './public/assets/manifest.json'}))
    .pipe(gulp.dest('./public/assets'));
});
```
