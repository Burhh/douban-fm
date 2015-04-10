$(document).ready(function() {
    var e = Settings.getObject("options");
    if (e == undefined) {
        e = {showLike: false,showDel: true,showPrev: true,showNext: true,showLyric: true};
        Settings.setObject("options", e)
    }
    if (e.showDel)
        $(".jp-del").show();
    if (e.showPrev)
        $(".jp-previous").show();
    if (e.showNext)
        $(".jp-next").show();
    var t = {};
    var a = false;
    var n = {};
    var s = chrome.extension.connect({name: "dbstyle"});
    var l = getPlayData();
    try {
        var r = l.playList[l.playIndex];
        if (r.public_time == undefined)
            r.public_time = "";
        if (r.like == "1") {
            $(".jp-like").addClass("jp-liked").attr("data-liked", "1")
        }
        $(".jp-like").attr("data-sid", r.sid);
        $("#songChannel").attr("data-sid", r.sid);
        $("#singer").text(r.artist);
        $("#album").text("<" + r.albumtitle + "> " + r.public_time);
        $("#cover").attr("src", r.picture);
        $("#coverlink").attr("href", "http://music.douban.com" + r.album).attr("target", "_blank");
        $("#song").text(r.title);
        if (l.channelInfo.title) {
            $(".header").attr("data-id", l.channelInfo.id);
            $("#channel_cover").attr("src", l.channelInfo.cover);
            $("#channel_title").text(l.channelInfo.title)
        }
    } catch (c) {
    }
    s.onMessage.addListener(function(e) {
        switch (e.act) {
            case "info":
                var t = e.data;
                $("#cover").attr("src", t.picture);
                if (t.album != "")
                    $("#coverlink").attr("href", "http://music.douban.com" + t.album).attr("target", "_blank");
                else
                    $("#coverlink").removeAttr("href");
                $("#singer").text(t.artist);
                if (t.public_time == undefined)
                    t.public_time = "";
                if (t.albumtitle != undefined && t.albumtitle != "")
                    $("#album").text("<" + t.albumtitle + "> " + t.public_time);
                $("#song").text(t.title);
                if (t.like == 1) {
                    $(".jp-like").addClass("jp-liked").attr("data-liked", "1")
                } else {
                    $(".jp-like").removeClass("jp-liked")
                }
                $(".jp-like").attr("data-sid", t.sid);
                $("#songChannel").attr("data-sid", t.sid);
                o.getLyric(t);
                break;
            case "playing":
                l = getPlayData();
                var t = l.playList[l.playIndex];
                if (!a) {
                    a = true;
                    $(".header").attr("data-id", l.channelInfo.id);
                    $("#channel_status").removeClass("waiting").addClass("playing");
                    $(".jp-play").hide();
                    $(".jp-pause").show();
                    n = getPlayLyric();
                    if (n != undefined) {
                        if (n.title != t.title)
                            o.getLyric(t)
                    }
                }
                $(".jp-current-time").text(e.data.time);
                $(".jp-play-bar").css({width: e.data.percent * 100 + "%"});
                n = getPlayLyric();
                if (n != undefined) {
                    if (n.lyric && n.lyric[e.data.now] != undefined) {
                        if (n.title == t.title)
                            $(".lyric").text(n.lyric[e.data.now])
                    }
                }
                break;
            case "connected":
                break
        }
    });
    t.bind = function() {
        shareTool.init();
        $(".tag ul li a").click(function() {
            $(".tag ul li a").removeClass("hover");
            var e = $(this);
            e.addClass("hover");
            var t = e.attr("data-type");
            switch (t) {
                case "cate":
                    $("#cate").show();
                    $("#lists").hide();
                    break;
                case "fav":
                    o.getFav();
                    break;
                default:
                    o.get(t, 0);
                    break
            }
        });
        $(".header").hover(function() {
            var e = $(this).attr("data-id");
            if (e && e > 0) {
                var a = $(".header s");
                a.unbind("click");
                if (e && t.fav.check(e)) {
                    a.removeClass("fav").addClass("faved").attr("title", "点击取消收藏");
                    a.bind("click", function() {
                        t.fav.remove(e);
                        f("取消收藏")
                    })
                } else {
                    a.removeClass("faved").addClass("fav").attr("title", "点击收藏");
                    a.bind("click", function() {
                        t.fav.add(e);
                        f("收藏成功")
                    })
                }
                a.show()
            }
        }, function() {
            $(".header s").hide()
        });
        $(".header s").bind("click", function() {
            var e = $(this).attr("data-id");
            t.fav.set(e)
        });
        $("#cate li").bind("click", function() {
            $("#cate li").removeClass("hover");
            var e = $(this);
            e.addClass("hover");
            o.get("cate", 0, e.attr("data-id"))
        });
        $("#lists").delegate("li div img", "click", function() {
            var e = $(this).parent("div");
            var t = e.attr("data-id");
            var a = e.children("img").attr("src");
            var i = e.parent("li").children("a").text();
            var n = {title: i,cover: a,id: t};
            $(".arrow").trigger("click");
            d.needLogin = false;
            $(".login").css("left", "300px");
            o.playChannel(n)
        });
        $("#lists").delegate("li div i", "click", function() {
            var e = $(this).parent("div");
            var a = e.attr("data-id");
            e.parent("li").fadeOut().remove();
            t.fav.remove(a)
        });
        $("#keyword").bind("keydown", function() {
            if (event.keyCode == 13)
                $(".search").trigger("click")
        });
        $("#keyword").focusin(function() {
            $("#keyword").css({width: "90px"})
        }).focusout(function() {
            $("#keyword").css({width: "70px"})
        });
        $(".search").bind("click", function() {
            $(".tag ul li a").removeClass("hover");
            var e = $("#keyword").val();
            if (e != "") {
                o.get("search", 0, e)
            }
        });
        $(".arrow").bind("click", function() {
            var e = $(this);
            var t = $(".cates");
            if (t.offset().left != 0) {
                if ($(".login").offset().left == 20)
                    $(".login").animate({left: "300px"});
                t.animate({left: "0px"}, function() {
                    e.addClass("arrow-back");
                    $(".lyric").removeClass("lyric-normal").addClass("lyric-hover")
                })
            } else {
                if (d.needLogin)
                    $(".login").animate({left: "0px"});
                t.animate({left: "-280px"}, function() {
                    e.removeClass("arrow-back");
                    $(".lyric").removeClass("lyric-hover").addClass("lyric-normal")
                })
            }
        });
        $(".jp-next").bind("click", function() {
            l = getPlayData();
            l.playIndex += 1;
            s.postMessage({act: "next"});
            $("#channel_status").addClass("playing").removeClass("waiting");
            $(".jp-pause").show();
            $(".jp-play").hide()
        });
        $(".jp-del").bind("click", function() {
            l = getPlayData();
            var e = l.playList[l.playIndex];
            o.del(e.sid)
        });
        $(".jp-previous").bind("click", function() {
            l = getPlayData();
            if (l.playIndex >= 1) {
                l.playIndex -= 1;
                s.postMessage({act: "prev"})
            }
        });
        $(".jp-pause").bind("click", function() {
            s.postMessage({act: "pause"});
            $("#channel_status").addClass("waiting").removeClass("playing");
            $(".jp-play").show();
            $(".jp-pause").hide()
        });
        $(".jp-play").bind("click", function() {
            $("#channel_status").addClass("playing").removeClass("waiting");
            s.postMessage({act: "play"});
            $(".jp-pause").show();
            $(".jp-play").hide()
        });
        $(".jp-mute").bind("click", function() {
            s.postMessage({act: "mute"});
            $(".jp-mute").hide();
            $(".jp-unmute").show()
        });
        $(".jp-unmute").bind("click", function() {
            s.postMessage({act: "unmute"});
            $(".jp-unmute").hide();
            $(".jp-mute").show()
        });
        $("#user_status").bind("click", function() {
            if (d.status) {
                $("#user_menu").toggle()
            } else
                d.init();
            setTimeout(function() {
                if ($("#user_menu").is(":visible")) {
                    $("body").bind("click", function() {
                        $("#user_menu").hide();
                        $("body").unbind("click")
                    })
                }
            }, 0)
        });
        $(".logout").click(function() {
            d.logout()
        });
        $("#radio_private").click(function() {
            o.playChannel("0");
            $("#user_menu").hide()
        });
        $("#radio_red").click(function() {
            o.playChannel("-3");
            $("#user_menu").hide()
        });
        $(".jp-like").click(function() {
            var e = $(this).attr("data-sid");
            var t = l.channelInfo.id;
            o.red(e, t)
        });
        var e;
        $(".jp-volume-bar").bind("click", function(t) {
            var a = t.offsetX + 1;
            if (a > 50) {
                a = 50
            }
            Settings.setValue("volume", a);
            $(".jp-volume-bar-value").width(a);
            Settings.setValue("volume", a);
            s.postMessage({act: "volume",data: a});
            clearTimeout(e);
            e = setTimeout(function() {
                $(".jp-volume").hide()
            }, 4e3)
        });
        $(".jp-seek-bar").bind("click", function(e) {
            var t = e.offsetX + 1;
            if (t > 240) {
                t = 240
            }
            console.log(t);
            var a = t / 240;
            s.postMessage({act: "playTo",data: a})
        });
        $(".jp-mute,.jp-unmute").bind("mouseover", function() {
            var e = Settings.getValue("volume", "40");
            $(".jp-volume-bar-value").width(e);
            $(".jp-volume").show()
        });
        $(".jp-volume").bind("mouseover", function() {
            clearTimeout(e)
        });
        $(".jp-volume").bind("mouseout", function() {
            clearTimeout(e);
            e = setTimeout(function() {
                $(".jp-volume").hide()
            }, 4e3)
        });
        if (l.playList != undefined && l.playList.length == 0) {
            o.get("hot", 0, function() {
                $(".arrow").trigger("click")
            })
        } else {
            o.get("hot", 0)
        }
        $(".cycle").bind("click", function() {
            var e = $(this);
            e.toggleClass("cycle1");
            if (e.hasClass("cycle1")) {
                Settings.setValue("cycle", 1);
                e.attr("title", "单曲循环")
            } else {
                Settings.setValue("cycle", 0);
                e.attr("title", "顺序播放")
            }
        });
        if (Settings.getValue("cycle", 0) == 1) {
            $(".cycle").addClass("cycle1")
        }
        $("#songChannel").bind("click", function() {
            var e = $(this).attr("data-sid");
            e = 3635044;
            var t = getPlayData();
            var a = t.playList[t.playIndex];
            var i = {title: a.title,cover: a.picture,id: e,sid: e};
            $.getJSON("http://douban.fm/j/change_channel?fcid=" + t.channelInfo.id + "&tcid=" + e + "&area=songchannel", function(e) {
                o.playChannel(i)
            })
        })
    };
    var o = {hotChannels: [],upChannels: [],comChannels: [],config: {hotUrl: "http://douban.fm/",searchUrl: "http://douban.fm/j/explore/search?query=",cateUrl: "http://douban.fm/j/explore/genre?gid=",tmpl: "<li>					<div data-id='$id$'>						<img src='$img$' title='$intro$'/>					</div>					<a>$name$</a>				</li>",tmpl_fav: "<li>					<div data-id='$id$'>						<img src='$img$' title='$intro$'/>						<i title='取消收藏'>×</i>					</div>					<a>$name$</a>				</li>"},getFav: function() {
        var e = "http://douban.fm/j/fav_channels";
        $.getJSON(e, function(e) {
            var t = new Array;
            var a = o.config.tmpl_fav;
            var i = "";
            for (var n = 0; n < e.channels.length; n++) {
                var s = e.channels[n];
                var l = s.name;
                var r = s.id;
                var c = s.cover;
                var d = s.intro;
                t.push(r);
                var u = a.replace("$img$", c);
                u = u.replace("$name$", l);
                u = u.replace("$id$", r);
                u = u.replace("$intro$", d);
                i += u
            }
            $("#cate").hide();
            $("#lists").empty().show().append(i);
            Settings.setObject("favids", t)
        })
    },getHot: function(e) {
        var t = o.config.tmpl;
        var a = "";
        var n = o.config.hotUrl;
        var s = function() {
            var n = [];
            switch (e) {
                case "hot":
                    n = o.hotChannels;
                    break;
                case "up":
                    n = o.upChannels;
                    break;
                case "com":
                    n = o.comChannels;
                    break
            }
            for (i = 0; i < n.length; i++) {
                var s = n[i];
                var l = t.replace("$img$", s.cover);
                l = l.replace("$name$", s.name);
                l = l.replace("$id$", s.id);
                l = l.replace("$intro$", s.intro);
                a += l
            }
            $("#cate").hide();
            $("#lists").empty().show().append(a);
            $("#lists li a").bind("click", function() {
                $(this).siblings("div").trigger("click")
            })
        };
        if (o.hotChannels.length > 0) {
            s()
        } else {
            $.get(n, function(e) {
                var t = e.match(/window\.hot_channels_json\s\=(.*);/);
                o.hotChannels = JSON.parse(t[1]);
                var a = e.match(/window\.fast_channels_json\s\=(.*);/);
                o.upChannels = JSON.parse(a[1]);
                var i = e.match(/window\.com_channels_json\s\=(.*);/);
                o.comChannels = JSON.parse(i[1]);
                s()
            })
        }
    },get: function(e, t, a) {
        var n = "";
        var s = o.config.tmpl;
        var l = "";
        switch (e) {
            case "com":
            case "hot":
            case "up":
                o.getHot(e);
                break;
            case "search":
                n = o.config.searchUrl + encodeURIComponent(arguments[2]) + "&start=" + t + "&limit=24";
                break;
            case "cate":
                n = o.config.cateUrl + arguments[2] + "&start=" + t + "&limit=24";
                break
        }
        if (n != "") {
            $.getJSON(n, function(e) {
                $(".lists").scrollTop(0);
                if (e.data && e.data.channels) {
                    for (i = 0; i < e.data.channels.length; i++) {
                        var t = e.data.channels[i];
                        var n = s.replace("$img$", t.cover);
                        n = n.replace("$name$", t.name);
                        n = n.replace("$id$", t.id);
                        n = n.replace("$intro$", t.intro);
                        l += n
                    }
                    $("#cate").hide();
                    $("#lists").empty().show().append(l);
                    $("#lists li a").bind("click", function() {
                        $(this).siblings("div").trigger("click")
                    });
                    if (a && typeof a == "function") {
                        a()
                    }
                } else {
                }
            })
        }
    },playChannel: function(e) {
        var t = e;
        if (e == "-3") {
            t = {title: "红心电台",cover: "douban/red.gif",id: "-3"}
        } else if (e == "0") {
            t = {title: "私人电台",cover: "douban/private.gif",id: "0"}
        }
        $("#channel_cover").attr("src", t.cover);
        $("#channel_title").text(t.title);
        $(".jp-play").hide();
        $(".jp-pause").show();
        $("#channel_status").addClass("playing").removeClass("waiting");
        $(".header").attr("data-id", t.id);
        s.postMessage({act: "playList",data: t})
    },getLyric: function(t) {
        var a = false;
        if (e.showLyric) {
            $(".lyric").text("正在加载歌词");
            var i = "http://sug.music.baidu.com/info/suggestion?format=json&word=";
            var s = "http://music.baidu.com/data/music/fmlink?songIds=";
            var l = "http://music.baidu.com";
            i = i + encodeURIComponent(t.artist + " " + t.title);
            $.getJSON(i, function(e) {
                if (e.song.length > 0) {
                    s += e.song[0].songid;
                    $.getJSON(s, function(e) {
                        if (e.data.songList.length > 0) {
                            l += e.data.songList[0].lrcLink;
                            $.get(l, function(e) {
                                e = e.split("\n");
                                var i = /^((?:\[[\d.:]+?\])+?)([^\[\]]*)$/;
                                var s = {};
                                for (var l = 0, r = e.length; l < r; l += 1) {
                                    var c = e[l].match(i);
                                    var o;
                                    if (c) {
                                        o = c[1].slice(1, -1).split("][");
                                        for (var d = 0, u = o.length, f; d < u; d += 1) {
                                            f = o[d].split(":");
                                            s[Number(f[0]) * 60 + Math.floor(f[1])] = c[2]
                                        }
                                    }
                                }
                                n.lyric = s;
                                n.title = t.title;
                                Settings.setObject("lyric", n);
                                a = true;
                                $(".lyric").text(t.title)
                            })
                        }
                    })
                }
            })
        }
        if (!a) {
            $(".lyric").html(t.title)
        }
    },del: function(e) {
        l.playList.splice(l.playIndex, 1);
        l.playIndex -= 1;
        Settings.setObject("playData", l);
        $(".jp-next").trigger("click");
        var t = "http://douban.fm/j/mine/playlist?type=b&sid=" + e + "&pt=100&channel=" + l.channelInfo.id + "&pb=64&from=mainsite";
        $.get(t)
    },red: function(e, t) {
        var a = "http://douban.fm/j/mine/playlist?type=r&sid=" + e + "&pt=100&channel=" + t + "&pb=64&from=mainsite";
        var i = "http://douban.fm/j/mine/playlist?type=u&sid=" + e + "&pt=100&channel=" + t + "&pb=64&from=mainsite";
        var n = a;
        var s = $(".jp-like");
        l = getPlayData();
        if (s.attr("data-liked") == "1") {
            n = i;
            s.attr("data-liked", "0");
            l.playList[l.playIndex].like = 0
        } else {
            s.attr("data-liked", "0");
            l.playList[l.playIndex].like = 1
        }
        Settings.setObject("playData", l);
        s.toggleClass("jp-liked");
        $.get(n, function(e) {
        })
    }};
    t.fav = {check: function(e) {
        var t = Settings.getObject("favids");
        if (t == undefined) {
            return false
        }
        if (t.length > 0) {
            for (var a = t.length - 1; a >= 0; a--) {
                if (t[a] == e)
                    return true
            }
            return false
        }
    },add: function(e) {
        var t = "http://douban.fm/j/explore/fav_channel?cid=" + e;
        $.getJSON(t, function(t) {
            if (t.status) {
                var a = Settings.getObject("favids");
                if (a == undefined) {
                    a = new Array
                }
                a.push(e);
                Settings.setObject("favids", a)
            }
        })
    },remove: function(e) {
        var t = "http://douban.fm/j/explore/unfav_channel?cid=" + e;
        $.getJSON(t, function(t) {
            if (t.status) {
                var a = Settings.getObject("favids");
                if (a == undefined) {
                    a = new Array
                }
                if (a.length > 0) {
                    for (var i = a.length - 1; i >= 0; i--) {
                        if (a[i] == e) {
                            a.splice(i, 1);
                            Settings.setObject("favids", a);
                            break
                        }
                    }
                }
            }
        })
    }};
    var d = {config: {verficIdUrl: "http://douban.fm/j/new_captcha",verficImage: "http://douban.fm/misc/captcha?size=m&id=",loginUrl: "http://douban.fm/j/login"},status: false,isPro: false,verfic: function() {
        $.ajax({type: "GET",url: d.config.verficIdUrl,dataType: "text",success: function(e) {
            var t = d.config.verficImage;
            var a = e.replace('"', "").replace('"', "");
            $("#captcha_id").val(a);
            var i = $("#captcha");
            i.attr("src", t + a);
            i.click(function() {
                d.verfic()
            })
        }})
    },init: function() {
        if ($(".cates").offset().left == 0) {
            $(".arrow").trigger("click")
        }
        $(".login").animate({left: "0px"});
        $("#btn-cancel").click(function() {
            $(".login").animate({left: "300px"})
        });
        d.verfic();
        var e = $("#btn-submit");
        var t = false;
        e.unbind("click");
        e.bind("click", function() {
            if (!t) {
                t = true;
                $.ajax({type: "POST",url: d.config.loginUrl,data: $("#login_form").serialize(),success: function(e) {
                    if (e.r == 0) {
                        Settings.setObject("userInfo", e.user_info);
                        var a = e.user_info;
                        $("#login_password,#captcha_solution").val("");
                        $(".login").animate({left: "300px"});
                        $("#user_menu").show();
                        $("#tag_fav").show();
                        $("body").bind("click", function() {
                            $("#user_menu").hide();
                            $("body").unbind("click")
                        });
                        d.needLogin = false;
                        d.status = true;
                        d.isPro = a.is_pro;
                        $("#user_status span").text(a.name);
                        if (d.isPro) {
                            Settings.setValue("vipkbps", 192);
                            $("#user_pro").show();
                            $("#user_status").attr("title", "PRO用户，享受192K高清音质")
                        } else {
                            $("#user_pro").hide();
                            $("#user_status").attr("title", "")
                        }
                    } else {
                        alert(e.err_msg);
                        d.verfic()
                    }
                    t = false
                }})
            }
        })
    },checkLogin: function() {
        chrome.cookies.get({url: "http://douban.fm",name: "dbcl2"}, function(e) {
            if (e != null) {
                d.status = true;
                var t = Settings.getObject("userInfo") || {};
                if (t.name)
                    $("#user_status span").attr("title", t.name);
                $("#tag_fav").show();
                if (t != undefined && t.is_pro) {
                    d.isPro = true;
                    $("#user_status").attr("title", "PRO用户/192K高清音质");
                    $("#user_pro").show()
                } else {
                    $("#user_pro").hide();
                    $("#user_status").attr("title", "")
                }
            } else {
                $("#user_status span").text("登录");
                $("#user_pro").hide();
                $("#tag_fav").hide();
                $("#user_status").attr("title", "");
                var a = l.channelInfo.id;
                if (a == "-3" || a == "0") {
                    d.needLogin = true;
                    d.init()
                }
            }
        })
    },logout: function() {
        chrome.cookies.remove({url: "http://douban.fm",name: "dbcl2"});
        d.status = false;
        $("#user_status span").text("登录");
        $("#user_pro").hide();
        $("#user_menu").hide();
        var e = l.channelInfo.id;
        if (e == "-3" || e == "0") {
            d.needLogin = true;
            d.init()
        }
    }};
    var u = null;
    var f = function(e) {
        $(".tips").fadeIn().text(e);
        clearTimeout(u);
        u = setTimeout(function() {
            $(".tips").fadeOut()
        }, 1e3)
    };
    t.hotkey = function() {
        $("body").bind("keydown", function() {
            var e = window.event.keyCode;
            switch (e) {
                case 70:
                    $(".jp-like").trigger("click");
                    f("红心");
                    break;
                case 68:
                    $(".jp-del").trigger("click");
                    f("删除");
                    break;
                case 39:
                    $(".jp-next").trigger("click");
                    f("下一首");
                    break;
                case 37:
                    $(".jp-previous").trigger("click");
                    f("上一首");
                    break;
                case 38:
                    var t = Settings.getValue("volume", 50);
                    t += 5;
                    if (t > 50)
                        t = 50;
                    s.postMessage({act: "volume",data: t});
                    f("音量" + t * 2 + "%");
                    break;
                case 40:
                    var t = Settings.getValue("volume", 50);
                    t -= 5;
                    if (t < 0)
                        t = 0;
                    s.postMessage({act: "volume",data: t});
                    f("音量" + t * 2 + "%");
                    break;
                case 80:
                    if ($(".jp-play").is(":visible")) {
                        $(".jp-play").trigger("click");
                        f("播放")
                    } else {
                        $(".jp-pause").trigger("click");
                        f("暂停")
                    }
                    break
            }
        })
    };
    t.init = function() {
        t.bind();
        d.checkLogin();
        t.hotkey()
    };
    t.init()
});
