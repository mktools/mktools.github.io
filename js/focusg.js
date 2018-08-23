
$(function(){
  var elements = "input[type=text]";
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
