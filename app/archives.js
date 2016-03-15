function getYearList (pathData) {
    var promise = new Promise(function (resolve, reject) {
        var result = {};
        try {
            pathData = pathData.filter(function (path) {
                var year = path.slice(path.lastIndexOf('/') + 1);
                return year.length === 4 && (result[year] = path);
            });
            return resolve(result);
        } catch (e) {
            return reject(e);
        }
    });
    return promise;
}

function getMonthList (year, pathData) {
    var promise = new Promise(function (resolve, reject) {
        var result = {};
        try {
            pathData = pathData.filter(function (path) {
                var last = path.slice(0, path.lastIndexOf('/'));
                var month = path.slice(path.lastIndexOf('/') + 1);
                var curYear = last.slice(last.lastIndexOf('/') + 1);
                if (curYear === year) {
                    return month.length === 2 && (result[month] = path);
                }
            });
            return resolve(result);
        } catch (e) {
            return reject(e);
        }
    });
    return promise;
}

function getDayList (year, month, pathData) {
    var promise = new Promise(function (resolve, reject) {
        var result = {};
        try {
            pathData = pathData.filter(function (path) {
                var arr = path.split('/')
                arr = arr.splice(arr.length - 3);
                var day = arr[2];
                var curMonth = arr[1];
                var curYear = arr[0];
                if (curYear === year && curMonth === month) {
                    return result[day] = path;
                }
            });
            return resolve(result);
        } catch (e) {
            return reject(e);
        }
    });
    return promise;
}


//['日期归档','月份归档','年度归档','文章列表']

var yearMeta = {
    2007 : {
        'thumb'   : 'http://attachment.soulteary.com/wp/2012/10/year-2007.jpg',
        'title'   : '二零零七',
        'content' : '用sa-blog搭自己的博客，蛮好玩的。'
    },
    2008 : {
        'thumb'   : 'http://attachment.soulteary.com/wp/2012/10/year-2008.jpg',
        'title'   : '二零零八',
        'content' : '高三感觉一晃就过去了，别人在写卷子，我在写代码。'
    },
    2009 : {
        'thumb'   : 'http://attachment.soulteary.com/wp/2012/10/year-2009.jpg',
        'title'   : '二零零九',
        'content' : '男儿负气出东关，学不成名誓不还，帝都，我来了。'
    },
    2010 : {
        'thumb'   : 'http://attachment.soulteary.com/wp/2012/10/year-2010.jpg',
        'title'   : '二零一零',
        'content' : '浑浑噩噩的度过了这一年。'
    },
    2011 : {
        'thumb'   : 'http://attachment.soulteary.com/wp/2012/10/year-2011.jpg',
        'title'   : '二零一一',
        'content' : '或许有的时候，我们都是一只刺猬吧。'
    },
    2012 : {
        'thumb'   : 'http://attachment.soulteary.com/wp/2012/10/year-2012.jpg',
        'title'   : '二零一二',
        'content' : '努力的工作，年初的愿望似乎实现了一部分。'
    },
    2013 : {
        'thumb'   : 'http://attachment.soulteary.com/wp/2013/01/year-2013.jpg',
        'title'   : '二零一三',
        'content' : '事情异常多的一年，学会了许多，思考了许多。'
    },
    2014 : {
        'thumb'   : 'http://attachment.soulteary.com/wp/2014/01/year-2014.jpg',
        'title'   : '二零一四',
        'content' : '从帝都跑到苏杭，感觉自己成长了不少。'
    },
    2015 : {
        'thumb'   : 'http://attachment.soulteary.com/wp/2015/01/year-2015.jpg',
        'title'   : '二零一五',
        'content' : '新的一年，会发生什么呢，很是期待...'
    }
}


function getDescOrder (obj, cb) {
    return Object.keys(obj).sort(function () {return true;}).map(cb);
}

function generateFactory (pathData, mode, callback) {
    return getYearList(pathData).then(function (yearList) {
        return getDescOrder(yearList, function (year) {
            return mode === 'year' ? function () {

                //console.log('业务逻辑', year);

            }.bind(this)(): getMonthList(year, pathData).then(function (monthList) {
                return getDescOrder(monthList, function (month) {
                    return mode === 'month' ? function () {

                        //console.log('业务逻辑', year, month);

                    }.bind(this)(): getDayList(year, month, pathData).then(function (dayList) {
                        return getDescOrder(dayList, function (day) {

                            //console.log('业务逻辑', year, month, dayList[day]);

                        });
                    });
                });
            });
        });
    });
}

function generateYearArchive (pathData, callback) {
    return generateFactory(pathData, 'year', callback);
}
function generateMonthArchive (pathData) {
    return generateFactory(pathData, 'month');
}
function generateDayArchive (pathData) {
    return generateFactory(pathData, 'day');
}


function generate (pathData) {
    generateYearArchive(pathData);
    generateMonthArchive(pathData)
    generateDayArchive(pathData)
    return 'generate archives';
}


module.exports = {
    generate : generate
};