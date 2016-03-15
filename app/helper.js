function excludeFileByPath (path, excludeList) {
    return excludeList.some(function (file) {
        return path.slice(file.length * -1) === file;
    });
}

function matchFileExt (path, ext) {
    return path.slice(ext.length * -1) === ext;
}


module.exports = {
    excludeFileByPath : excludeFileByPath,
    matchFileExt      : matchFileExt
}
