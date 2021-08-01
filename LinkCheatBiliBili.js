
// ==UserScript==
// @name         LinkCheatGuardian_BiliBili
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  对b23.tv/xxxx这样的链接，直接获取到真实地址的标题，以免用户点进去自己不想看到的内容
// @author       wlx0079
// @match        *://www.bilibili.com/video/*
// @icon         https://i0.hdslb.com/bfs/album/5b628d8d94bbf2f80f8006f1f6865a3f977e51d2.jpg
// @grant        GM_xmlhttpRequest
// ==/UserScript==

//Update: 0801-01:42 只采集/video，采用hashmap缓存策略减少访问量，时间间隔调大，访问太多要验证码的==
//Update: 0801-11:35 采用异步更新的方式，一个较长间隔请求未访问的网址，一个较短间隔从内存中更新内容


var TEST_B23 = true
var TEST_BV  = false
var TEST_SPACE = true


var hashmap = new Map()

function getContent(text, regex){

    var nt = text.match(regex)[0];
    var title = nt.split("<")[1];
    title = title.split(">")[1];
    title = title.split("_哔哩哔哩")[0]
    return title
}
function getTitle(text){
    var myReg = new RegExp("<title.*title>");
    return getContent(text, myReg)
}
function getSpaceName(text){
    var myReg = new RegExp("<title.*title>");
    return getContent(text, myReg)
}


//测试是否为b23.tv类诈骗
function TestB23(url, innerHTML){
    if(!TEST_B23) return false;
     return (url.search("b23.tv") != -1 && innerHTML.search("b23.tv") != -1)
}

//测试是否为BV类诈骗
function TestBV(url, innerHTML){
    if(!TEST_BV) return false;
    return (url.search("www.bilibili.com/video") != -1 && innerHTML.search("BV") != -1)
}
//测试个人空间诈骗
function TestSpace(url,innerHTML){
    if(!TEST_SPACE) return false;
    return (url.search("space.bilibili.com") != -1 && innerHTML.search("space.bilibili.com") != -1)
}

//打包
function Test(url,innerHTML){
    return TestBV(url,innerHTML) || TestB23(url,innerHTML)|| TestSpace(url,innerHTML)
}



function httpGet(theUrl,theSpan,callback)
{
    GM_xmlhttpRequest({
        url: theUrl,
        method :"GET",
        onload:function(xhr){
            var name = getTitle(xhr.responseText)
            if(!hashmap.has(theSpan.innerHTML)){
               var newContent = theSpan.innerHTML + '<p style="font-family:verdana; color:rgb(70,60,220); font-weight:800; font-size:12pt">#诈骗检测：'+name+"</p>"
               hashmap.set(theSpan.innerHTML,newContent)
               hashmap.set(newContent,"$")
               theSpan.innerHTML = newContent
        }
        }
    });
}

function tryEdit(link,url, inner, callback){
    if(hashmap.has(inner)){
       var content = hashmap.get(inner)
       if(content != "$"){
           link.innerHTML = content
       }
    } else {
       httpGet(url,link, callback)
    }
}


function getRequest(){
    var links = document.getElementsByTagName("a")
    for (var i = 0 ; i < links.length ; ++i){
        var url = links[i].href;
        var inner = links[i].innerHTML

        if ( Test(url,inner)){
            tryEdit(links[i],url,inner,getTitle)
        }
    }
}

function Alter(){
    var links = document.getElementsByTagName("a")
    for (var i = 0 ; i < links.length ; ++i){
        var url = links[i].href;
        var inner = links[i].innerHTML

        if ( Test(url,inner) ){
            if(hashmap.has(links[i].innerHTML)){
                var content = hashmap.get(links[i].innerHTML);
                if (content != "$"){
                    links[i].innerHTML = content;
                }
            }
        }
    }
}




setInterval(getRequest,2500)
setInterval(Alter,1000)


