function countLine(id, str) {
  // str = str.replace(/^\n/g, '');
  var m = 12 / Number(document.getElementById("playernum").value);

  num = str.match(/\r\n|\n/g);
  if (num !== null) {
    line = num.length + 1;
  } else {
    line = 1;
  }

  if (str.length === 0) {
    line = 0;
  }

  if (m === 1) {
    if (id === "linef") {
      document.getElementById(id).innerHTML = "進行役 : " + line + "名";
    } else if (id === "linep") {
      document.getElementById(id).innerHTML = "一般参加者 : " + line + "名";
    }
  } else {
    if (id === "linef") {
      document.getElementById(id).innerHTML = "進行役 : " + line + "団体（" + line * m + "名）";
    } else if (id === "linep") {
      document.getElementById(id).innerHTML = "一般参加者 : " + line + "団体（" + line * m + "名）";
    }
  }
}

function updateCount() {
  countLine("linef", document.getElementById("facil").value);
  countLine("linep", document.getElementById("player").value);
}

function getTime() {
  // 例) => Wed Feb 16 2017 12:00:00 GMT+0900
  var request = new XMLHttpRequest();
  request.open('HEAD', window.location.href, true);
  request.send();
  request.onreadystatechange = function () {
    if (this.readyState === 4) {
      var serverDate = new Date(request.getResponseHeader('Date'));
      var str = serverDate.toLocaleString();
    }
  }
  console.log(str);
  return str;
}

var charCount = function (str) {
  len = 0;
  str = escape(str);
  for (i = 0; i < str.length; i++ , len++) {
    if (str.charAt(i) == "%") {
      if (str.charAt(++i) == "u") {
        i += 3;
        len++;
      }
      i++;
    }
  }
  return len;
}

function escape_html(string) {
  if (typeof string !== 'string') {
    return string;
  }
  return string.replace(/[&'`"<>]/g, function (match) {
    return {
      '&': '&amp;',
      "'": '&#x27;',
      '`': '&#x60;',
      '"': '&quot;',
      '<': '&lt;',
      '>': '&gt;',
    }[match]
  });
}

function group() {
  var playerArray = new Array();
  var playerNames = document.getElementById("player").value;
  playerNames = playerNames.replace(/[\u200B-\u200D\u2028-\u202E\uFEFF]/g, '');
  playerArray = playerNames.split("\n");
  var n = Number(document.getElementById("groupnum").value);
  var m = 12 / n;
  var p = playerArray.length;
  var str = "";
  var tweet = "＝組分け結果＝%0a";
  var query = "";
  var isRandom = document.getElementById("israndom").checked;

  if (isRandom) {
    shuffle(playerArray);
  }

  if (p === 12) {
    for (var i = 0; i < n; i++) {
      str += "<div id='" + i + "'>\n";
      str += String.fromCharCode(i + 65) + "<br>";
      tweet += String.fromCharCode(i + 65) + ":%20";
      for (var j = 0; j < m; j++) {
        str += escape_html(playerArray[i * m + j]) + "<br>";
        tweet += encodeURIComponent(mb_strimwidth(playerArray[i * m + j], 0, 22, "…"));
        if (j !== m - 1) {
          tweet += ",%20";
        }
        if (j === m - 1) {
          tweet += "%0a";
        }
      }
      str += "\n</div><br>";
    }
    tweet += "模擬組分け機"
    // TODO:
    // console.log(getTime());
    // str += "組分け時刻：" + getTime();

    str += '<a href="https://twitter.com/intent/tweet?text=' + tweet;
    str += '&url=' + location.href + '" onClick="'

    str += "window.open(encodeURI(decodeURI(this.href)), 'tweetwindow', 'width=640, height=320, personalbar=0, toolbar=0, scrollbars=1, sizable=1'); return false;"
    str += '" rel="nofollow" target=”_blank”class="twitter-link">組分け結果をツイート</a>'
  } else if (p > 12) {
    str += "参加者が" + (p - n * m) + "名余っています";
  } else {
    str += "参加者が" + (n * m - p) + "名不足しています";
  }
  document.getElementById("result").innerHTML = str;

}

function grouping() {
  var facilArray = new Array();
  var playerArray = new Array();
  var facilNames = document.getElementById("facil").value;
  facilNames = facilNames.replace(/[\u200B-\u200D\u2028-\u202E\uFEFF]/g, '');
  facilArray = facilNames.split("\n");

  var playerNames = document.getElementById("player").value;
  playerNames = playerNames.replace(/[\u200B-\u200D\u2028-\u202E\uFEFF]/g, '');
  playerArray = playerNames.split("\n");

  var m = Number(document.getElementById("playernum").value) - 1;
  var n = facilArray.length;
  var p = playerArray.length;
  var str = "";

  // console.log(m);
  // console.log(n);
  // console.log(p);

  var isRandom = document.getElementById("israndom").checked;

  if (isRandom) {
    shuffle(playerArray);
    shuffle(facilArray);
  }

  if (n * m === p) {
    for (var i = 0; i < n; i++) {
      str += (i + 1) + "組<br>";
      str += facilArray[i] + "<br>";
      for (var j = 0; j < m; j++)
        str += playerArray[i * m + j] + "<br>"; {
      }
      str += "<br>";
    }

  } else if (n * m < p) {
    if (m === 11) {
      str += "一般参加者が" + (p - n * m) + "名余っています"
    } else {
      str += "一般参加者が" + (p - n * m) + "団体余っています"
    }
  } else {
    if (m === 11) {
      str += "一般参加者が" + (n * m - p) + "名不足しています"
    } else {
      str += "一般参加者が" + (n * m - p) + "団体不足しています"
    }
  }
  document.getElementById("result").innerHTML = str;
}

function shuffle(array) {
  var n = array.length, t, i;

  while (n) {
    i = Math.floor(Math.random() * n--);
    t = array[n];
    array[n] = array[i];
    array[i] = t;
  }

  return array;
}
