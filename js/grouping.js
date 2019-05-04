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

//進行役を抽出する
function extractFacil(){

  //全参加者を取り出す
  var mixedNames = document.getElementById("mixed").value;
  //文字列処理に支障を来たしうるゼロ幅文字を除去
  mixedNames = mixedNames.replace(/[\u200B-\u200D\u2028-\u202E\uFEFF]/g, '');
  mixedArray = mixedNames.split("\n");

  //進行，一般参加者の取り出し結果
  facilNames = "";
  playerNames = "";

  //行に★進を含むなら
  for (var i = 0; i < mixedArray.length; i++) {
    var pn = mixedArray[i];
    if (pn.indexOf("★進") != -1) {
      facilNames += pn + "\n";
    }else{
      playerNames += pn + "\n";
    }
  }
  //末尾の改行を除去しておく
  facilNames = facilNames.trim();
  playerNames = playerNames.trim()

  //textareaに反映
  document.getElementById("facil").value = facilNames;
  document.getElementById("player").value = playerNames;
}

//参加者の重複を検出する
function extractDuplicate(array) {

  //行番号:index と参加者名: name から成るオブジェクト を
  //プレイヤーごとに格納した配列を作成する
  var players = [];
  for (var i = 0; i < array.length; i++) {
    var dict = { index: i + 1, name: array[i] };
    players.push(dict);
  }
 
  // 参加者名が重複するオブジェクトを格納する配列を作成
  var duplicates = [];
  var beforeDupl = Boolean(false);

  //あらかじめ参加者名でソートしておく
  players.sort(function (a, b) {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });
  
  // 参加者名を前後比較し，重複していればオブジェクトごと追加する
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

  return duplicates;
}

//HTML特殊文字をエスケープする()
function escapeHtml(string) {
  //stringでなければ(数値型など)そのまま返す
  if (typeof string !== 'string') {
    return string;
  }
  // 文字列のうち特殊文字はエスケープされたものに置換する
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

//参加者数をカウントする
//進行役，一般参加者それぞれでカウントする
//TODO: idを入力に取るのは密結合っぽいのでリファクタリングする
function countLine(id, str) {
  // str = str.replace(/^\n/g, '');

  //1団体あたりの人数
  var m = 12 / Number(document.getElementById("playernum").value);

  //改行の個数を行数としてカウント
  num = str.match(/\r\n|\n/g);
  if (num !== null) {
    line = num.length + 1;
  } else {
    line = 1;
  }

  //空文字列であった場合は例外処理として0とカウントする
  if (str.length === 0) {
    line = 0;
  }

  //idが進行役であれば進行役のカウントに反映
  if (id === "linef") {
    if (m === 1) {
      document.getElementById(id).innerHTML = "進行役 : " + line + "名";
    } else {
      // console.log(document.getElementById("playernum").value);
      document.getElementById(id).innerHTML = "進行役 : " + line + "団体（" + line * m + "名）";
    }

  //idが一般参加者であれば一般参加者のカウントに反映
  } else if (id === "linep") {
    if (m === 1) {
      document.getElementById(id).innerHTML = "一般参加者 : " + line + "名";
    } else {
      document.getElementById(id).innerHTML = "一般参加者 : " + line + "団体（" + line * m + "名）";
    }
  }

}

//進行役・一般参加者両方にカウンタ更新をかける
function updateCount() {
  countLine("linef", document.getElementById("facil").value);
  countLine("linep", document.getElementById("player").value);
}

//組分けを行う
function grouping() {

  //Fisher–Yatesアルゴリズムで配列シャッフルを行う
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
  var concatArray = facilArray.concat(playerArray); //進行役と一般参加者両方を含んだ全参加者
  var duplicates = extractDuplicate(concatArray); //全参加者から重複を抽出した，(index,name)から成るオブジェクト配列
  var d = duplicates.length;
  // console.log(duplicates);

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

//textareaの更新があるたびにカウンタを更新するためのイベントハンドラ設定
window.addEventListener('load', function setHandler() {
  var execUpdateCount = document.getElementsByName("updater");
  // var execGroupingButton = document.getElementById("execg");
  execUpdateCount.forEach(
    textarea => {
      textarea.addEventListener("change",updateCount)
      textarea.addEventListener("keyup",updateCount)
    }
  );
  // execGroupingButton.addEventListener("click", grouping);
}, false);
