var fs = require('fs');
var fse = require('fs-extra');

function getDescOrder (obj, cb) {
    return Object.keys(obj).sort(function () {return true;}).map(cb);
}

function readJSON (path) {
    var promise = new Promise(function (resolve, reject) {
        try {
            fse.readJson(path, function (err, data) {
                if (err) throw 'process with metafile error:' + path;
                resolve(data);
            });
            return promise;
        } catch (e) {
            throw('read json error:' + e);
        }
    });
    return promise;
}

function readPost (path, meta) {
    var promise = new Promise(function (resolve, reject) {
        try {
            if (meta.hasOwnProperty('date') && meta.hasOwnProperty('title') && meta.hasOwnProperty('slug')) {
                if (meta.hasOwnProperty('alias')) {
                    console.log('存在需要301处理的路径');
                }
                if (meta.hasOwnProperty('tag') && meta.tag.length) {
                }
                fs.readFile(path, 'utf8', function (err, data) {
                    if (err) {
                        throw 'process with metafile error:' + meta;
                    }
                    return resolve(data);
                });
                return 'generate posts';
            } else {
                return 'create meta from posts.';
            }
        } catch (e) {
            return reject(e);
        }
    });
    return promise;
}

function generate (pathData) {
    try {
        return Promise.all(
            pathData.map(function (postFile) {
                var metaFile = postFile.slice(0, -2) + 'json';
                var promise = new Promise(function (resolve, reject) {
                    try {
                        return resolve(
                            readJSON(metaFile)
                                .then(readPost.bind(null, postFile))
                                .catch(function (err) {
                                    console.log('需要生成meta文件', err);
                                })
                        );
                    } catch (e) {
                        return reject(e);
                    }
                });
                return promise;
            })
        );
    } catch (e) {
        throw '生成文章列表出错:' + e;
    }
}

module.exports = {
    generate : generate
};