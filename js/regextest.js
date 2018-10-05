//たびたび使うフレコ正規表現
var regexFC = /([（(][ 　]*[[0-9]{4}[ 　]*[-ｰ－−‐– ][ 　]*[0-9]{4}[ 　]*[-ｰ−－‐– ][ 　]*[0-9]{4}[ 　]*[[）)]\s*)/g;

//組分けコピペ欄から名前を切出し・貼り付け
function regextest() {
    var nameArray = new Array();
    var allNames = document.getElementById("names").value;
    //たまに混入しているゼロ幅文字を消す
    allNames = allNames.replace(/[\u200B-\u200D\u2028-\u202E\uFEFF]/g, '');
    //フレンドコードを区切りとしてプレイヤー名を検出
    allNames = allNames.replace(regexFC, "\n");
    nameArray = allNames.split("\n");

    failedNames = "";

    for (var i = 0; i < nameArray.length; i++) {
        var pn = nameArray[i];
        pn = pn.replace(/★進/g,"");
        //未入力ならPlayer**（0000-0000-00**）で埋める
        if (pn.length > 10) {
            console.log(pn);
            failedNames += pn + "\n";
        }
    }
    document.getElementById("result").value = allNames;
    document.getElementById("result_failed").value = failedNames;
}
