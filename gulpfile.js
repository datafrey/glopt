const fs = require('fs');
const path = require('path');

const gulp = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const webpackStream = require('webpack-stream');

const dist = './dist/';
const src = './src/';

gulp.task('start-project', () => {
  const fsCb = error => error 
    ? console.log(error.toString()) 
    : undefined;

  fs.mkdir(path.join(__dirname, dist), fsCb);
  fs.mkdir(path.join(__dirname, src), fsCb);

  const gitignoreContent = `# See https://help.github.com/ignore-files/ for more about ignoring files.

# dependencies
/node_modules

# testing
/coverage

# production
/build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*  
`;

  fs.writeFile(path.join(__dirname, '.gitignore'), gitignoreContent, fsCb);

  const eslintrcContent = `{
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "rules": {
    "no-var": "error",
    "no-unused-vars": "error",
    "semi": "error",
    "no-multi-spaces": "error",
    "space-in-parens": "error",
    "prefer-const": "error",
    "no-use-before-define": "error"
  }
}`;

  fs.writeFile(path.join(__dirname, '.eslintrc.json'), eslintrcContent, fsCb);

  const distFolders = [ 'css', 'fonts', 'icons', 'img', 'js' ];
  const srcFolders = [ ...distFolders.slice(1), 'scss' ];

  distFolders.forEach(
    folder => fs.mkdir(path.join(__dirname, dist, folder), fsCb));

  srcFolders.forEach(
    folder => fs.mkdir(path.join(__dirname, src, folder), fsCb));

  fs.writeFile(path.join(__dirname, dist, 'index.html'), 
    '<head></head><body></body>', fsCb);
  fs.writeFile(path.join(__dirname, dist, 'css', 'style.min.css'), '', fsCb);
  fs.writeFile(path.join(__dirname, dist, 'js', 'bundle.js'), '', fsCb);

  const indexHTMLContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <link rel="stylesheet" href="css/style.min.css">
</head>
<body>
  
  <script src="js/bundle.js"></script>
</body>
</html>`;

  fs.writeFile(
    path.join(__dirname, src, 'index.html'), indexHTMLContent, fsCb);

  fs.mkdir(path.join(__dirname, src, 'js', 'modules'), fsCb);
  fs.writeFile(path.join(__dirname, src, 'js', 'main.js'), '', fsCb);

  const styleSCSSContent = `// libs imports

@import 'base/fonts';
@import 'base/variables';
@import 'base/mixins';
@import 'base/animations';

* {

}

// blocks imports`;

  fs.writeFile(
    path.join(__dirname, src, 'scss', 'style.scss'), styleSCSSContent, fsCb);
  
  const scssFolders = [ 'base', 'blocks', 'libs' ];
  scssFolders.forEach(folder => {
    fs.mkdir(path.join(__dirname, src, 'scss', folder), fsCb);
  });

  const scssBaseFiles = [
    '_animations.scss', 
    '_fonts.scss', 
    '_mixins.scss', 
    '_variables.scss' 
  ];
  scssBaseFiles.forEach(filename => {
    fs.writeFile(
      path.join(__dirname, src, 'scss', 'base', filename), '', fsCb);
  });

  return gulp.src('.');
});

gulp.task('html', () => {
	return gulp.src('src/*.html')
          .pipe(htmlmin({ collapseWhitespace: true }))
          .pipe(gulp.dest(dist))
          .pipe(browserSync.stream());
});

gulp.task('styles', () => {
	return gulp.src('src/scss/**/*.+(scss|sass)')
          .pipe(
            sass({ outputStyle: 'compressed' })
              .on('error', sass.logError)
          )
          .pipe(rename({ prefix: '', suffix: '.min' }))
          .pipe(autoprefixer({ cascade: false }))
          .pipe(cleanCSS({ compatibility: 'ie8' }))
          .pipe(gulp.dest(`${ dist }/css`))
          .pipe(browserSync.stream());
});

gulp.task('scripts', () => {
	return gulp.src('src/js/**/*.js')
          .pipe(webpackStream({
            mode: 'development',
            entry: './src/js/main.js',
            output: {
              filename: 'bundle.js',
              path: __dirname + `${ dist }/js`
            },
            watch: false,
            devtool: 'source-map',
            module: {
              rules: [
                {
                  test: /\.m?js$/,
                  exclude: /(node_modules|bower_components)/,
                  use: {
                    loader: 'babel-loader',
                    options: {
                      presets: [
                        [
                          '@babel/preset-env', 
                          {
                            debug: true,
                            corejs: 3,
                            useBuiltIns: 'usage'
                          }
                        ]
                      ]
                    }
                  }
                }
              ]
            }
          }))
          .pipe(gulp.dest(`${ dist }/js`))
          .pipe(browserSync.stream());
});

gulp.task('fonts', () => {
	return gulp.src('src/fonts/**/*')
          .pipe(gulp.dest(`${ dist }/fonts`))
          .pipe(browserSync.stream());
});

gulp.task('icons', () => {
	return gulp.src('src/icons/**/*')
          .pipe(gulp.dest(`${ dist }/icons`))
          .pipe(browserSync.stream());
});

gulp.task('images', () => {
	return gulp.src('src/img/**/*')
          .pipe(
            imagemin([
              imagemin.gifsicle({ interlaced: true }),
              imagemin.mozjpeg({ quality: 90, progressive: true }),
              imagemin.optipng({ optimizationLevel: 5 }),
              imagemin.svgo({
                plugins: [
                  { removeViewBox: true }, 
                  { cleanupIDs: false }
                ]
              })
            ])
          )
          .pipe(gulp.dest(`${ dist }/img`))
          .pipe(browserSync.stream());
});

gulp.task('watch', () => {
  const bsPort = 3000;
  browserSync.init({
		server: dist,
    port: bsPort,
    ui: {
      port: bsPort + 1
    },
    notify: true
	});

	gulp.watch('src/*.html').on('change', gulp.parallel('html'));
	gulp.watch('src/scss/**/*.+(scss|sass|css)', gulp.parallel('styles'));
	gulp.watch('src/js/**/*.js').on('change', gulp.parallel('scripts'));
	gulp.watch('src/fonts/**/*').on('all', gulp.parallel('fonts'));
	gulp.watch('src/icons/**/*').on('all', gulp.parallel('icons'));
	gulp.watch('src/img/**/*').on('all', gulp.parallel('images'));
});

gulp.task('build-production-scripts', () => {
	return gulp.src('src/js/**/*.js')
          .pipe(webpackStream({
            mode: 'production',
            entry: './src/js/main.js',
            output: {
              filename: 'bundle.js',
              path: __dirname + `${ dist }/js`
            },
            module: {
              rules: [
                {
                  test: /\.m?js$/,
                  exclude: /(node_modules|bower_components)/,
                  use: {
                    loader: 'babel-loader',
                    options: {
                      presets: [
                        [
                          '@babel/preset-env', 
                          {
                            corejs: 3,
                            useBuiltIns: 'usage'
                          }
                        ]
                      ]
                    }
                  }
                }
              ]
            }
          }))
          .pipe(gulp.dest(`${ dist }/js`));
});

gulp.task('default', gulp.parallel('watch'));
