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

  var m = Number(document.getElementById("playernum").value) - 1;
  var n = facilArray.length;
  var p = playerArray.length;
  var str = "";

  // console.log(m);
  // console.log(n);
  // console.log(p);

  shuffle(playerArray);
  shuffle(facilArray);

  if (n * m === p && m !== -1) {
    for (var i = 0; i < n; i++) {
      str += (i + 1) + "組<br>";
      str += facilArray[i] + "<br>";
      for (var j = 0; j < m; j++) {
        str += playerArray[i * m + j] + "<br>"; 
      }
      str += "<br>";
    }
  } else if (m === -1) {
    str += "<b>形式を選択してください</b>";

  } else if (n * m < p) {
    if (m === 11) {
      str += "一般参加者が<b>" + (p - n * m) + "名</b>余っています"
    } else {
      str += "一般参加者が<b>" + (p - n * m) + "団体</b>余っています"
    }
  } else {
    if (m === 11) {
      str += "一般参加者が<b>" + (n * m - p) + "名</b>不足しています"
    } else {
      str += "一般参加者が<b>" + (n * m - p) + "団体</b>不足しています"
    }
  }
  document.getElementById("result").innerHTML = str;
}
