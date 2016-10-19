function blockUI() {
  $.blockUI({
    message: '<div class="loader"></div>'
  });
  var navHieght = $(".navbar").height();
  $(".loader").css("top", navHieght);
  $(".loader").fadeIn();
}

function unblockUI() {
  $.unblockUI();
  $(".loader").fadeOut();
}

function generatingTemplate(template, data, dataWrapperStartSign, dataWrapperEndSign) {
  var returnTemplate = template;
  var dataStartSign = dataWrapperStartSign || '{{';
  var dataEndSign = dataWrapperEndSign || '}}';

  while (true) {
    if (returnTemplate.length > 0) {
      var str = returnTemplate;
      var n1 = str.indexOf(dataStartSign);
      var n2 = str.indexOf(dataEndSign);
      if (n1 == -1 || n2 == -1 || n1 >= n2) {
        break;
      } else {
        var variable = str.substr(n1, n2 - n1 + 2);
        var key = (str.substr(n1 + 2, n2 - n1 - 2)).trim();

        if (data.hasOwnProperty(key)) {
          var value = data[key];
          returnTemplate = returnTemplate.replace(variable, value);
        } else {
          console.log(key);
          console.log("invalid key : " + variable);
          break;
        }
      }
    } else {
      break;
    }
  }
  return returnTemplate;
};

function timeAgoFromEpochTime(epoch) {
  var secs = ((new Date()).getTime() / 1000) - epoch;
  Math.floor(secs);
  var minutes = secs / 60;
  secs = Math.floor(secs % 60);
  if (minutes < 1) {
    return secs + (secs > 1 ? ' seconds ago' : ' second ago');
  }
  var hours = minutes / 60;
  minutes = Math.floor(minutes % 60);
  if (hours < 1) {
    return minutes + (minutes > 1 ? ' minutes ago' : ' minute ago');
  }
  var days = hours / 24;
  hours = Math.floor(hours % 24);
  if (days < 1) {
    return hours + (hours > 1 ? ' hours ago' : ' hour ago');
  }
  var weeks = days / 7;
  days = Math.floor(days % 7);
  if (weeks < 1) {
    return days + (days > 1 ? ' days ago' : ' day ago');
  }
  var months = weeks / 4.35;
  weeks = Math.floor(weeks % 4.35);
  if (months < 1) {
    return weeks + (weeks > 1 ? ' weeks ago' : ' week ago');
  }
  var years = months / 12;
  months = Math.floor(months % 12);
  if (years < 1) {
    return months + (months > 1 ? ' months ago' : ' month ago');
  }
  years = Math.floor(years);
  return years + (years > 1 ? ' years ago' : ' years ago');
}

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

$.extend({
  getUrlVars: function(){
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  },
  getUrlVar: function(name){
    return $.getUrlVars()[name];
  }
});

function getDeviceType() {
  var Sys = {};
  var ua = navigator.userAgent.toLowerCase();
  var s;
  (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1]:
    (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
    (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
    (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
    (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;


  if (Sys.ie) return ('IE: ' + Sys.ie);
  if (Sys.firefox) return ('Firefox: ' + Sys.firefox);
  if (Sys.chrome) return ('Chrome: ' + Sys.chrome);
  if (Sys.opera) return ('Opera: ' + Sys.opera);
  if (Sys.safari) return ('Safari: ' + Sys.safari);
  return "web";
}

function getUDID() {
  return window.navigator.userAgent.replace(/\D+/g, '');
}
