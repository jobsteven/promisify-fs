var Promise = require('bluebird');
var fs = require('fs');
var path = require('path');

/**
 * expose fs
 */
var pfs = module.exports = {};

/**
 * to tell if the file specified by file_path exists
 * @param  string file_path file path
 * @return promise          promise
 */
pfs.existsFile = function(file_path) {
  return Promise.fromCallback(function(node_cb) {
      fs.stat(file_path, node_cb)
    })
    .then(function(stat) {
      if(stat.isFile()) {
        if(file_path[0] == '.') stat['abs_path'] = path.resolve(file_path)
        return stat
      }

      throw new Error(file_path + ' does exit, but it is not a *File*')
    })
}

pfs.readFile = function(file_path, options) {
  var options = options || {};
  options['encoding'] = options['encoding'] || 'utf8';

  return pfs
    .existsFile(file_path)
    .then(function(stat) {
      return Promise.fromCallback(function(node_cb) {
        fs.readFile(file_path, options, node_cb)
      })
    })
}

pfs.writeFile = function(file_path, data, options) {
  var options = options || {};
  options['encoding'] = options['encoding'] || 'utf8';

  return Promise.fromCallback(function(node_cb) {
    //try to stringify
    if(! ~['String','Buffer'].indexOf(data.constructor.name)){
      data = JSON.stringify(data);
    }
    fs.writeFile(file_path, data, options, node_cb)
  })
}

pfs.existsFolder = function(file_path) {
  return Promise.fromCallback(function(node_cb) {
      fs.stat(file_path, node_cb)
    })
    .then(function(stat) {
      if(stat.isDirectory()) {
        if(file_path[0] == '.') stat['abs_path'] = path.resolve(file_path)
        return stat
      }

      throw new Error(file_path + ' does exit, but it is not a *Folder*')
    })
}
