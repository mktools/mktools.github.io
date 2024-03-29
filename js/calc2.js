//たびたび使うフレコ正規表現
var regexFC = /([（(]?[ 　]*[0-9]{4}[-ｰ－−‐– 　]*[0-9]{4}[-ｰ－−‐– 　]*[0-9]{4}[ 　]*[[）)]?\s*)/g

//個人戦で末尾に登録順がつくときのフレコ正規表現
var regexFCForFFA = /([（(]?[ 　]*[0-9]{4}[-ｰ－−‐– 　]*[0-9]{4}[-ｰ－−‐– 　]*[0-9]{4}[ 　]*[[）)]?\s*)(【[0-9]{1,4}】)?/g

//組分けコピペ欄から名前を切出し・貼り付け
function pasteNames() {
  var n = Number(document.getElementById("playernum").value)
  var m = Number(document.getElementById("membernum").value)

  var nameArray = []
  var allNames = document.getElementById("names").value
  //たまに混入しているゼロ幅文字を消す
  allNames = allNames.replace(/[\u200B-\u200D\u2028-\u202E\uFEFF]/g, "")
  //フレンドコードを区切りとしてプレイヤー名を検出
  if (m === 1) {
    allNames = allNames.replace(regexFCForFFA, "$1$2\n")
  } else {
    allNames = allNames.replace(regexFC, "$1\n")
  }
  //Switch名前欄で表現できない全角英数を半角英数に変換
  allNames = allNames.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
    return String.fromCharCode(s.charCodeAt(0) - 65248)
  })

  allNames = allNames.replace(/\n\n/g, "\n")
  nameArray = allNames.split("\n")

  var playerNames = document.getElementsByName("name")

  for (var i = 0; i < n * m; i++) {
    var pn = nameArray[i]
    if (typeof pn === "undefined" || pn === "") {
      var tempid = ("00" + (i + 1)).slice(-2)
      // 未入力ならCPUで埋める
      playerNames[i].value =
        "CPU" + tempid + "（0000-0000-00" + ("00" + tempid).slice(-2) + "）"
    } else {
      playerNames[i].value = pn.trim()
    }
  }
  getTeamName()
}

//得点コピペ欄から切り出し貼り付け（デバッグ用）
function pastePoints() {
  var pointArray = []
  pointArray = document.getElementById("points").value.split("\n")
  var playerPoints = document.getElementsByName("point")
  var n = Number(document.getElementById("playernum").value)
  var m = Number(document.getElementById("membernum").value)

  for (var i = 0; i < n; i++) {
    var pointArrays = []
    pointArrays = pointArray[i].split(",")
    for (var j = 0; j < m; j++) {
      playerPoints[i * m + j].value = pointArrays[j]
    }
  }
}

//配列を3つのキー順に基づいてソート
//キーの昇順降順は面倒なのでベタ書き（得点と優先：降順，位置：昇順）
function objArraySort(data, key, key2, key3) {
  var num_a = -1
  var num_b = 1

  data = data.sort(function (a, b) {
    if (a[key] > b[key]) {
      return num_a
    } else if (a[key] < b[key]) {
      return num_b
    } else {
      //prefer
      if (a[key2] > b[key2]) {
        return num_a
      } else if (a[key2] < b[key2]) {
        return num_b
      } else {
        //pos
        if (a[key3] < b[key3]) {
          return num_a
        } else if (a[key3] > b[key3]) {
          return num_b
        }
      }
    }
    return 0
  })
}

//得点式を数値に変換
function validatePoint(point) {
  //全角+-を半角にする
  point = point.replace(/([＋])/g, "+")
  point = point.replace(/([ー－])/g, "-")
  //不正な文字を除去
  point = point.replace(/[^0-9+-]/g, "")
  point = point.replace(/[+-]+$/g, "")
  point = point.replace(/([+-])([+-]+)/g, "$1")
  point = Number(eval(point))
  if (isNaN(point)) {
    point = 0
  }
  return point
}

