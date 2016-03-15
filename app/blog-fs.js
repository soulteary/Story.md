var fse = require('fs-extra');
var helper = require('./helper');

/**
 * scan dirs and return file/dir list
 * @param rootDir
 * @param excludeList
 * @returns {Promise}
 */
function scanDirs (rootDir, excludeList) {
    var result = [];
    var promise = new Promise(function (resolve, reject) {
        fse
            .walk(rootDir)
            .on('data', function (item) {
                if (!helper.excludeFileByPath(item.path, excludeList)) result.push(item.path);
            })
            .on('end', function () {
                return resolve(result);
            })
            .on('error', function (err) {
                return reject(err);
            })
    });
    return promise;
}


/**
 * Sortout file/dir path list
 * @param pathList
 * @returns {Promise}
 */
function sortOutPath (pathList) {
    var promise = new Promise(function (resolve, reject) {

        try {
            var postFiles = [];
            var dirs = [];
            var metaFiles = [];

            pathList.map(function (path) {
                if (helper.matchFileExt(path, '.md')) return postFiles.push(path);
                if (helper.matchFileExt(path, '.json')) return metaFiles.push(path);
                return dirs.push(path);
            })
            return resolve({
                    'post' : postFiles,
                    'meta' : metaFiles,
                    'dir'  : dirs
                }
            );
        } catch (e) {
            return reject(e);
        }
    });
    return promise;
}

module.exports = {
    scanDirs    : scanDirs,
    sortOutPath : sortOutPath
};