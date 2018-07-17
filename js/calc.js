function pasteNames() {
    let nameArray = new Array();
    nameArray = document.getElementById("names").value.split("\n");
    let playerNames = document.getElementsByName("name");
    const n = Number(document.getElementById("playernum").value);
    for (i = 0; i < n; i++) {
        playerNames[i].value = nameArray[i];
    }
}

function pastePoints() {
    let pointArray = new Array();
    pointArray = document.getElementById("points").value.split("\n");
    let playerPoints = document.getElementsByName("point");
    const n = Number(document.getElementById("playernum").value);
    for (i = 0; i < n; i++) {
        playerPoints[i].value = pointArray[i];
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
    const playerNames = document.getElementsByName("name");
    const playerPoints = document.getElementsByName("point");
    const n = Number(document.getElementById("playernum").value);
    let playersArray = new Array();
    for (i = 0; i < n; i++) {
        let obj = new Object();
        obj.point = parseInt(playerPoints[i].value, 10);
        obj.name = playerNames[i].value;
        playersArray.push(obj);
    }
    objArraySort(playersArray, 'point');

    const result = maketable(playersArray);
    document.getElementById("result").value = result;

}

function maketable(data) {
    let str = "";
    const p = Number(document.getElementById("passernum").value);
    const n = Number(document.getElementById("playernum").value);

    if (p == 0) {
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

        if (data[p - 1].point == data[p].point) {
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
        alert('コピーしました');
    } else {
        alert('このブラウザでは対応していません');
    }
}
