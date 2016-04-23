var request = require('request').defaults({proxy:'http://ipg_2012066:karankannu@192.168.1.107:3128/', agent:false});
var cheerio = require('cheerio');
var URL = require('url-parse');

var START_URL = "http://www.roposo.com/";



var links=[];

function getUrls($,callback){
  var link = $("a[href^='/']");
  link.each(function() {
      links.push($(this).attr('href'));

  });
  callback(links);
}

function urlss(data){
  // console.log(data);
  for(var i=0,len=data.length;i<len;i++){
    // console.log(START_URL+data[i]);
    if(START_URL+data[i] === "http://www.roposo.com//about"){
      console.log("@");
      crawl(START_URL+data[i]);
    }
  }
}

request(START_URL, function (error, response, html) {
  if(error){
    console.log(error);
  }else if (response.statusCode == 200) {
    var $ = cheerio.load(html);
    
      getUrls($,urlss);
  }
});

function crawl(url){
  console.log("##");
  request(url,function(error,response,html){
     if(error){
      console.log(error);
    }else if (response.statusCode == 200) {
      var $ = cheerio.load(html);
      
        getPtag($,showPtag);
    } 
  });
}


function getPtag($,callback){
  var ptag=[];
  $('p').each(function(){
    ptag.push($(this).text());
  });
  callback(ptag);
}

function showPtag(data){
  console.log(data);
}
