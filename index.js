var request = require('request').defaults({proxy:'http://ipg_2012066:karankannu@192.168.1.107:3128/', agent:false});
var cheerio = require('cheerio');
var URL = require('url-parse');

var START_URL = "https://www.rentomojo.com/";



var links=[];

function getUrls($,callback){
  var link = $("a[href^='/']");
  link.each(function() {
      links.push($(this).attr('href'));

  });
  callback(links);
}

function urlss(data){
  console.log(data);
}

request(START_URL, function (error, response, html) {
  if(error){
    console.log(error);
  }else if (response.statusCode == 200) {
    var $ = cheerio.load(html);
    
      getUrls($,urlss);
  }
});