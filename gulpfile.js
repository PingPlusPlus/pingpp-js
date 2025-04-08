/*global __dirname,process*/
const { series, watch, dest } = require('gulp');

var browserify = require('browserify');
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
var distFiles = [
  distDir + '/' + destJsFile,
  distDir + '/' + destJsFile + '.map'
];
var releaseObjectName = 'pingpp';
var channelsDir = './channels/';
var channelsDirPath = __dirname + '/src/channels/';
var replaceChannelsPattern = '<<REPLACE-CHANNELS>>';
var replaceLibsPattern = '<<REPLACE-EXTRAS>>';
var modsJsFile = __dirname + '/src/mods.js';
var deprecatedChannels = ['upmp_wap'];

var parseArgs = require('minimist');
var cmdOptions = parseArgs(process.argv.slice(2), {
  boolean: ['alipay_in_weixin', 'wx_jssdk', 'agreement'],
  string: ['channels', 'name']
});

function build(cb) {
  if (hasOwn.call(cmdOptions, 'name') && cmdOptions.name.length > 0) {
    releaseObjectName = cmdOptions.name;
  }

  var b = browserify({
    entries: entries,
    standalone: releaseObjectName,
    debug: true
  });

  b.bundle()
    .pipe(source(destJsFile))
    .pipe(buffer())
    // .pipe(sourcemaps.init({
    //   loadMaps: true
    // }))
    .pipe(uglify({
      mangle: {
        reserved: ['PingppSDK']
      },
      output: {
        quote_style: 3,
        max_line_len: 32000
      }
    }))
    .on('error', gutil.log)
    // .pipe(sourcemaps.write('./'))
    .pipe(dest(distDir));

  cb();
}

function modules(cb) {
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
  cb();
}

function clean(cb) {
  var paths = del.sync(distFiles);
  console.log('Deleted files and folders:\n' + paths.join('\n'));
  cb();
}

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
  if (hasOwn.call(cmdOptions, 'agreement')) {
    extranames.push(['agreement', './agreement']);
  }

  return {
    replacement: modnames2text(extranames, extraBaseDir)
  };
};

var modnames2text = function(modnames, baseDir) {
  if (modnames.length === 0) {
    return '';
  }
  if (baseDir === undefined || baseDir === null) {
    baseDir = '';
  }
  var modsContents = [];
  for (var i = 0; i < modnames.length; i++) {
    var modname;
    var path;
    if (typeof modnames[i] === 'string') {
      modname = modnames[i];
      path = baseDir + modname;
    } else if (Array.isArray(modnames[i])) {
      modname = modnames[i][0];
      path = modnames[i][1];
    }
    var line = modname +
      ': require(\'' + path + '\')';
    modsContents.push(line);
  }

  return '  ' + _.join(modsContents, ',\n  ');
};

function watchFiles(cb) {
  var watcher = watch(scriptSrcFiles, series(build));
  watcher.on('change', function(path) {
    console.log('File \'' + path + '\' was changed, running tasks...');
  });

  cb();
}

exports.test = function(cb) {
  var test = require('./test/test.js');
  test.run();
  cb();
};

exports.build = series(clean, modules, build);
exports.watch = series(clean, build, watchFiles);
exports.default = series(build);
