import Vue from "vue"
// 时间戳转日期(1569736900 => 2019-09-29)
Vue.filter('timeFilter', function(str, type) {
    if (!str) {
        return '- -'
    }
    str = String(str).length <= 10 ? str * 1000 : str;
    let formatTime = (a) => parseInt(a) < 10 ? '0' + parseInt(a) : parseInt(a);
    let t = new Date(str);
    let year = t.getFullYear();
    let month = formatTime(t.getMonth() + 1);
    let day = formatTime(t.getDate());
    let hours = formatTime(t.getHours());
    let minutes = formatTime(t.getMinutes());
    let seconds = formatTime(t.getSeconds());
    if (type == "ymd") {
        return `${year}-${month}-${day}`;
    } else if (type == 'hms') {
        return `${hours}:${minutes}:${seconds}`;
    } else if (type == 'ms') {
        return `${minutes}:${seconds}`;
    } else if (type == 'ymdhm') {
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    } else if (type == "article") {
        //6月13号 13:00
        return `${month}月${day}号 ${hours}:${minutes}`

    } else if (type == "order") {
        //6月13号 13:00
        return `${year}年${month}月${day}号`

    } else {
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
})

Date.prototype.Format = function(fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
    // 处理特殊时间(2020-04-10T01:38:22.000+0000)
    // Vue.filter("teShuTime", function(times, pattern) {

//         let d = new Date(times).Format("yyyy-MM-dd hh:mm:ss");
//         if (pattern) {
//             d = new Date(times).Format(pattern);
//         }
//         // let time = d.replace(/-/g, '/')
//         // console.log("转为斜杠：" + time)
//         // let time1 = new Date(time)
//         // let Y = time1.getFullYear(); //ios年
//         // let M = time1.getMonth() + 1 //ios月
//         // let D = time1.getDate() //ios天
//         // let H = time1.getHours() //ios时
//         // let Min = time1.getMinutes() //ios分
//         // let S = time1.getSeconds() //ios秒
//         // console.log("打印的D" + d)
//         // console.log("打印的time" + time)
//         // return Y + "/" + M + "/" + D + " " + H + ":" + Min + ":" +
//         //     S;
//         return times
//     })

// 处理特殊时间(2020-04-10T01:38:22.000+0000)
Vue.filter("teShuTime", function(times) {
        if (times == null || times == '' || times == undefined) {
            return ''
        } else {
            // ios还是安卓
            var u = navigator.userAgent
            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 //android终端
            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) //ios终端
                //----------------------------------------------------------------------
            var date = new Date(times.substr(0, 19));
            var Year = date.getFullYear();
            var Month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
            var d = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
            var Hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
            var Minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
            var Seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
            var over_time = Year + "/" + Month + "/" + d + " " + Hours + ":" + Minutes + ":" + Seconds
                //***至此以上是将时间2020-03-18T01:57:23.000+0000转为正常时间格式，以下为将时间进行增加8小时解决时区差异的操作***
            var time = new Date(Date.parse(over_time));
            // if (isAndroid == true) {
            //     time.setTime(time.setHours(time.getHours() + 8));
            // } else {
            //     time.setTime(time.setHours(time.getHours()));
            // }
            time.setTime(time.setHours(time.getHours() + 8));

            var Y = time.getFullYear() + '/';
            var M = addZero(time.getMonth() + 1) + '/';
            var D = addZero(time.getDate()) + ' ';
            var h = addZero(time.getHours()) + ':';
            var m = addZero(time.getMinutes()) + ':';
            var s = addZero(time.getSeconds());
            return (Y + M + D + " " + h + m + s)
        }
    })
    // 开始到结束过了多久
    // 处理特殊时间(2020-04-10T01:38:22.000+0000)
Vue.filter("duoJiu", function(times, times1) {
        if (times == null || times == '' || times == undefined || times1 == null || times1 == '' || times1 == undefined) {
            return '-'
        } else {
            // ios还是安卓
            var u = navigator.userAgent
            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 //android终端
            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) //ios终端
                //----------------------------------------------------------------------
                // 一下为开始时间计算
            var date = new Date(times.substr(0, 19));
            var Year = date.getFullYear();
            var Month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
            var d = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
            var Hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
            var Minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
            var Seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
            var over_time = Year + "/" + Month + "/" + d + " " + Hours + ":" + Minutes + ":" + Seconds
                // 一下为结束时间计算
            var date1 = new Date(times1.substr(0, 19));
            var Year = date1.getFullYear();
            var Month = date1.getMonth() + 1 < 10 ? "0" + (date1.getMonth() + 1) : date1.getMonth() + 1;
            var d = date1.getDate() < 10 ? "0" + date1.getDate() : date1.getDate();
            var Hours = date1.getHours() < 10 ? "0" + date1.getHours() : date1.getHours();
            var Minutes = date1.getMinutes() < 10 ? "0" + date1.getMinutes() : date1.getMinutes();
            var Seconds = date1.getSeconds() < 10 ? "0" + date1.getSeconds() : date1.getSeconds();
            var over_time1 = Year + "/" + Month + "/" + d + " " + Hours + ":" + Minutes + ":" + Seconds
                //***至此以上是将时间2020-03-18T01:57:23.000+0000转为正常时间格式，以下为将时间进行增加8小时解决时区差异的操作***

            var time = new Date(Date.parse(over_time));
            time.setTime(time.setHours(time.getHours() + 8));

            var time1 = new Date(Date.parse(over_time1));
            time1.setTime(time1.setHours(time1.getHours() + 8));
            var time3 = time1 - time


            var days = parseInt(time3 / (1000 * 60 * 60 * 24));
            var hours = parseInt((time3 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = parseInt((time3 % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = (time3 % (1000 * 60)) / 1000;
            return days + " 天 " + hours + " 小时 " + minutes + " 分钟 ";
        }
    })
    // 获取多少小时后过期
Vue.filter("guoQu", function(hours, time, times1) {
        // hours参数为规定工时，time开始执行时间，times1现在的时间的
        if (time == null || time == '' || time == undefined) {
            return ''
        } else {
            // ios还是安卓
            var u = navigator.userAgent
            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 //android终端
            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) //ios终端
                // --------------------------------------------------------------------------------
            var date1 = new Date(time.substr(0, 19));
            var Year = date1.getFullYear();
            var Month = date1.getMonth() + 1 < 10 ? "0" + (date1.getMonth() + 1) : date1.getMonth() + 1;
            var d = date1.getDate() < 10 ? "0" + date1.getDate() : date1.getDate();
            var Hours = date1.getHours() < 10 ? "0" + date1.getHours() : date1.getHours();
            var Minutes = date1.getMinutes() < 10 ? "0" + date1.getMinutes() : date1.getMinutes();
            var Seconds = date1.getSeconds() < 10 ? "0" + date1.getSeconds() : date1.getSeconds();
            var over_time
            if (isAndroid == true) {
                // console.log('安卓手机')
                over_time =
                    Year +
                    '/' +
                    Month +
                    '/' +
                    d +
                    ' ' +
                    Hours +
                    ':' +
                    Minutes +
                    ':' +
                    Seconds
            } else {
                // console.log('苹果手机')
                over_time =
                    Year +
                    '/' +
                    Month +
                    '/' +
                    d +
                    ' ' +
                    Hours +
                    ':' +
                    Minutes +
                    ':' +
                    Seconds
            }
            let timestamp = new Date(over_time).getTime(); //当前的时间戳
            timestamp = timestamp + hours * 60 * 60 * 1000;
            //格式化时间获取年月日

            var date = new Date(over_time); //开始执行时间
            var newTime = new Date(times1); //现在的时间
            console.log(date)
            console.log(newTime)
            var dateDiff = newTime.getTime() - date.getTime()
            console.log(dateDiff)
            var DD = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
            var leave1 = dateDiff % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
            var HH = Math.floor(leave1 / (3600 * 1000)) //计算出小时数
                // 计算相差分钟数
            var leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
            var MM = Math.floor(leave2 / (60 * 1000)) //计算相差分钟数
                //计算相差秒数
            var leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
            var seconds = Math.round(leave3 / 1000)
                // 一下为处理剩余时间
            var stpTime = hours * 60 //规定工时转为分钟
            var nowTime
            if (isAndroid == true) {
                nowTime = ((DD * 24 * 60) + (HH * 60) + MM) - 480 //当前工时转为分钟
                console.log("这是安卓减过480分钟后的分钟")
                console.log(nowTime)
            } else {
                nowTime = (DD * 24 * 60) + (HH * 60) + MM //当前工时转为分钟
                console.log("这是ios没减过480分钟后的分钟")
                console.log(nowTime)
            }
            var surplusTime = stpTime - nowTime; //剩余多少分钟
            console.log(stpTime)
            console.log(nowTime)
            var days = parseInt(surplusTime / (60 * 24));
            var hours1 = parseInt((surplusTime % (60 * 24)) / (60));
            var minutes = parseInt((surplusTime % (60)));
            var seconds = (surplusTime % (1000 * 60)) / 1000;
            if (isAndroid == true) {
                if (minutes < 0) {
                    return "您已逾期"
                } else {
                    return days + "天" + hours1 + "小时" + minutes + "分"
                }
            } else {
                if (minutes < 0) {
                    return "您已逾期"
                } else {
                    return days + "天" + hours1 + "小时" + minutes + "分"
                }
            }

        }
    })
    // 规定工时转换
Vue.filter("haoMiaoZhuanHuan", function(mss) {
        let time = mss * 60 * 60 * 1000
        var days = parseInt(time / (1000 * 60 * 60 * 24));
        var hours = parseInt((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = parseInt((time % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = (time % (1000 * 60)) / 1000;
        return days + " 天 " + hours + " 小时 " + minutes + " 分钟 ";
    })
    // 毫秒转换
Vue.filter("haoMiao", function(mss) {
        var days = parseInt(mss / (1000 * 60 * 60 * 24));
        var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = (mss % (1000 * 60)) / 1000;
        return days + " 天 " + hours + " 小时 " + minutes + " 分钟 ";
    })
    // 得到报事时间距离现在时间
Vue.filter("guoQuTime", function(times, times1) {
    if (times == null || times == '' || times == undefined) {
        return ''
    } else if (times1 == null || times1 == '' || times1 == undefined) {
        return ''
    } else {
        // ios还是安卓
        var u = navigator.userAgent
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) //ios终端
            //---------------------------------------------------------------------------------
        var date = new Date(times.substr(0, 19));
        var Year = date.getFullYear();
        var Month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var d = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var Hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var Minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var Seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        var over_time
            // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -
            // console.log(times1)
        var str = new Date(times1.substr(0, 19))
            // console.log(str)
        var Year1 = str.getFullYear();
        var Month1 = str.getMonth() + 1 < 10 ? "0" + (str.getMonth() + 1) : str.getMonth() + 1;
        var d1 = str.getDate() < 10 ? "0" + str.getDate() : str.getDate();
        var Hours1 = str.getHours() < 10 ? "0" + str.getHours() : str.getHours();
        var Minutes1 = str.getMinutes() < 10 ? "0" + str.getMinutes() : str.getMinutes();
        var Seconds1 = str.getSeconds() < 10 ? "0" + str.getSeconds() : str.getSeconds();
        var over_time1
            // console.log(times1)
        if (isAndroid == true) {
            // console.log('安卓手机')
            over_time =
                Year +
                '/' +
                Month +
                '/' +
                d +
                ' ' +
                Hours +
                ':' +
                Minutes +
                ':' +
                Seconds;
            //-------------------------
            over_time1 =
                Year1 +
                '/' +
                Month1 +
                '/' +
                d1 +
                ' ' +
                Hours1 +
                ':' +
                Minutes1 +
                ':' +
                Seconds1;
        } else {
            // console.log('苹果手机')
            over_time =
                Year +
                '/' +
                Month +
                '/' +
                d +
                ' ' +
                Hours +
                ':' +
                Minutes +
                ':' +
                Seconds;
            //-------------------------
            over_time1 =
                Year1 +
                '/' +
                Month1 +
                '/' +
                d1 +
                ' ' +
                Hours1 +
                ':' +
                Minutes1 +
                ':' +
                Seconds1;
        }
        var date1 = new Date(Date.parse(over_time));
        var newTime = new Date(Date.parse(over_time1));

        var dateDiff = newTime.getTime() - date1.getTime()
            // console.log("你TM什么东西？？？111" + date1)
            // console.log("你TM什么东西？？？222" + newTime)
            // console.log(dateDiff)
        var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
        var leave1 = dateDiff % (24 * 3600 * 1000) //计算天数后剩余的毫秒数

        var hours = Math.floor(leave1 / (3600 * 1000)) //计算出小时数
            // 计算相差分钟数
        var leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数

        var minutes = Math.floor(leave2 / (60 * 1000)) //计算相差分钟数
            //计算相差秒数
        var leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数

        var seconds = Math.round(leave3 / 1000)
        if (isAndroid == true) {
            if (dayDiff >= 7) {
                return "大于七天"
            } else {
                return dayDiff + "天" + hours + "小时" + minutes + "分"
            }
        } else {
            if (dayDiff >= 7) {
                return "大于七天"
            } else {
                return dayDiff + "天" + hours + "小时" + minutes + "分"
            }
        }

    }

})


Vue.filter("guoQuTime1", function(times, times1) {
    if (times == null || times == '' || times == undefined) {
        return ''
    } else if (times1 == null || times1 == '' || times1 == undefined) {
        return ''
    } else {
        // ios还是安卓
        var u = navigator.userAgent
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) //ios终端
            //----------------------------------------------------------
        var date = new Date(times.substr(0, 19));
        var Year = date.getFullYear();
        var Month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var d = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var Hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var Minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var Seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        var over_time
            // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -
        var Year1 = times1.getFullYear();
        var Month1 = times1.getMonth() + 1 < 10 ? "0" + (times1.getMonth() + 1) : times1.getMonth() + 1;
        var d1 = times1.getDate() < 10 ? "0" + times1.getDate() : times1.getDate();
        var Hours1 = times1.getHours() < 10 ? "0" + times1.getHours() : times1.getHours();
        var Minutes1 = times1.getMinutes() < 10 ? "0" + times1.getMinutes() : times1.getMinutes();
        var Seconds1 = times1.getSeconds() < 10 ? "0" + times1.getSeconds() : times1.getSeconds();
        var over_time1
            // console.log(times1)
        if (isAndroid == true) {
            // console.log('安卓手机')
            over_time =
                Year +
                '/' +
                Month +
                '/' +
                d +
                ' ' +
                Hours +
                ':' +
                Minutes +
                ':' +
                Seconds;
            //-------------------------
            over_time1 =
                Year1 +
                '/' +
                Month1 +
                '/' +
                d1 +
                ' ' +
                Hours1 +
                ':' +
                Minutes1 +
                ':' +
                Seconds1;
        } else {
            // console.log('苹果手机')
            over_time =
                Year +
                '/' +
                Month +
                '/' +
                d +
                ' ' +
                Hours +
                ':' +
                Minutes +
                ':' +
                Seconds;
            //-------------------------
            over_time1 =
                Year1 +
                '/' +
                Month1 +
                '/' +
                d1 +
                ' ' +
                Hours1 +
                ':' +
                Minutes1 +
                ':' +
                Seconds1;
        }
        var date1 = new Date(Date.parse(over_time));
        var newTime = new Date(Date.parse(over_time1));

        var dateDiff = newTime.getTime() - date1.getTime()
            // console.log("你TM什么东西？？？333" + date1)
            // console.log("你TM什么东西？？？444" + newTime)
            // console.log(dateDiff)
        var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
        // console.log(dayDiff)
        var leave1 = dateDiff % (24 * 3600 * 1000) //计算天数后剩余的毫秒数

        var hours = Math.floor(leave1 / (3600 * 1000)) //计算出小时数
            // 计算相差分钟数
        var leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数

        var minutes = Math.floor(leave2 / (60 * 1000)) //计算相差分钟数
            //计算相差秒数
        var leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数

        var seconds = Math.round(leave3 / 1000)
            // console.log(seconds)
        if (isAndroid == true) {
            if (dayDiff >= 7) {
                return "大于七天"
            } else if (seconds < 0) {
                return "未开始"
            } else {
                return dayDiff + "天" + (hours - 8) + "小时" + minutes + "分"
            }
        } else {
            if (dayDiff >= 7) {
                return "大于七天"
            } else if (seconds < 0) {
                return "未开始"
            } else {
                return dayDiff + "天" + hours + "小时" + minutes + "分"
            }
        }

    }

})


// 截取字符串,部分显示 默认截取前100个字符;
Vue.filter('subStr', function(str, num = 100) {
    return str.length > num ? (str.substr(0, num) + "...") : str.substr(0, num)
})


/*日期转换*/
Vue.filter('dateFilter', function(str) {
    return str.slice(0, 4) + '-' + str.slice(4, 6) + '-' + str.slice(6);
});


// 手机号隐藏('13912345678' => '139****5678'),此处str必须为字符串
Vue.filter('telHide', function(str) {
    return str.replace(/(\d{3})\d{4}(\d*)/, '$1****$2')
});


// 隐藏姓名(小明=>*明    李小明=>李*明)
Vue.filter('nameHide', function(name) {
    if (name.length === 2) {
        return new Array(name.length).join('*') + name.substr(-1)
    } else {
        return (name.substr(0, 1) + new Array(name.length - 1).join('*') + name.substr(-1))
    }
});


// 身份证号隐藏('331082199708094687' => '33108219********87')
Vue.filter('IDcardHide', function(name) {
    return name.replace(/(\d{8})\d{8}(\d*)/, '$1********$2')
});


// 人气数字转换
Vue.filter('digitalConversion', function(str) {
    let num = Math.abs(str);
    if (String(num).length < 5) {
        return num;
    } else {
        return (num / 10000).toFixed(1) + 'W';
    }
})


// 多久以前
Vue.filter('timeAgo', function(time) {
        time = String(time).length <= 10 ? time * 1000 : time;
        var arr = [
                [],
                []
            ],
            stamp = new Date().getTime() - new Date(time).getTime();

        //返回具体日期
        if (stamp > 1000 * 60 * 60 * 24 * 8) {
            stamp = new Date(time);
            arr[0][0] = digit(stamp.getFullYear(), 4);
            arr[0][1] = digit(stamp.getMonth() + 1);
            arr[0][2] = digit(stamp.getDate());

            return arr[0].join('-') + ' ' + arr[1].join(':');
        }

        //30天以内，返回“多久前”
        if (stamp >= 1000 * 60 * 60 * 24) {
            return ((stamp / 1000 / 60 / 60 / 24) | 0) + '天前';
        } else if (stamp >= 1000 * 60 * 60) {
            return ((stamp / 1000 / 60 / 60) | 0) + '小时前';
        } else if (stamp >= 1000 * 60 * 2) { //2分钟以内为：刚刚
            return ((stamp / 1000 / 60) | 0) + '分钟前';
        } else {
            return '刚刚';
        }
    })
    //不足10 补0操作
var addZero = function(num) {
        return num < 10 ? '0' + num : num;
    }
    //数字前置补零
function digit(num, length) {
    var str = '';
    num = String(num);
    length = length || 2;
    for (var i = num.length; i < length; i++) {
        str += '0';
    }
    return num < Math.pow(10, length) ? str + (num | 0) : num;
}