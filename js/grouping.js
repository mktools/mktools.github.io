$(function () {
  $("#host").bcralnit({
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
function extractHost() {

  //全参加者を取り出す
  var mixedNames = document.getElementById("mixed").value;
  //文字列処理に支障を来たしうるゼロ幅文字を除去
  mixedNames = mixedNames.replace(/[\u200B-\u200D\u2028-\u202E\uFEFF]/g, '');
  mixedArray = mixedNames.split("\n");

  //進行，一般参加者の取り出し結果
  hostNames = "";
  nothostNames = "";
  playerNames = "";

  //進行役の上限
  var hostLimit = document.getElementById("rooms").value;
  var hostCount = 0;

  //進行役と一般参加者を分離
  mixedArray.forEach(function (name) {
    if (name.indexOf("進") !== -1) {
      hostCount++;
      //あふれた進行役を分離
      if (hostCount > hostLimit && hostLimit !== 0) {
        nothostNames += name + "\n";
      } else {
        hostNames += name + "\n";
      }
    } else {
      playerNames += name + "\n";
    }
  });

  //あふれた進行役を一般参加者の先頭に追加
  playerNames = nothostNames + playerNames;

  //末尾の改行を除去しておく
  hostNames = hostNames.trim();
  playerNames = playerNames.trim();

  //textareaに反映
  document.getElementById("host").value = hostNames;
  document.getElementById("player").value = playerNames;
}

//非進行役を抽出する
function extractNotHost(hostNames) {
  //行番号:index と参加者名: name から成るオブジェクト を
  //プレイヤーごとに格納した配列を作成する
  var players = hostNames.map(function (playerName, idx) {
    var obj = {
      index: idx + 1,
      name: playerName
    };
    return obj;
  });

  // 進行役でない参加者のオブジェクトを格納する配列を作成
  var notHostPlayers = players.filter(function (player) {
    return player.name.indexOf("進") === -1;
  });

  return notHostPlayers;
}

//参加者の重複を抽出する
function extractDuplicate(playerNames) {
  //行番号:index と参加者名: name から成るオブジェクト を
  //プレイヤーごとに格納した配列を作成する
  var players = playerNames.map(function (playerName, idx) {
    var obj = {
      index: idx + 1,
      name: playerName
    };
    return obj;
  });

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
    } [match];
  });
}

//参加者数をカウントする
//進行役，一般参加者それぞれでカウントする
//TODO: idを入力に取るのは密結合っぽいのでリファクタリングする
function countLine(id, str) {

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
  countLine("linef", document.getElementById("host").value);
  countLine("linep", document.getElementById("player").value);
}

//組分けを行う
function grouping() {

  //Fisher–Yatesアルゴリズムで配列シャッフルを行う
  function shuffle(array) {
    var n = array.length,
      t, i;

    while (n) {
      i = Math.floor(Math.random() * n--);
      t = array[n];
      array[n] = array[i];
      array[i] = t;
    }

    return array;
  }

  var hostArray = [];
  var playerArray = [];

  var hostNames = document.getElementById("host").value;
  hostNames = hostNames.replace(/[\u200B-\u200D\u2028-\u202E\uFEFF]/g, '');
  hostArray = hostNames.split("\n");

  var playerNames = document.getElementById("player").value;
  playerNames = playerNames.replace(/[\u200B-\u200D\u2028-\u202E\uFEFF]/g, '');
  playerArray = playerNames.split("\n");

  var playerNumPerGroup = Number(document.getElementById("playernum").value) - 1; // 1組あたりに必要な一般参加者数
  var hostNum = hostArray.length; //進行役の人数
  var playerNum = playerArray.length; //一般参加者の人数
  var str = "";

  var concatArray = hostArray.concat(playerArray); //進行役と一般参加者両方を含んだ全参加者
  var duplicates = extractDuplicate(concatArray); //全参加者から重複を抽出した，(index,name)から成るオブジェクト配列
  var notHost = extractNotHost(hostArray);
  var nf = notHost.length;
  var d = duplicates.length;

  function parsePosition(num) {
    if (num > hostArray.length + 1) {
      return "一般参加者" + (num - hostArray.length) + "行目：";
    } else {
      return "進行役" + (num) + "行目：";
    }
  }

  // 6v6の場合(1組あたり一般参加者が1のとき)は表示しない
  if (nf > 0 && playerNumPerGroup !== 1) {
    var strHostErr = "<b>※※※進行役欄に一般参加者が含まれています※※※</b><br>";
    for (var i = 0; i < nf; i++) {
      strHostErr += parsePosition(notHost[i].index) + notHost[i].name + "<br>";
    }
    strHostErr += "<br></p>";
    str += strHostErr;
  }

  if (playerNumPerGroup === -1) {
    str += "<b>形式を選択してください</b>";

  } else if (hostNum * playerNumPerGroup < playerNum) { //参加者が溢れる or 進行が足りないとき
    var subStr = (playerNumPerGroup == 11) ? "名" : "団体";
    str += "一般参加者が<b>" + (playerNum - hostNum * playerNumPerGroup) + subStr + "</b>余っています";
    if ((playerNum % playerNumPerGroup) == 0) {
      str += "<br>または進行役が<b>" + (playerNum / playerNumPerGroup - hostNum) + subStr + "</b>不足しています";
    }
  } else if (hostNum * playerNumPerGroup > playerNum) { //参加者が足りない or 進行が溢れるとき
    var subStr = (playerNumPerGroup == 11) ? "名" : "団体";
    str += "一般参加者が<b>" + (hostNum * playerNumPerGroup - playerNum) + subStr + "</b>不足しています";
    if ((playerNum % playerNumPerGroup) == 0) {
      str += "<br>または進行役が<b>" + (hostNum - playerNum / playerNumPerGroup) + subStr + "</b>余っています";
    }
  } else {

    if (d > 0) {
      strDupl = "<p><b>※※※重複しています※※※</b><br>";
      for (var i = 0; i < d; i++) {
        strDupl += parsePosition(duplicates[i].index) + duplicates[i].name + "<br>";
      }
      strDupl += "<br></p>";
      str += strDupl;
    }

    shuffle(playerArray);
    shuffle(hostArray);

    for (var i = 0; i < hostNum; i++) {
      str += (i + 1) + "組<br>";
      str += escapeHtml(hostArray[i]) + "<br>";
      for (var j = 0; j < playerNumPerGroup; j++) {
        str += escapeHtml(playerArray[i * playerNumPerGroup + j]) + "<br>";
      }
      str += "<br>";
    }
  }

  document.getElementById("result").innerHTML = str;
}

//textareaの更新があるたびにカウンタを更新するためのイベントハンドラ設定
window.addEventListener('load', function setHandler() {
  var execUpdateCount = document.getElementsByName("updater");
  execUpdateCount.forEach(
    function (textarea) {
      textarea.addEventListener("change", updateCount);
      textarea.addEventListener("keyup", updateCount);
    }
  );
}, false);