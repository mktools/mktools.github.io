// quoted from:
// https://blog.makotoishida.com/2013/02/javascript-enter.html

$(function(){
  var elements = "input[type=number]";
  $(elements).keypress(function(e) {
    var c = e.which ? e.which : e.keyCode;
    if (c == 13) { 
      var index = $(elements).index(this);
      var criteria = e.shiftKey ? ":lt(" + index + "):last" : ":gt(" + index + "):first";
      $(elements + criteria).focus();
      e.preventDefault();
    }
  });
});