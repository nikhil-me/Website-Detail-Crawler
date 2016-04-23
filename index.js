var request = require('request').defaults({proxy:'http://ipg_2012066:karankannu@192.168.1.107:3128/', agent:false});
var cheerio = require('cheerio');
var URL = require('url-parse');
var fs = require('fs');

var START_URL = "http://www.roposo.com/";



var links=[];





function getContact($,callback){
  var z=String($.html());
  var content=$(z).text();
  content=content.replace('\n',"");
  content = content.replace(/(\r\n|\n|\r)/gm,"");
  var tex=content.split(" ");
  var email=[];
  var phone=[];
  for(var i=0,len=tex.length;i<len;i++){
    if(tex[i].match('[^@]+@[^@]+\.[^@]+')){
      email.push(tex[i]);
    }
    if(tex[i].match('^[0-9()-]+$')){
      if(tex[i].length==10){
        // console.log(tex[i]);
        phone.push(tex[i]);
      }
    }
  }
  callback(email,phone);
}

function showContact(data,data1){
  var email="Email are :"+ data.join();
  var phoneno="Phone No.:"+data1.join();
  var contactDetais= email + '\n' +phoneno;
  console.log("Going to write into a file");
  fs.writeFile('Contact.txt', contactDetais,  function(err) {
     if (err) {
         return console.error(err);
     }
  console.log("Data written successfully!");
  });
}

function getAbout($,callback){
  var ptag=[];
  $('p').each(function(index){
    ptag.push(index+":\n");
    ptag.push($(this).text());
  });
  callback(ptag);
}

function showAbout(data){
  console.log("Going to write into a file");
  fs.writeFile('About.txt', data,  function(err) {
     if (err) {
         return console.error(err);
     }
  console.log("Data written successfully!");
  });
  // console.log(data);
}




function crawlContact(url){
  request(url,function(error,response,html){
     if(error){
      console.log(error);
    }else if (response.statusCode == 200) {
      var $ = cheerio.load(html);
        getContact($,showContact);
    } 
  });
}

function crawlAbout(url){
  request(url,function(error,response,html){
     if(error){
      console.log(error);
    }else if (response.statusCode == 200) {
      var $ = cheerio.load(html);
        getAbout($,showAbout);
    } 
  });
}


function getUrls($,callback){
  var link = $("a[href^='/']");
  link.each(function() {
      links.push($(this).attr('href'));
  });
  callback(links);
}

function urlss(data){
  for(var i=0,len=data.length;i<len;i++){
    // console.log(START_URL+data[i]);
    if(START_URL+data[i] === "http://www.roposo.com/contact"){
      crawlContact(START_URL+data[i]);
    }
    if(START_URL+data[i] === "http://www.roposo.com/about"){
      crawlAbout(START_URL+data[i]);
    }

  }
}

// request(START_URL, function (error, response, html) {
//   if(error){
//     console.log(error);
//   }else if (response.statusCode == 200) {
//     var $ = cheerio.load(html);
//       getUrls($,urlss);
//   }
// });




//-------------------------------------------
//-------------Alexa Details-----------------
//-------------------------------------------

var alexa_url = 'http://www.alexa.com/siteinfo/'+ START_URL;

request(alexa_url, function (error, response, html) {
  if(error){
    console.log(error);
  }else if (response.statusCode == 200) {
    var $ = cheerio.load(html);
    // console.log($.html());
    alexaDetails($,showAlexaDetails);
  }
});


function alexaDetails($,callback){
  var details={
    'Global Rank': '',
    'India Rank' : '',
    'Bounce Rate' : '',
    'Daily Pageviews per Visitor' : '',
    'Daily Time On Site' : ''
  };
  var grank=$("img[title|='Global rank icon']").next().text();
  var irank=$("img[title|='India Flag']").next().text();
  grank=grank.replace(/\n/g,'');
  grank=grank.replace(/ /g,'');
  irank=irank.replace(/\n/g,'');
  irank=irank.replace(/ /g,'');
  details['Global Rank']=grank;
  details['India Rank']=irank;


  var brate=$(".span4:nth-child(1)").text();
  brate=brate.replace(/(\r\n|\n|\r)/gm,"");
  brate=brate.substr(11,6);
  details['Bounce Rate']=brate;


  var dailyvisit=$(".span4:nth-child(2)").text();
  dailyvisit=dailyvisit.replace(/(\r\n|\n|\r)/gm,"");
  dailyvisit=dailyvisit.substr(73,4);
  details['Daily Pageviews per Visitor']=dailyvisit;


  var dailytime=$(".span4:nth-child(3)").text();
  dailytime=dailytime.replace(/(\r\n|\n|\r)/gm,"");
  // for(var i=0,len=dailytime.length;i<len;i++){
  //   console.log(i+":"+dailytime[i]);
  // }
  dailytime=dailytime.substr(18,4);
  details['Daily Time On Site']=dailytime;  
  callback(details);
}

function showAlexaDetails(data){
  console.log(data);
}