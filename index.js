var request= require('request').defaults({proxy:'http://ipg_2012066:karankannu@192.168.1.107:3128/', agent:false});
var cheerio = require('cheerio');

request('https://news.ycombinator.com', function (error, response, html) {
  if (!error && response.statusCode == 200) {
    console.log(html);
  }
});