function pasteNames() {
    var nameArray = new Array();
    var allNames = document.getElementById("names").value;
    //たまに混入しているゼロ幅文字を消す
    allNames = allNames.replace(/[\u200B-\u200D\u2028-\u202E\uFEFF]/g, '');
    var fixedNames = allNames.replace(/([（(][0-9]{4}[-‐–][0-9]{4}[-‐–][0-9]{4}[）)])/g, "$1\n");
    fixedNames = fixedNames.replace(/\n\n/g, "\n");

    // console.log(fixedNames);
    nameArray = fixedNames.split("\n");

    //nameArray = document.getElementById("names").value.split("\n");
    let playerNames = document.getElementsByName("name");
    const n = Number(document.getElementById("playernum").value);
    const m = Number(document.getElementById("membernum").value);

    for (i = 0; i < n * m; i++) {
        playerNames[i].value = nameArray[i];
    }
    getTeamName();
}

function pastePoints() {
    let pointArray = new Array();
    pointArray = document.getElementById("points").value.split("\n");
    let playerPoints = document.getElementsByName("point");
    const n = Number(document.getElementById("playernum").value);
    const m = Number(document.getElementById("membernum").value);

    for (i = 0; i < n; i++) {
        let pointArrays = new Array();
        pointArrays = pointArray[i].split(",");
        for (j = 0; j < m; j++) {
            playerPoints[i * m + j].value = pointArrays[j];
        }
    }
}

function objArraySort(data, key) {
    var num_a = -1;
    var num_b = 1;

    data = data.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        if (x > y) return num_a;
        if (x < y) return num_b;
        return 0;
    });
}

function calc1() {
    var playerNames = document.getElementsByName("name");
    var playerPoints = document.getElementsByName("point");
    var n = Number(document.getElementById("playernum").value);
    var playersArray = new Array();
    for (i = 0; i < n; i++) {
        var obj = new Object();
        obj.point = parseInt(playerPoints[i].value, 10);
        obj.name = playerNames[i].value;
        playersArray.push(obj);
    }
    objArraySort(playersArray, 'point');

    var result = maketable1(playersArray);
    document.getElementById("result").value = result;

}

function maketable1(data) {
    var str = "";
    var p = Number(document.getElementById("passernum").value);
    var n = Number(document.getElementById("playernum").value);

    if (p === 0) {
        for (i = 0; i < n; i++) {
            str += data[i].point + "pts : " + data[i].name + "\n";
        }
        str += "\n優勝\n"
        str += data[0].name + "\n";

    } else if (0 < p && p < n) {

        for (i = 0; i < p; i++) {
            str += data[i].point + "pts : " + data[i].name + "\n";
        }
        str += "--------------------------------------------\n"
        for (i = p; i < n; i++) {
            str += data[i].point + "pts : " + data[i].name + "\n";
        }

        if (data[p - 1].point === data[p].point) {
            str += "\n※進出可能ラインで同点がいます※\n"
        }

        str += "\n主催コピペ用\n"
        for (i = 0; i < p; i++) {
            str += data[i].name + "\n";
        }
    } else {
        str += "エラー : 通過人数がおかしいです\n"
    }

    return str;
}


function calc2() {
    const teamNames = document.getElementsByName("team");
    const playerNames = document.getElementsByName("name");
    const playerPoints = document.getElementsByName("point");
    const n = Number(document.getElementById("playernum").value);
    const m = Number(document.getElementById("membernum").value);

    let teamsArray = new Array();
    for (i = 0; i < n; i++) {
        let playersArray = new Array();
        let objs = new Object();
        objs.point = 0;
        for (j = 0; j < m; j++) {
            let obj = new Object();
            obj.point = parseInt(playerPoints[i * m + j].value, 10);
            objs.point += obj.point;
            obj.name = playerNames[i * m + j].value;
            playersArray.push(obj);
        }
        objs.players = playersArray;
        objs.name = teamNames[i].value;
        teamsArray.push(objs);
    }
    objArraySort(teamsArray, 'point');
    //console.log(teamsArray);
    const result = maketable2(teamsArray);
    document.getElementById("result").value = result;

}

function maketable2(data) {
    let str = "";
    const p = Number(document.getElementById("passernum").value);
    const n = Number(document.getElementById("playernum").value);
    const m = Number(document.getElementById("membernum").value);

    if (p === 0) {
        for (i = 0; i < n; i++) {
            let strtmp = "";
            for (j = 0; j < m; j++) {
                strtmp += data[i].players[j].point + "pts : " + data[i].players[j].name + "\n";
            }
            str += strtmp;
            str += data[i].name + " : " + data[i].point + "pts\n\n";
        }
        str += "\n優勝\n"
        let strtmp = "";
        for (j = 0; j < m; j++) {
            strtmp += data[0].players[j].name;
        }
        str += strtmp + "\n";


    } else if (0 < p && p < n) {

        for (i = 0; i < p; i++) {
            let strtmp = "";
            for (j = 0; j < m; j++) {
                strtmp += data[i].players[j].point + "pts : " + data[i].players[j].name + "\n";
            }
            str += strtmp;
            str += data[i].name + " : " + data[i].point + "pts\n\n";

        }
        str += "--------------------------------------------\n"
        for (i = p; i < n; i++) {
            let strtmp = "";
            for (j = 0; j < m; j++) {
                strtmp += data[i].players[j].point + "pts : " + data[i].players[j].name + "\n";
            }
            str += strtmp;
            str += data[i].name + " : " + data[i].point + "pts\n\n";
        }

        if (data[p - 1].point === data[p].point) {
            str += "\n※進出可能ラインで同点がいます※\n"
        }

        str += "\n主催コピペ用\n"
        for (i = 0; i < p; i++) {
            let strtmp = "";
            for (j = 0; j < m; j++) {
                strtmp += data[i].players[j].name;
            }
            str += strtmp + "\n";
        }
    } else {
        if (m === 1) {
            str += "通過人数がおかしいです\n"
        } else {
            str += "通過チーム数がおかしいです\n"
        }
    }

    return str;
}

