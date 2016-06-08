/*global __dirname,process*/
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var del = require('del');
var fs = require('fs');
var _ = require('lodash');
var hasOwn = {}.hasOwnProperty;

var scriptSrcFiles = 'src/**/*.js';
var destJsFile = 'pingpp.js';
var entries = ['./src/main.js'];
var distDir = './dist/';
var distFiles = [distDir + '**/*.js', distDir + '**/*.js.map'];
var releaseObjectName = 'pingpp';
var channelsDir = './channels/';
var channelsDirPath = __dirname + '/src/channels/';
var replaceChannelsPattern = '<<REPLACE-CHANNELS>>';
var replaceLibsPattern = '<<REPLACE-EXTRAS>>';
var modsJsFile = __dirname + '/src/mods.js';
var deprecatedChannels = ['upmp_wap'];

var parseArgs = require('minimist');
var cmdOptions = parseArgs(process.argv.slice(2), {
  boolean: ['alipay_in_weixin', 'wx_jssdk'],
  string: ['channels', 'name']
});

gulp.task('default', ['build']);

gulp.task('build', ['clean', 'modules'], function() {
  if (hasOwn.call(cmdOptions, 'name') && cmdOptions.name.length > 0) {
    releaseObjectName = cmdOptions.name;
  }
  var b = browserify({
    entries: entries,
    standalone: releaseObjectName,
    debug: true
  });

  return b.bundle()
    .pipe(source(destJsFile))
    .pipe(buffer())
    .pipe(sourcemaps.init({
      loadMaps: true
    }))
    .pipe(uglify({
      mangle: {
        except: ['PingppSDK']
      },
      output: {
        quote_style: 3
      }
    }))
    .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(distDir));
});

gulp.task('modules', [], function() {
  var channels = makeChannelModulesContent();
  var libs = makeLibModulesContent();
  var tmpl = fs.readFileSync(__dirname + '/mods.js.tmpl', 'utf8');
  var modsContents = _.replace(tmpl,
    replaceChannelsPattern,
    channels.replacement);
  modsContents = _.replace(modsContents,
    replaceLibsPattern,
    libs.replacement);
  fs.writeFileSync(modsJsFile, modsContents, 'utf8');
  console.log('Enabled channels: ' + channels.enabledChannels);
});

gulp.task('clean', function() {
  var paths = del.sync(distFiles);
  console.log('Deleted files and folders:\n' + paths.join('\n'));
});

gulp.task('test', [], function() {
  var test = require('./test/test.js');
  test.run();
});

gulp.task('watch', ['build'], function() {
  var watcher = gulp.watch(scriptSrcFiles, ['build']);
  watcher.on('change', function(event) {
    console.log('File ' + event.path + ' was ' +
      event.type + ', running tasks...');
  });
});

var makeChannelModulesContent = function() {
  var channelPool = fs.readdirSync(channelsDirPath, 'utf8');
  var allChannels = _.map(channelPool, function(ch) {
    if (ch.substr(0, 1) == '.' || ch.substr(-3) != '.js') {
      return undefined;
    }
    return ch.substr(0, ch.length - 3);
  });
  allChannels = _.remove(allChannels, function(ch) {
    return typeof ch != 'undefined';
  });
  var enabledChannels;
  if (hasOwn.call(cmdOptions, 'channels') && cmdOptions.channels.length > 0) {
    enabledChannels = _.split(cmdOptions.channels, /[\s,]+/);
    _.forEach(enabledChannels, function(ch) {
      if (!_.includes(allChannels, ch)) {
        console.log('Channel ' + ch +
          ' is invalid. The channels you can use: ' + allChannels + '.');
        process.exit(0);
      }
    });
  } else {
    enabledChannels = _.remove(allChannels, function(ch) {
      return !_.includes(deprecatedChannels, ch);
    });
  }
  var channelsContents = [];
  for (var i = 0; i < enabledChannels.length; i++) {
    var line = enabledChannels[i] +
      ': require(\'' + channelsDir + enabledChannels[i] + '\')';
    channelsContents.push(line);
  }
  return {
    replacement: modnames2text(enabledChannels, channelsDir),
    enabledChannels: enabledChannels
  };
};

var makeLibModulesContent = function() {
  var extraBaseDir = './channels/extras/';
  var extranames = [];
  if (hasOwn.call(cmdOptions, 'alipay_in_weixin') &&
    cmdOptions.alipay_in_weixin) {
    extranames.push('ap');
  }
  if (hasOwn.call(cmdOptions, 'wx_jssdk') &&
    cmdOptions.wx_jssdk) {
    extranames.push('wx_jssdk');
  }
  return {
    replacement: modnames2text(extranames, extraBaseDir)
  };
};

var modnames2text = function(modnames, baseDir) {
  if (modnames.length === 0) {
    return '';
  }
  var modsContents = [];
  for (var i = 0; i < modnames.length; i++) {
    var line = modnames[i] +
      ': require(\'' + baseDir + modnames[i] + '\')';
    modsContents.push(line);
  }
  return '  ' + _.join(modsContents, ',\n  ');
};
