// package metadata file for Meteor.js

/* jshint strict:false */
/* global Package:true */

Package.describe({
  name: 'twbs:bootstrap',  // https://atmospherejs.com/twbs/bootstrap
  summary: 'The most popular front-end framework for developing responsive, mobile first projects on the web.',
  version: '3.4.1',
  git: 'https://github.com/twbs/bootstrap.git'
});

Package.onUse(function (api) {
  api.versionsFrom('METEOR@1.0');
  api.use('jquery', 'client');
  var assets = [
    'summernote/fonts/glyphicons-halflings-regular.eot',
    'summernote/fonts/glyphicons-halflings-regular.svg',
    'summernote/fonts/glyphicons-halflings-regular.ttf',
    'summernote/fonts/glyphicons-halflings-regular.woff',
    'summernote/fonts/glyphicons-halflings-regular.woff2'
  ];
  if (api.addAssets) {
    api.addAssets(assets, 'client');
  } else {
    api.addFiles(assets, 'client', { isAsset: true });
  }
  api.addFiles([
    'summernote/css/bootstrap.css',
    'summernote/js/bootstrap.js'
  ], 'client');
});