//計算の実行（個人杯用）
//TODO:calc2との統一
function calc1() {
  var playerNames = document.getElementsByName("name")
  var playerPoints = document.getElementsByName("point")
  var isPrefer = document.getElementsByName("drawpasser")
  var n = Number(document.getElementById("playernum").value)

  //優先進出チェック
  var preferArray = []
  var existsPrefer = false
  for (var i = 0; i < n; i++) {
    if (isPrefer[i].checked) {
      preferArray.push(1)
      existsPrefer = true
    } else {
      preferArray.push(0)
    }
  }

  var playersArray = []
  for (var i = 0; i < n; i++) {
    var obj = {}
    obj.point = validatePoint(playerPoints[i].value)
    obj.name = playerNames[i].value
    obj.pos = i
    obj.prefer = preferArray[i]
    playersArray.push(obj)
  }
  objArraySort(playersArray, "point", "prefer", "pos")

  var result = maketable1(playersArray, existsPrefer)
  document.getElementById("result").value = result
}

//出力用文字列の作成（個人杯用）
//TODO:maketable2との統一
function maketable1(data, existsPrefer) {
  var str = ""

  var round = document.getElementById("roundnum").value
  var room = document.getElementById("roomnum").value

  if (round !== "") {
    str += round
  } else {
    str += "※回戦数が選択されていません※" + "\n\n"
  }

  var n = Number(document.getElementById("playernum").value)
  var p = document.getElementById("passernum").value

  if (room !== "" && round !== "決勝") {
    str += room + "組\n"
  } else if (round === "決勝") {
    str += "\n"
    p = 0
  } else {
    str += "※組数が入力されていません※" + "\n\n"
  }

  if (p !== "") {
    p = Number(p)
  }

  if (p === 0 || p === n) {
    for (var i = 0; i < n; i++) {
      str += data[i].point + "pts : " + data[i].name + "\n"
    }
    if (data[0].point === data[1].point) {
      //TODO: 決勝で最高得点者が複数いる場合の文面追加
    }
    if (p === 0) {
      str += "\n優勝\n"
      str += data[0].name + "\n"
    }
  } else if (0 < p && p < n) {
    for (var i = 0; i < p; i++) {
      str += data[i].point + "pts : " + data[i].name + "\n"
    }
    str += "--------------------------------------------\n"
    for (i = p; i < n; i++) {
      str += data[i].point + "pts : " + data[i].name + "\n"
    }

    if (data[p - 1].point === data[p].point) {
      if (existsPrefer) {
        var correctChecked = true

        for (var i = 0; i < p; i++) {
          if (data[i].point === data[p].point && data[i].prefer == false) {
            correctChecked = false
          }
        }
        for (var i = p; i < n; i++) {
          if (data[i].point === data[p].point && data[i].prefer == true) {
            correctChecked = false
          }
        }
        if (correctChecked) {
          str += "\n登録順または進行役補正により "
          for (var i = 0; i < p; i++) {
            if (data[i].point === data[p].point) {
              var dataname = data[i].name.replace(regexFC, "")
              str += dataname + "さん "
            }
          }
          str += "が通過となります\n"
        } else {
          str += "\n※進出可能同点チェックに誤りがあります※\n"
        }
      } else {
        str += "\n※進出可能ラインで同点がいます※\n"
      }
    }

    str += "\n主催コピペ用\n"
    for (var i = 0; i < p; i++) {
      str += data[i].name + "\n"
    }
  } else {
    str += "※通過人数に誤りがあります※\n"
  }

  return str
}

