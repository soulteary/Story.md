var fse = require('fs-extra');
var helper = require('./helper');
var blogFs = require('./blog-fs');

var archives = require('./archives');
var posts = require('./posts');

var path = require('path');

/** BLOG POSTS DIR **/
const postsRootDir = path.resolve(process.cwd(), './posts');


blogFs
    .scanDirs(postsRootDir, ['.DS_Store', '/posts', 'posts/README.md'])
    .then(blogFs.sortOutPath)
    .then(function (pathData) {
        return Promise.all(
            [
                archives.generate(pathData.dir),
                posts.generate(pathData.post),
                function (pathData) {
                    return pathData.post;
                },
                function (pathData) {
                    return pathData.meta;
                }
            ]
        );
    })
    .then(function (re) {
        console.log(re);
        return true;
    })
    .catch(function (err) {
        throw err;
    });



