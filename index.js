var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var fs = require('fs');


//-------------------------------------------
//-------------Contact Details-----------------
//-------------------------------------------

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
  console.log("Going to write into Contact file");
  fs.writeFile('Contact.txt', contactDetais,  function(err) {
     if (err) {
         return console.error(err);
     }
  console.log("Data written successfully!");
  });
}


//-------------------------------------------
//-------------About Details-----------------
//-------------------------------------------

function getAbout($,callback){
  var ptag=[];
  $('p').each(function(index){
    ptag.push(index+":\n");
    ptag.push($(this).text());
  });
  callback(ptag);
}

function showAbout(data){
  console.log("Going to write into About file");
  fs.writeFile('About.txt', data,  function(err) {
     if (err) {
         return console.error(err);
     }
  console.log("Data written successfully!");
  });
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


//-------------------------------------------
//----------Url On Home Page-----------------
//-------------------------------------------

function urlss(data,START_URL){
  for(var i=0,len=data.length;i<len;i++){
    if(START_URL+data[i] === "http://www.roposo.com/contact"){
      crawlContact(START_URL+data[i]);
    }
    if(START_URL+data[i] === "http://www.roposo.com/about"){
      crawlAbout(START_URL+data[i]);
    }

  }
}


function getUrls($,START_URL,callback){
  var links=[];
  var z=String($.html());

  // This is to find all the urls in href
  while(z.indexOf("href")!=-1){
    var ind=z.indexOf("href");
    var len=z.length;
    var cat=z.substr(ind,len-ind);
    var ind1=cat.indexOf("\"");
    if(ind1== -1){
      z=cat.substr(5,cat.length-5);
      continue;
    }
    var len1=cat.length;
    var cat1=cat.substr(ind1+1,len1-ind1-1);
    var ind2=cat1.indexOf("\"");
    if(ind2 == -1){
      z=cat1.substr(2,cat1.length-2);
    }
    var st=cat1.substr(0,ind2);
    z=cat1.substr(ind2+1,cat1.length-ind2-1)
    links.push(st);
  }

  // This is by using jquery
  //
  // var links=[];
  /* var link = $("a[href^='/']");
  // link.each(function() {
  //     links.push($(this).attr('href'));
    });*/
  callback(links,START_URL);
}






//-------------------------------------------
//-------------Alexa Details-----------------
//-------------------------------------------


function alexaDetails($,callback){
  var details={
    'Global Rank': '',
    'India Rank' : '',
    'Bounce Rate' : '',
    'Daily Pageviews per Visitor' : '',
    'Daily Time On Site' : '',
    'Search Keywords' : ''
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
  dailytime=dailytime.substr(18,4);
  details['Daily Time On Site']=dailytime;  


  var keywords=$(".topkeywordellipsis[title]").text();
  details['Search Keywords']=keywords;
  callback(details);
}

function showAlexaDetails(data){
 var alexaDetail=[];
 for(d in data){
    alexaDetail.push(d+':'+data[d]);
    alexaDetail.push('\n');
 }
 console.log("Going to write into Alexa file");
  fs.writeFile('Alexa.txt', alexaDetail,  function(err) {
     if (err) {
         return console.error(err);
     }
  console.log("Data written successfully!");
  });
}




function alexa(START_URL){
  var alexa_url = 'http://www.alexa.com/siteinfo/'+START_URL;
  request(alexa_url, function (error, response, html) {
    if(error){
      console.log(error);
    }else if (response.statusCode == 200) {
      var $ = cheerio.load(html);
      alexaDetails($,showAlexaDetails);
    }
  });
}

// alexa('http://www.roposo.com/');

function contactAndAbout(START_URL){
  if(START_URL[START_URL.length-1]=='/'){
    START_URL=START_URL.slice(0,-1);
  }
  request(START_URL, function (error, response, html) {
    if(error){
      console.log(error);
    }else if (response.statusCode == 200) {
      var $ = cheerio.load(html);
        getUrls($,START_URL,urlss);
    }
  });
}

// contactAndAbout('http://www.roposo.com/');

exports.contactAndAbout=contactAndAbout;
exports.alexa=alexa;