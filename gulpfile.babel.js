import gulp from "gulp";
import del from "del";
import sass from "gulp-sass";
import minify from "gulp-csso";
import bro from "gulp-bro";
import babelify from "babelify";
import ghPages from "gulp-gh-pages";
import autoprefixer from "gulp-autoprefixer";

sass.compiler = require("node-sass");

const routes = {
  css: {
    watch: "src/scss/*",
    src: "src/scss/styles.scss",
    dest: "dist/css",
  },
  js: {
    watch: "src/js/*.js",
    src: "src/js/main.js",
    dest: "dist/js",
  },
};

const styles = () =>
  gulp
    .src(routes.css.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({
        flexbox: true,
        grid: "autoplace",
      })
    )
    .pipe(minify())
    .pipe(gulp.dest(routes.css.dest));

const js = () =>
  gulp
    .src(routes.js.src)
    .pipe(
      bro({
        transform: [babelify.configure({ presets: ["@babel/preset-env"] })],
      })
    )
    .pipe(gulp.dest(routes.js.dest));

const deploy = () => gulp.src("dist/**/*").pipe(ghPages());

const watch = () => {
  gulp.watch(routes.css.watch, styles);
  gulp.watch(routes.js.watch, js);
};

const clean = () => del(["dist/styles.css"]);
const prepare = gulp.series([clean]);
const assets = gulp.series([styles, js]);
const live = gulp.parallel([watch]);
export const dev = gulp.series([prepare, assets, live]);
