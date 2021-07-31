// ==UserScript==
// @name         LinkCheatGuradian_BiliBili
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       wlx0079
// @match        *://www.bilibili.com/*
// @icon         https://i0.hdslb.com/bfs/album/5b628d8d94bbf2f80f8006f1f6865a3f977e51d2.jpg
// @grant        GM_xmlhttpRequest
// ==/UserScript==



var hashmap = new Map()

function getTitle(text){
    var myReg = new RegExp("<title.*title>");
    var nt = text.match(myReg)[0];
    var title = nt.split("<")[1];
    title = title.split(">")[1];
    title = title.split("_哔哩哔哩_bilibili")[0]
    return title;
}



function httpGet(theUrl,theSpan)
{
    GM_xmlhttpRequest({
        url: theUrl,
        method :"GET",
        onload:function(xhr){
            var name = getTitle(xhr.responseText)
            if(!hashmap.has(theSpan.innerHTML)){
               theSpan.innerHTML = theSpan.innerHTML + '<p style="font-family:verdana; color:rgb(70,60,220); font-weight:800; font-size:12pt">#诈骗检测：'+name+"</p>"
               hashmap.set(theSpan.innerHTML,1)
        }
        }
    });
}


function Alter(){
    console.log("bg")
    var links = document.getElementsByTagName("a")
    for (var i = 0 ; i < links.length ; ++i){
        var url = links[i].href;
        if (url.search("b23.tv") != -1 ){
            httpGet(url,links[i])
        }
    }
}




function Main() {
    'use strict'
    Alter();
}
setInterval(Main,1500)


