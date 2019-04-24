$(function () {
  $("#facil").bcralnit({
    width: '36px',
    background: '#eee',
    textalign: 'right',
    color: '#000',
    addClass: 'areaNum'
  });
  $("#player").bcralnit({
    width: '36px',
    background: '#eee',
    color: '#000',
    addClass: 'areaNum'
  });
});

function extractFacil(){

  var mixedNames = document.getElementById("mixed").value;
  mixedNames = mixedNames.replace(/[\u200B-\u200D\u2028-\u202E\uFEFF]/g, '');
  mixedArray = mixedNames.split("\n");

  facilNames = "";
  playerNames = "";

  for (var i = 0; i < mixedArray.length; i++) {
    var pn = mixedArray[i];
    if (pn.indexOf("★進") != -1) {//進行役っぽいなら
      facilNames += pn + "\n";
    }else{
      playerNames += pn + "\n";
    }
  }
  countLine('linef', facilNames.trim());
  countLine('linep', playerNames.trim());
  document.getElementById("facil").value = facilNames.trim();
  document.getElementById("player").value = playerNames.trim();
  document.querySelector("#facil").dispatchEvent(new Event('click'));

}

function extractDuplicate(array) {
  var players = [];
  var duplicates = [];

  for (var i = 0; i < array.length; i++) {
    var hash = { index: i + 1, name: array[i] };
    players.push(hash);
  }

  console.log(players);

  players.sort(function (a, b) {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });

  var beforeDupl = Boolean(false);
  for (var i = 0; i < players.length - 1; i++) {
    if (players[i].name === players[i + 1].name) {
      if (!beforeDupl) {
        duplicates.push(players[i]);
      }
      duplicates.push(players[i + 1]);
      beforeDupl = true;
    } else {
      beforeDupl = false;
    }
  }

  console.log(duplicates);

  return duplicates;

}


function escapeHtml(string) {
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

  if (id === "linef") {
    if (m === 1) {
      document.getElementById(id).innerHTML = "進行役 : " + line + "名";
    } else {
      // console.log(document.getElementById("playernum").value);
      document.getElementById(id).innerHTML = "進行役 : " + line + "団体（" + line * m + "名）";
    }


  } else if (id === "linep") {
    if (m === 1) {
      document.getElementById(id).innerHTML = "一般参加者 : " + line + "名";
    } else {
      document.getElementById(id).innerHTML = "一般参加者 : " + line + "団体（" + line * m + "名）";
    }
  }

}

function updateCount() {
  countLine("linef", document.getElementById("facil").value);
  countLine("linep", document.getElementById("player").value);
}

function grouping() {

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

  var facilArray = new Array();
  var playerArray = new Array();
  var facilNames = document.getElementById("facil").value;
  facilNames = facilNames.replace(/[\u200B-\u200D\u2028-\u202E\uFEFF]/g, '');
  facilArray = facilNames.split("\n");

  var playerNames = document.getElementById("player").value;
  playerNames = playerNames.replace(/[\u200B-\u200D\u2028-\u202E\uFEFF]/g, '');
  playerArray = playerNames.split("\n");

  var m = Number(document.getElementById("playernum").value) - 1; // 1組あたりに必要な一般参加者数
  var n = facilArray.length; //進行役の人数
  var p = playerArray.length; //一般参加者の人数
  var str = "";

  // console.log(m);
  // console.log(n);
  // console.log(p);
  var concatArray = facilArray.concat(playerArray);
  var duplicates = extractDuplicate(concatArray);
  var d = duplicates.length;
  console.log(duplicates);

  function parsePosition(num) {
    if (num > facilArray.length + 1) {
      return "一般参加者" + (num - facilArray.length) + "行目：";
    } else {
      return "進行役" + (num) + "行目：";
    }
  }

  if (m === -1) {
    str += "<b>形式を選択してください</b>";

  } else if (n * m < p) { //参加者が溢れる or 進行が足りないとき
    var subStr = (m == 11) ? "名" : "団体";
    str += "一般参加者が<b>" + (p - n * m) + subStr + "</b>余っています";
    if ((p % m) == 0) {
      str += "<br>または進行役が<b>" + (p / m - n) + subStr + "</b>不足しています";
    }
  } else if (n * m > p) { //参加者が足りない or 進行が溢れるとき
    var subStr = (m == 11) ? "名" : "団体";
    str += "一般参加者が<b>" + (n * m - p) + subStr + "</b>不足しています";
    if ((p % m) == 0) {
      str += "<br>または進行役が<b>" + (n - p / m) + subStr + "</b>余っています";
    }
  } else {

    if (d > 0) {
      strDupl = "<p><b>※※※重複しています※※※</b><br>";
      for (var i = 0; i < d; i++) {
        strDupl += parsePosition(duplicates[i].index) + duplicates[i].name + "<br>";
      }
      strDupl += "<br></p>"
      str += strDupl;
    }

    shuffle(playerArray);
    shuffle(facilArray);

    for (var i = 0; i < n; i++) {
      str += (i + 1) + "組<br>";
      str += escapeHtml(facilArray[i]) + "<br>";
      for (var j = 0; j < m; j++) {
        str += escapeHtml(playerArray[i * m + j]) + "<br>";
      }
      str += "<br>";
    }
  }

  document.getElementById("result").innerHTML = str;
}