//計算の実行（2v2～6v6用）
function calc2() {
  var teamNames = document.getElementsByName("team")
  var playerNames = document.getElementsByName("name")
  var playerPoints = document.getElementsByName("point")
  var isPrefer = document.getElementsByName("drawpasser")

  var n = Number(document.getElementById("playernum").value)
  var m = Number(document.getElementById("membernum").value)

  // フレンドコードがない場合はダミーを挿入する
  for (var i = 0; i < n * m; i++) {
    if (
      !playerNames[i].value.match(
        /([（(]?[ 　]*[0-9]{4}[-ｰ－−‐– 　]*[0-9]{4}[-ｰ－−‐– 　]*[0-9]{4}[ 　]*[[）)]?\s*)$/
      )
    ) {
      playerNames[i].value = playerNames[i].value + "（0000-0000-0000）"
    }
  }

  var preferArray = []
  var existsPrefer = false

  for (var i = 0; i < n; i++) {
    if (isPrefer[i].checked) {
      preferArray.push(1)
      existsPrefer = true
    } else {
      preferArray.push(0)
    }
  }

  //  teamsArray{
  //    name
  //    point
  //    prefer
  //    pos
  //    players{
  //      point
  //      name
  //    }
  //  }

  var teamsArray = []
  for (var i = 0; i < n; i++) {
    var playersArray = []
    var objs = {}
    objs.point = 0
    objs.pos = i
    for (var j = 0; j < m; j++) {
      var obj = {}
      obj.point = validatePoint(playerPoints[i * m + j].value)
      obj.name = playerNames[i * m + j].value
      playersArray.push(obj)
      objs.point += obj.point
    }
    objs.players = playersArray
    objs.name = teamNames[i].value
    objs.prefer = preferArray[i]
    teamsArray.push(objs)
  }
  objArraySort(teamsArray, "point", "prefer", "pos")
  var result = maketable2(teamsArray, existsPrefer)
  document.getElementById("result").value = result
}

//出力用文字列の作成（2v2～6v6用）
function maketable2(data, existsPrefer) {
  var n = Number(document.getElementById("playernum").value)
  var m = Number(document.getElementById("membernum").value)
  var p = document.getElementById("passernum").value
  var str = ""

  if (m != 6) {
    var round = document.getElementById("roundnum").value
    var room = document.getElementById("roomnum").value

    if (round !== "") {
      str += round
    } else {
      str += "※回戦数が選択されていません※" + "\n\n"
    }

    if (room !== "" && round !== "決勝") {
      str += room + "組\n"
    } else if (round === "決勝") {
      str += "\n"
      p = 0
    } else {
      str += "※組数が入力されていません※" + "\n\n"
    }
  }

  if (p !== "") {
    p = Number(p)
  }

  //6v6のとき
  if (m === 6) {
    for (var i = 0; i < n; i++) {
      var strtmp = ""
      for (var j = 0; j < m; j++) {
        strtmp +=
          data[i].players[j].point + "pts : " + data[i].players[j].name + "\n"
      }
      str += strtmp
      str += data[i].name + " : " + data[i].point + "pts\n\n"
    }
    if (data[p - 1].point === data[p].point) {
      if (existsPrefer) {
        str += "\n最高得点者または進行役補正により "
        for (var i = 0; i < p; i++) {
          if (data[i].point === data[p].point) {
            str += data[i].name + " "
          }
        }
        str += "が通過となります\n"
      } else {
        str += "\n※同点です※\n"
      }
    }
    str += "\n勝利チーム\n"
    str += data[0].name + "\n"

    //6v6以外かつ決勝のとき
  } else if (p === 0) {
    for (var i = 0; i < n; i++) {
      var strtmp = ""
      for (var j = 0; j < m; j++) {
        strtmp +=
          data[i].players[j].point + "pts : " + data[i].players[j].name + "\n"
      }
      str += strtmp
      str += data[i].name + " : " + data[i].point + "pts\n\n"
    }
    if (data[0].point === data[1].point) {
      //TODO: 決勝で最高得点チームが複数いる場合の文面追加
    }

    str += "\n優勝\n"
    var strtmp = ""
    for (var j = 0; j < m; j++) {
      strtmp += data[0].players[j].name
    }
    str += strtmp + "\n"

    //6v6以外かつ決勝以外のとき
  } else if (0 < p && p < n) {
    for (var i = 0; i < p; i++) {
      var strtmp = ""
      for (var j = 0; j < m; j++) {
        strtmp +=
          data[i].players[j].point + "pts : " + data[i].players[j].name + "\n"
      }
      str += strtmp
      str += data[i].name + " : " + data[i].point + "pts\n\n"
    }
    str += "--------------------------------------------\n\n"
    for (i = p; i < n; i++) {
      var strtmp = ""
      for (var j = 0; j < m; j++) {
        strtmp +=
          data[i].players[j].point + "pts : " + data[i].players[j].name + "\n"
      }
      str += strtmp
      str += data[i].name + " : " + data[i].point + "pts\n\n"
    }

    if (data[p - 1].point === data[p].point) {
      if (existsPrefer) {
        var correctChecked = true

        for (var i = 0; i < p; i++) {
          if (data[i].point === data[p].point && data[i].prefer == false) {
            correctChecked = false
          }
        }
        for (var i = p; i < n; i++) {
          if (data[i].point === data[p].point && data[i].prefer == true) {
            correctChecked = false
          }
        }
        if (correctChecked) {
          str += "\n最高得点者または進行役補正により "
          for (var i = 0; i < p; i++) {
            if (data[i].point === data[p].point) {
              str += data[i].name + " "
            }
          }
          str += "が通過となります\n"
        } else {
          str += "\n※進出可能同点チェックに誤りがあります※\n"
        }
      } else {
        str += "\n※進出可能ラインで同点がいます※\n"
      }
    }

    str += "\n主催コピペ用\n"
    for (var i = 0; i < p; i++) {
      var strtmp = ""
      for (var j = 0; j < m; j++) {
        strtmp += data[i].players[j].name
      }
      str += strtmp + "\n"
    }
    //それ以外（通過人数が不適切）
  } else {
    if (m === 1) {
      str += "※通過人数が選択されていません※\n"
    } else {
      str += "※通過チーム数が選択されていません※\n"
    }
  }

  return str
}

// 末尾に識別子をつける変速杯において末尾タグが用いられた場合
// 識別子の「☆」がタグに含まれてしまうのでその応急処置
function forIrr(s) {
  return s.replace(/☆[軽中重A]$/, "")
}

// 文字列からLongest Common Substring（最長共通部分文字列）を抽出する
// コードは以下より引用
// https://github.com/trekhleb/javascript-algorithms/blob/master/src/algorithms/string/longest-common-substring/longestCommonSubstring.js
function LCS(s1, s2) {
  // フレンドコードを削除
  var s1 = s1.replace(regexFC, "")
  var s2 = s2.replace(regexFC, "")

  s1 = forIrr(s1)
  s2 = forIrr(s2)

  // Init the matrix of all substring lengths to use Dynamic Programming approach.
  var substringMatrix = Array(s2.length + 1)
    .fill(null)
    .map(function () {
      return Array(s1.length + 1).fill(null)
    })

  // Fill the first row and first column with zeros to provide initial values.
  for (var columnIndex = 0; columnIndex <= s1.length; columnIndex += 1) {
    substringMatrix[0][columnIndex] = 0
  }

  for (var rowIndex = 0; rowIndex <= s2.length; rowIndex += 1) {
    substringMatrix[rowIndex][0] = 0
  }

  // Build the matrix of all substring lengths to use Dynamic Programming approach.
  var longestSubstringLength = 0
  var longestSubstringColumn = 0
  var longestSubstringRow = 0

  for (var rowIndex = 1; rowIndex <= s2.length; rowIndex += 1) {
    for (var columnIndex = 1; columnIndex <= s1.length; columnIndex += 1) {
      if (s1[columnIndex - 1] === s2[rowIndex - 1]) {
        substringMatrix[rowIndex][columnIndex] =
          substringMatrix[rowIndex - 1][columnIndex - 1] + 1
      } else {
        substringMatrix[rowIndex][columnIndex] = 0
      }

      // Try to find the biggest length of all common substring lengths
      // and to memorize its last character position (indices)
      if (substringMatrix[rowIndex][columnIndex] > longestSubstringLength) {
        longestSubstringLength = substringMatrix[rowIndex][columnIndex]
        longestSubstringColumn = columnIndex
        longestSubstringRow = rowIndex
      }
    }
  }

  if (longestSubstringLength === 0) {
    // Longest common substring has not been found.
    return ""
  }

  // Detect the longest substring from the matrix.
  var longestSubstring = ""

  while (substringMatrix[longestSubstringRow][longestSubstringColumn] > 0) {
    longestSubstring = s1[longestSubstringColumn - 1] + longestSubstring
    longestSubstringRow -= 1
    longestSubstringColumn -= 1
  }

  return longestSubstring
}

//プレイヤー名からチーム名を取得および出力する
function getTeamName() {
  var n = Number(document.getElementById("playernum").value)
  var m = Number(document.getElementById("membernum").value)

  var playerNames = document.getElementsByName("name")
  var teamName = document.getElementsByName("team")
  var teamNameArray = []

  //同チーム全プレイヤー間でLCSを掛けた結果をチーム名とする
  if (m === 2) {
    for (var i = 0; i < n; i++) {
      name = LCS(playerNames[i * 2].value, playerNames[i * 2 + 1].value)
      teamNameArray.push(name)
    }
  } else if (m === 3) {
    for (var i = 0; i < n; i++) {
      name = LCS(playerNames[i * 3].value, playerNames[i * 3 + 1].value)
      name = LCS(name, playerNames[i * 3 + 2].value)
      teamNameArray.push(name)
    }
  } else if (m === 4) {
    for (var i = 0; i < n; i++) {
      name = LCS(playerNames[i * 4].value, playerNames[i * 4 + 1].value)
      name = LCS(name, playerNames[i * 4 + 2].value)
      name = LCS(name, playerNames[i * 4 + 3].value)
      teamNameArray.push(name)
    }
  } else if (m === 6) {
    for (var i = 0; i < n; i++) {
      name = LCS(playerNames[i * 6].value, playerNames[i * 6 + 1].value)
      name = LCS(name, playerNames[i * 6 + 2].value)
      name = LCS(name, playerNames[i * 6 + 3].value)
      name = LCS(name, playerNames[i * 6 + 4].value)
      name = LCS(name, playerNames[i * 6 + 5].value)
      teamNameArray.push(name)
    }
  } else {
    return
  }
  for (var i = 0; i < n; i++) {
    teamName[i].value = teamNameArray[i]
  }
}

//コピー内部処理
function execCopy(string) {
  var temp = document.createElement("div")

  temp.appendChild(document.createElement("pre")).textContent = string

  var s = temp.style
  s.position = "fixed"
  s.left = "-100%"

  document.body.appendChild(temp)
  document.getSelection().selectAllChildren(temp)

  var result = document.execCommand("copy")

  document.body.removeChild(temp)
  // true なら実行できている falseなら失敗か対応していないか
  return result
}

//コピーボタンを押した場合の処理
function copy() {
  if (execCopy(document.getElementById("result").value)) {
    alert("集計結果をコピーしました")
  } else {
    alert("※このブラウザでは対応していません※")
  }
}

//リセットボタンを押した場合の処理
function reset() {
  var isReset = window.confirm("入力欄・集計結果のリセットを行いますか？")
  if (isReset) {
    var playerNames = document.getElementsByName("name")
    var teamNames = document.getElementsByName("team")
    var playerPoints = document.getElementsByName("point")

    for (var i = 0; i < 12; i++) {
      playerNames[i].value = ""
      playerPoints[i].value = ""
    }

    for (var i = 0; i < teamNames.length; i++) {
      teamNames[i].value = ""
    }

    document.getElementById("names").value = ""
    document.getElementById("result").value = ""

    var m = Number(document.getElementById("membernum").value)
    document.getElementById("playernum").value = 12 / m
    document.getElementById("pointsum").value = null
    document.getElementById("roundnum").value = ""
    document.getElementById("roomnum").value = ""
    document.getElementById("passernum").value = ""
  }
}

//合計点欄の計算処理
function calcSum() {
  var pointSum = 0

  var playerPoints = document.getElementsByName("point")
  for (var i = 0; i < 12; i++) {
    pointSum += validatePoint(playerPoints[i].value)
  }
  document.getElementById("pointsum").value = pointSum
}

function setVisibleRoomAndPasser() {
  var round = document.getElementById("roundnum").value
  if (round == "決勝") {
    document.getElementById("passernum").style.display = "none"
    document.getElementById("roomnum").style.display = "none"
    document.getElementById("kumi").style.display = "none"
  } else {
    document.getElementById("passernum").style.display = ""
    document.getElementById("roomnum").style.display = ""
    document.getElementById("kumi").style.display = ""
  }
}

window.onload = function setHandler() {
  var pointlist = document.getElementsByName("point")
  for (var i = 0, len = pointlist.length; i < len; ++i) {
    pointlist[i].addEventListener("keyup", calcSum)
  }
}
