var Settings={};Settings.configCache={};Settings.setValue=function e(t,a){Settings.configCache[t]=a;var n={};if(localStorage.config)n=JSON.parse(localStorage.config);n[t]=a;localStorage.config=JSON.stringify(n);return a};Settings.getValue=function t(e,a){if(!localStorage.config)return a;var n=JSON.parse(localStorage.config);if(typeof n[e]=="undefined")return a;Settings.configCache[e]=n[e];return n[e]};Settings.getCacheValue=function a(e,t){if(typeof Settings.configCache[e]!="undefined")return Settings.configCache[e];if(!localStorage.config)return t;var a=JSON.parse(localStorage.config);if(typeof a[e]=="undefined")return t;Settings.configCache[e]=a[e];return a[e]};Settings.keyExists=function n(e){if(!localStorage.config)return false;var t=JSON.parse(localStorage.config);return t[e]!=undefined};Settings.setObject=function i(e,t){localStorage[e]=JSON.stringify(t);return t};Settings.getObject=function r(e){if(localStorage[e]==undefined)return undefined;return JSON.parse(localStorage[e])};Settings.refreshCache=function s(){Settings.configCache={}};var getPlayData=function(){var e=Settings.getObject("playData");if(e==undefined){e={playList:new Array,playListDate:new Date,playIndex:0,channelInfo:{}}}return e};var getPlayLyric=function(){var e=Settings.getObject("lyric");if(e==undefined){e={};Settings.setObject("lyric",e)}return e};var getKbps=function(){var e=64;var t=Settings.getObject("userInfo");if(t!=undefined){if(t.is_pro){e=Settings.getValue("vipkbps",192);e=e+"&kbps="+e}}return e};var shareTool={init:function(){shareTool.creat();shareTool.bind()},creat:function(){var e='        <div id="shareTool" class="hide">        <div class="sharetip"></div>        <div class="share">            <a class="sina">新浪微博</a>            <a class="renren">人人网</a>            <a class="qq">QQ好友</a>            <a class="qzone">QQ空间</a>            <a class="tencent">腾讯微博</a>            <a class="douban">豆瓣</a>        </div>        </div>';$("body").append(e)},bind:function(){var e={title:function(){songdata=getPlayData();return songdata.playList[songdata.playIndex].title},desc:function(){songdata=getPlayData();return"分享来自豆瓣FM"+songdata.channelInfo.title+"MHz "+songdata.playList[songdata.playIndex].artist+"的歌曲"+songdata.playList[songdata.playIndex].title+"(来自豆瓣FM原味版Chrome扩展)"},image:function(){songdata=getPlayData();return songdata.playList[songdata.playIndex].picture},url:function(){songdata=getPlayData();return"http://douban.fm/?start="+songdata.playList[songdata.playIndex].sid+"g"+songdata.playList[songdata.playIndex].ssid+"g"+songdata.channelInfo.id+"&cid="+songdata.channelInfo.id},source:function(){return"来自豆瓣FM原味版Chrome扩展"}};$(".sharetip").hover(function(){$("#shareTool").addClass("show")});$("#shareTool").bind("mouseleave",function(){$("#shareTool").removeClass("show")});$(".share a").bind("click",function(){var t=$(this);var a=t.attr("class");var n="";var i={title:"name",url:"href",desc:"text",image:"image",source:"desc"};switch(a){case"douban":n="http://www.douban.com/share/recommend?";break;case"sina":n="http://v.t.sina.com.cn/share/share.php?";i.url="url";i.desc="title";i.image="pic";break;case"renren":n="http://widget.renren.com/dialog/share?";i.desc="title";i.url="resourceUrl";i.source="description";break;case"qzone":n="http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?";i.url="url";i.title="title";i.desc="desc";i.source="summary";i.image="pics";break;case"qq":n="http://connect.qq.com/widget/shareqq/index.html?";i.title="title";i.desc="desc";i.source="site";i.url="url";i.image="pics";break;case"tencent":n="http://share.v.t.qq.com/index.php?c=share&a=index&";i.url="url";i.image="pic";i.desc="title";i.source="site";break}n+=[i.title,"=",encodeURIComponent(e.title()),"&",i.desc,"=",encodeURIComponent(e.desc()),"&",i.url,"=",encodeURIComponent(e.url()),"&",i.image,"=",encodeURIComponent(e.image()),"&",i.source,"=",encodeURIComponent(e.source())].join("");window.open(n,"_blank")})}};