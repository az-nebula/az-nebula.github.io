let lab;

lab = {
    t:'anmファイル編集ツール β版',
    o:'anmファイル向けのメモ帳です',
    a:'AnmFe/ANMFileEditor.html',
    d:'2024/07/12',
}
nest(lab);

lab = {
    t:'めじろーす様 / さとうささら立ち絵用anm',
    o:'ver.2.2初期状態の専用スクリプトです',
    a:'',
    d:'2024/06/29',
}
nest(lab);


lab = {
    t:'anmファイル合併ツール α版',
    o:'anmファイルを合併します',
    a:'',
    d:'2024/06/21',
}
nest(lab);

//リストの生成
function nest(lab) {
    const lab_log = document.getElementById("lab-log");
    lab_log.innerHTML = lab_log.innerHTML +
        '<ul><li>' + lab.t + '</li>\
        <li>' + lab.o + '</li>\
        <li>' + lab.a + '</li>\
        <li>' + lab.d + '</li></ul>';
};