// quoted from here:
// https://github.com/trekhleb/javascript-algorithms/blob/master/src/algorithms/string/longest-common-substring/longestCommonSubstring.js
function LCS(s1, s2) {

    // フレンドコードを削除
    s1 = s1.replace(/([（(][0-9]{4}[-‐–][0-9]{4}[-‐–][0-9]{4}[）)])/, "");
    s2 = s2.replace(/([（(][0-9]{4}[-‐–][0-9]{4}[-‐–][0-9]{4}[）)])/, "");

    // Init the matrix of all substring lengths to use Dynamic Programming approach.
    const substringMatrix = Array(s2.length + 1).fill(null).map(() => {
        return Array(s1.length + 1).fill(null);
    });

    // Fill the first row and first column with zeros to provide initial values.
    for (let columnIndex = 0; columnIndex <= s1.length; columnIndex += 1) {
        substringMatrix[0][columnIndex] = 0;
    }

    for (let rowIndex = 0; rowIndex <= s2.length; rowIndex += 1) {
        substringMatrix[rowIndex][0] = 0;
    }

    // Build the matrix of all substring lengths to use Dynamic Programming approach.
    let longestSubstringLength = 0;
    let longestSubstringColumn = 0;
    let longestSubstringRow = 0;

    for (let rowIndex = 1; rowIndex <= s2.length; rowIndex += 1) {
        for (let columnIndex = 1; columnIndex <= s1.length; columnIndex += 1) {
            if (s1[columnIndex - 1] === s2[rowIndex - 1]) {
                substringMatrix[rowIndex][columnIndex] = substringMatrix[rowIndex - 1][columnIndex - 1] + 1;
            } else {
                substringMatrix[rowIndex][columnIndex] = 0;
            }

            // Try to find the biggest length of all common substring lengths
            // and to memorize its last character position (indices)
            if (substringMatrix[rowIndex][columnIndex] > longestSubstringLength) {
                longestSubstringLength = substringMatrix[rowIndex][columnIndex];
                longestSubstringColumn = columnIndex;
                longestSubstringRow = rowIndex;
            }
        }
    }

    if (longestSubstringLength === 0) {
        // Longest common substring has not been found.
        return '';
    }

    // Detect the longest substring from the matrix.
    let longestSubstring = '';

    while (substringMatrix[longestSubstringRow][longestSubstringColumn] > 0) {
        longestSubstring = s1[longestSubstringColumn - 1] + longestSubstring;
        longestSubstringRow -= 1;
        longestSubstringColumn -= 1;
    }

    return longestSubstring;
}

function getTeamName() {
    const n = Number(document.getElementById("playernum").value);
    const m = Number(document.getElementById("membernum").value);

    const playerNames = document.getElementsByName("name");
    let teamName = document.getElementsByName("team");
    let teamNameArray = new Array();
    if (m === 2) {
        for (i = 0; i < n; i++) {
            name = LCS(playerNames[i * 2].value, playerNames[i * 2 + 1].value)
            teamNameArray.push(name);
        }
    } else if (m === 3) {
        for (i = 0; i < n; i++) {
            name = LCS(playerNames[i * 3].value, playerNames[i * 3 + 1].value)
            name = LCS(name, playerNames[i * 3 + 2].value)
            teamNameArray.push(name);
        }
    } else if (m === 4) {
        for (i = 0; i < n; i++) {
            name = LCS(playerNames[i * 4].value, playerNames[i * 4 + 1].value)
            name = LCS(name, playerNames[i * 4 + 2].value)
            name = LCS(name, playerNames[i * 4 + 3].value)
            teamNameArray.push(name);
        }
    } else if (m === 6) {
        for (i = 0; i < n; i++) {
            name = LCS(playerNames[i * 6].value, playerNames[i * 6 + 1].value)
            name = LCS(name, playerNames[i * 6 + 2].value)
            name = LCS(name, playerNames[i * 6 + 3].value)
            name = LCS(name, playerNames[i * 6 + 4].value)
            name = LCS(name, playerNames[i * 6 + 5].value)
        }
    } else {
        return;
    }
    for (i = 0; i < n; i++) {
        teamName[i].value = teamNameArray[i];
    }
}

function execCopy(string) {
    var temp = document.createElement('div');

    temp.appendChild(document.createElement('pre')).textContent = string;

    var s = temp.style;
    s.position = 'fixed';
    s.left = '-100%';

    document.body.appendChild(temp);
    document.getSelection().selectAllChildren(temp);

    var result = document.execCommand('copy');

    document.body.removeChild(temp);
    // true なら実行できている falseなら失敗か対応していないか
    return result;
}

function copy() {
    if (execCopy(document.getElementById("result").value)) {
        alert('集計結果をコピーしました');
    } else {
        alert('このブラウザでは対応していません');
    }
}

function reset() {
    var playerNames = document.getElementsByName("name");
    var teamNames = document.getElementsByName("team");
    var playerPoints = document.getElementsByName("point");

    for (i = 0; i < 12; i++) {
        playerNames[i].value = "";
        playerPoints[i].value = "";
    }

    for (i = 0; i < teamNames.length; i++) {
        teamNames[i].value = "";
    }

    document.getElementById("names").value = "";
    document.getElementById("result").value = "";
}
