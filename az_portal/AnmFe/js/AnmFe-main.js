
//ウィンドウリロードイベント
window.onload = (e) => {};

//ウィンドウクローズイベント
window.addEventListener('beforeunload', (e) => {
    e.preventDefault();
    e.returnValue = "";
});


//ワークスペースの主要エレメント
/*
row->行数表示
reder->厳密に言えば疑似的レンダーを行う、レンダラーの画面。
cursor->カーソル操作、テキスト操作を行う画面。
具体的にはカーソルエリア(textarea)のテキストデータをvalueで取得し、
一度レンダーエリア(div)でテキストデータからテキストコンテンツに変換。
このテキストコンテンツデータをhtmlで取得し、加工してから再びレンダーエリアに出力している。
※少し回りくどいやり方なのは、テキストデータ変換時のインデント部分を揃えるため。
*/
const row_text = document.getElementById("row-panel");
const render_area = document.getElementById("render-area");
const cursor_area = document.getElementById("cursor-area");

//バンク
let str = "";

//スクロール制御
function scrollTrigger(node) {
    let y = node.scrollTop;
    //console.log(y);
    if (node!='cursor_area') {cursor_area.scrollTo(0,y);};
    if (node!='render_area') {render_area.scrollTo(0,y);};
    row_text.scrollTo(0,y);
};

cursor_area.addEventListener("scroll", () => {
    scrollTrigger(cursor_area);
},true);

render_area.addEventListener("scroll", () => {
    scrollTrigger(render_area);
},true);

//インプット制御
/*
テキストだけでなくカーソル情報も取得するためにインプット部にテキストエリアを採用。
挙動としては
キーダウン -> インプット -> キーアップ
ドラッグ -> インプット -> ドラッグエンド
のはずだが、環境依存込みだと不明
*/
cursor_area.addEventListener("input", () => {
    //console.log("input");
    render_area.style.opacity = '0';
    render_area.innerText = cursor_area.value;
    resizer();
    rowUp();
},true);

function resizer() {
    cursor_area.style.width = render_area.offsetWidth + 'px';
    cursor_area.style.height = render_area.offsetHeight + 'px';
}

//キーダウン&キーアップイベント・上下左右は発火しないようにする
/*
上下左右のリピート(長押し)状態の時だけ発火しない設定も考えたが、
連打でも画面がチラチラしてうざったいのでその入力全般に設定した。
*/
cursor_area.addEventListener("keydown", (e) => {
    //console.log("keydown");
    if (e.key!="ArrowUp" && e.key!="ArrowDown" && e.key!="ArrowLeft" && e.key!="ArrowRight") {
        cursor_area.classList.add("push");
    };
},true);

cursor_area.addEventListener("keyup", (e) => {
    //console.log("keyup");
    if (e.key!="ArrowUp" && e.key!="ArrowDown" && e.key!="ArrowLeft" && e.key!="ArrowRight") {
        /*
        疑似レンダラーに遅延を与え、入力操作が途切れたタイミングで更新させる。
        これで入力時の動作は幾分か軽くなる。
        */
        setTimeout(() => {
            cursor_area.classList.remove("push");
            render_area.style.opacity = '1';
            renderTxt();
            scrollTrigger(cursor_area);
        }, 1000);
    };
},true);

cursor_area.addEventListener("drag", () => {
    //console.log("drag");
    cursor_area.classList.add("push");
},true);

cursor_area.addEventListener("dragend", () => {
    //console.log("dragend");
    cursor_area.classList.remove("push");
    render_area.style.opacity = '1';
    renderTxt();
    scrollTrigger(cursor_area);
},true);

//エディットツール・選択範囲の反転
/*
クリップボードと文字数を利用した制御も考えたが、
ブラウザからクリップボードへのアクセスは拒否される可能性があるので却下。
また入力部分はテキストエリアを採用し、カーソル位置が取得可能になったため
そもそも上記の回りくどいやり方をする必要がない。
*/
function slideData(index) {
    let start = cursor_area.selectionStart;
    let end = cursor_area.selectionEnd;
    str = "";
    if (start!=end) {
        let selector = cursor_area.value;
        let before = selector.substring(0, start);
        let after = selector.substring(end, selector.length);
        block = selector.slice(start, end).split('\n');
        if (index==0) {//上下反転
            for (let lane of block) {
                if (lane==undefined) {lane = "";};
                if (str=="") {str = lane;}
                else {str = lane + '\n' + str;};
            };
        } else if (index==1) {//一番上の行を下に
            for (i=1; i<block.length; i++) {
                if (block[i]==undefined) {block[i] = "";};
                if (str=="") {str = block[i];}
                else {str = str + '\n' + block[i];};
            };
            str = str + '\n' + block[0];
        } else if (index==2) {//一番下の行を上に
            for (i=0; i<block.length-1; i++) {
                if (block[i]==undefined) {block[i] = "";};
                if (str=="") {str = block[i];}
                else {str = str + '\n' + block[i];};
            };
            str = block[block.length-1] + '\n' + str;
        };
        //console.log(str);
        cursor_area.value = before + str + after;
        rowUp();
        renderTxt();
    };
};

//エディットツール・情報確認の切替
const swt_ui = document.getElementById("swt-ui");
const head_ui = document.querySelectorAll("#header-menu > li");
function switchData() {
    swt_ui.classList.toggle("act");
    cursor_area.classList.toggle("slc");
    render_area.classList.toggle("act");
    head_ui[3].classList.toggle("omit");
    head_ui[4].classList.toggle("omit");
    head_ui[5].classList.toggle("omit");
    scrollTrigger(render_area);
    span_title();
};

//エディットツール・インポート
const add_file = document.getElementById("add-file");
function filesAdd() {
    add_file.click(); 
    add_file.value = null;
};

function readFile(input) {
    for (let i=0; i<add_file.files.length; i++) {
        //読み込み
        let file = input.files[i];
        let reader = new FileReader();
        reader.readAsText(file,'Shift_JIS');
        //読み込み結果の格納と表示
        reader.onload = function () {
            document.title = 'anm Editor | ' + file.name.split('.anm')[0];
            cursor_area.value = reader.result;
            rowUp();
            renderTxt();
            resizer();
            span_title();
        };
    };
};

//エディットツール・エクスポート
/*
英数字のみのデータだと、ANSI形式にエンコードされない模様。
エクスポート自体はブラウザの機能を利用しているため、
恐らくブラウザ環境依存の仕様が絡んでいると思われる。
*/
async function writeData() {
    let result = cursor_area.value.split('\n');
    str = "";
    for (let i=0; i<result.length; i++) {
        str = str + result[i];
        if (i!=result.length-1) {str = str + '\r\n';};
    };
    //エンコーダでコンバート
    let text = Encoding.stringToCode(str);
    let convert = Encoding.convert(text, 'sjis', 'unicode');
    let u8a = new Uint8Array(convert);
    let data = new Blob([u8a], {type: 'text/plain'});
    //タイトル取得
    let project_title = document.title.split('anm Editor | ');
    let file_title = 'template';
    if (project_title.length==2) {file_title = project_title[1];};
    //発行
    const Url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = Url;
    link.download = file_title + '.anm';
    link.click();
};

//ロウ(行)の制御
function rowUp() {
    let len = cursor_area.value.split('\n').length;
    str = "";
    for (i=1; i<len; i++) {//10行ごとに黄色、100行ごとに赤色に設定
        if (i%100==0) {str = str + '<span id="cpr">' + i + '</span><br>';}
        else if (i%10==0) {str = str + '<span id="cpy">' + i + '</span><br>';}
        else {str = str + '<span>' + i + '</span><br>';};
    };
    row_text.innerHTML = str + '<span>[EOF]</span>';
};

//タグ操作の制御
function wordConvert(word,convert) {//引数：キーワード,置換ワード
    /*
    インデントはhtmlコンテンツに出力する際に
    省かれてしまうので、スペースはここで纏めてソースコードに変換してしまう作戦。
    ※一応専用コンバーターではなく、引数を扱う方式にした。
    */
    let before_word = str.split(word);
    str = "";
    for (i=0; i<before_word.length; i++) {
        //console.log(word);
        str = str + before_word[i];
        if (i!=before_word.length-1) {str = str + convert;};
    };
};

function tagSet(keyword,node) {//引数：キーワード,付与するクラス
    /*
    splitの性質上、目的のワードをターゲットにワードの前後を抽出する。
    スライス系列と比べた時の挙動の違いは、内部上は別文字として置き換えられる事。
    よって、ボードコピペ等で情報付きテキストを直接貼り付けされた時の挙動は未知数。
    更に設定値入力が人力なので、変換後の設定値にミスがあると当然別の文字になって帰ってくる。
    しかしながら操作の手間が減るので、発動した回数分疑似レンダラーの動作も軽くなる。
    ※入力部はcontenteditableを利用したdivではなく、テキストエリアなので基本的に影響はないと思いたい。
    */
    let result = keyword.split('$');
    if (result.length==3) {
        node =result[0]+'<span class="'+node+'">'+result[1]+'</span>'+result[2];
        keyword = result[0] + result[1] + result[2];
    } else {
        node ='<span class="'+node+'">'+keyword+'</span>';
    };
    let lane = str.split(keyword);
    str = "";
    for (let i=0; i<lane.length; i++) {
        str = str + lane[i];
        if (i!=lane.length-1) {str = str + node;};
    };
};

//ワークスペースの上書き・キーワードリスト
function renderTxt() {
    render_area.innerText = cursor_area.value;
    str = render_area.innerHTML;
    //特殊
    wordConvert(' ','&nbsp;');
    //その他
    tagSet('\"','cpo');
    tagSet('\,','cpg');
    tagSet('\-\-','cpg info comment');
    //テーブル・配列
    tagSet('\#','cpp info shp');
    tagSet('\/$\*$','cpg info pld-ly');
    tagSet('\/$\!$','cpr info abs-ly');
    tagSet('\.$\!$','cpr info abs-ly');
    tagSet('\@','cpg info sct');
    tagSet('\(','cpo');
    tagSet('\)','cpo');
    tagSet('\{','cpb');
    tagSet('\}','cpb');
    tagSet('\[','cpp');
    tagSet('\]','cpp');
    tagSet('$local$&nbsp;','cpb info lcl');
    tagSet('values','cpy info caution');
    //トラックバーオブジェクト
    tagSet('obj.check0','cpu info obj-chk');
    tagSet('obj.track0','cpu info obj-trk');
    tagSet('obj.track1','cpu info obj-trk');
    tagSet('obj.track2','cpu info obj-trk');
    tagSet('obj.track3','cpu info obj-trk');
    tagSet('check0:','cpu info chk');
    tagSet('track0:','cpu info trk');
    tagSet('track1:','cpu info trk');
    tagSet('track2:','cpu info trk');
    tagSet('track3:','cpu info trk');
    tagSet('dialog:','cpu info dl');
    tagSet('file:','cpu info fl');
    tagSet('PSD\:addstate','cpu info psd-ly');
    tagSet('require','cpu');
    //メソッド
    tagSet('function','cpb');
    tagSet('obj.ox','cpa info obj-ox');
    tagSet('obj.oy','cpa info obj-oy');
    tagSet('obj.oz','cpa info obj-oz');
    tagSet('obj.rx','cpa info obj-rx');
    tagSet('obj.ry','cpa info obj-ry');
    tagSet('obj.rz','cpa info obj-rz');
    tagSet('obj.cx','cpa info obj-cx');
    tagSet('obj.cy','cpa info obj-cy');
    tagSet('obj.cz','cpa info obj-cz');
    tagSet('obj.x','cpa info obj-x');
    tagSet('obj.y','cpa info obj-y');
    tagSet('obj.z','cpa info obj-z');
    tagSet('obj.w','cpa info obj-w');
    tagSet('obj.h','cpa info obj-h');
    tagSet('obj.screen_w','cpa info obj-scw');
    tagSet('obj.screen_h','cpa info obj-sch');
    tagSet('obj.framerate','cpa info obj-frr');
    tagSet('obj.totaltime','cpa info obj-ttm');
    tagSet('obj.time','cpa info obj-tm');
    tagSet('obj.totalframe','cpa info obj-tfr');
    tagSet('obj.frame','cpa info obj-fr');
    tagSet('obj.zoom','cpa info obj-zm');
    tagSet('obj.alpha','cpa info obj-alp');
    tagSet('obj.aspect','cpa info obj-asp');
    tagSet('obj.layer','cpa info obj-lyr');
    tagSet('obj.index','cpa info  obj-idx');
    tagSet('obj.num','cpa info obj-num');
    tagSet('obj.mes','cpa info obj-mes');
    tagSet('obj.effect','cpa info obj-eff');
    tagSet('obj.rand','cpa info obj-rnd');
    tagSet('obj.drawpoly','cpa info obj-dwp');
    tagSet('obj.draw','cpa info obj-dw');
    tagSet('obj.setoption','cpa info obj-stp');
    tagSet('obj.load','cpa info obj-ld');
    tagSet('obj.setfont','cpa info obj-stf');
    tagSet('obj.filter','cpa info obj-flt');
    tagSet('obj.setanchor','cpa info obj-anc');
    tagSet('obj.interpolation','cpa info obj-inp');
    tagSet('obj.getaudio','cpa info obj-gau');
    tagSet('obj.getoption','cpa info obj-gtn');
    tagSet('obj.getvalue','cpa info obj-gvl');
    tagSet('obj.getinfo','cpa info obj-gin');
    tagSet('obj.copybuffer','cpa info obj-cbf');
    tagSet('obj.getpixel','cpa info obj-gpx');
    tagSet('obj.putpixel','cpa info obj-ppx');
    tagSet('obj.copypixel','cpa info obj-cpx');
    tagSet('obj.pixeloption','cpa info obj-pxo');
    tagSet('print','cpa info prt');
    tagSet('math.sin','cpa info math-tri');
    tagSet('math.cos','cpa info math-tri');
    tagSet('math.tan','cpa info math-tri');
    tagSet('math.pi','cpa info math-tri');
    tagSet('math.floor','cpa info math-flr');
    tagSet('math.abs','cpa info math-abs');
    tagSet('.Blinker.new','cpa info bk-syn');
    tagSet('.LipSyncSimple.new','cpa info lp-syn');
    tagSet('.LipSyncLab.new','cpa info lp-syn');
    //条件式・繰り返し式
    tagSet('true','cpb info lgc-a');
    tagSet('false','cpb info lgc-a');
    tagSet('&nbsp;$or$','cpp info lgc-b');
    tagSet('&nbsp;$and$','cpp info lgc-b');
    tagSet('&nbsp;$not$','cpp info lgc-b');
    tagSet('nil','cpr info nl');
    tagSet('elseif','cpp info lgc-c');
    tagSet('$if$&nbsp;','cpp info lgc-c');
    tagSet('$else$&nbsp;','cpp info lgc-c');
    tagSet('$else$<br>','cpp info lgc-c');
    tagSet('&nbsp;$then$','cpp info lgc-c');
    tagSet('$end$<br>','cpp info lgc-c');
    tagSet('&nbsp;$end$','cpp info lgc-c');
    tagSet('$for$&nbsp;','cpp info lgc-d');
    tagSet('$while$&nbsp;','cpp info lgc-d');
    tagSet('$repeat$&nbsp;','cpp info lgc-d');
    tagSet('&nbsp;$until$','cpp info lgc-d');
    tagSet('&nbsp;$do$','cpp info lgc-d');
    tagSet('break','cpu info lgc-e');
    tagSet('return','cpu info lgc-e');
    tagSet('continue','cpu info lgc-e');
    render_area.innerHTML = str;
};

function span_title() {
    const info = document.getElementsByClassName("info");
    for (i=0; i<info.length; i++) {
        if (info[i].classList.length>2) {
            //console.log(info[i].classList[2]);
            switch (info[i].classList[2]) {
                case 'caution':
                    info[i].title = '配列の値が上書きされている可能性があることに留意してください';
                    break;
                case 'comment':
                    info[i].title = 'コントロール、又はコメントを意味します';
                    break;
                case 'obj-ox':
                    info[i].title = '基準座標からの相対座標X';
                    break;
                case 'obj-oy':
                    info[i].title = '基準座標からの相対座標Y';
                    break;
                case 'obj-oz':
                    info[i].title = '基準座標からの相対座標Z';
                    break;
                case 'obj-rx':
                    info[i].title = 'X軸回転角度(360.0で一回転)';
                    break;
                case 'obj-ry':
                    info[i].title = 'Y軸回転角度(360.0で一回転)';
                    break;
                case 'obj-rz':
                    info[i].title = 'Z軸回転角度(360.0で一回転)';
                    break;
                case 'obj-cx':
                    info[i].title = '中心の相対座標X';
                    break;
                case 'obj-cy':
                    info[i].title = '中心の相対座標Y';
                    break;
                case 'obj-cz':
                    info[i].title = '中心の相対座標Z';
                    break;
                case 'obj-zm':
                    info[i].title = '拡大率(1.0=等倍)';
                    break;
                case 'obj-alp':
                    info[i].title = '不透明度(0.0～1.0/0.0=透明/1.0=不透明)';
                    break;
                case 'obj-asp':
                    info[i].title = 'アスペクト比(-1.0～1.0/プラス=横縮小/マイナス縦縮小)';
                    break;
                case 'obj-x':
                    info[i].title = '表示基準座標X (ReadOnly)';
                    break;
                case 'obj-y':
                    info[i].title = '表示基準座標Y (ReadOnly)';
                    break;
                case 'obj-z':
                    info[i].title = '表示基準座標Z (ReadOnly)';
                    break;
                case 'obj-w':
                    info[i].title = '画像サイズW (ReadOnly)';
                    break;
                case 'obj-h':
                    info[i].title = '画像サイズH (ReadOnly)';
                    break;
                case 'obj-scw':
                    info[i].title = 'スクリーンサイズW (ReadOnly)';
                    break;
                case 'obj-sch':
                    info[i].title = 'スクリーンサイズH (ReadOnly)';
                    break;
                case 'obj-frr':
                    info[i].title = 'フレームレート (ReadOnly)';
                    break;
                case 'obj-fr':
                    info[i].title = 'オブジェクト基準での現在のフレーム番号 (ReadOnly)';
                    break;
                case 'obj-tm':
                    info[i].title = 'オブジェクト基準での現在の時間(秒) (ReadOnly)';
                case 'obj-tfr':
                    info[i].title = 'オブジェクトの総フレーム数 (ReadOnly)';
                    break;
                case 'obj-ttm':
                    info[i].title = 'オブジェクトの総時間(秒) (ReadOnly)';
                    break;
                case 'obj-lyr':
                    info[i].title = 'オブジェクトが配置されているレイヤー (ReadOnly)';
                    break;
                case 'obj-idx':
                    info[i].title = '複数オブジェクト時の番号 (ReadOnly) ※個別オブジェクト用';
                    break;
                case 'obj-num':
                    info[i].title = '複数オブジェクト時の数(1=単体オブジェクト/0=不定) (ReadOnly)\n※個別オブジェクト';
                    break;
                case 'obj-trk':
                    info[i].title = 'トラックバーの値 (ReadOnly)';
                    break;
                case 'obj-chk':
                    info[i].title = 'チェックボックスの値 (ReadOnly)';
                    break;
                case 'trk':
                    info[i].title = 'トラックバーのUI\n※トラック名、最小値、最大値、初期値、増値';
                    break;
                case 'chk':
                    info[i].title = 'チェックボックスのUI※チェックボックス名、真偽値';
                    break;
                case 'prt':
                    info[i].title = '変数に格納した値、若しくは出力結果の値を表示します';
                    break;
                case 'dl':
                    info[i].title = 'ダイアログの設定です\n※ファイルリーダーとは併用出来ません';
                    break;
                case 'fl':
                    info[i].title = 'ファイルリーダーです\n※ダイアログとは併用出来ません';
                    break;
                case 'shp':
                    info[i].title = 'レイヤー名の重複、若しくは配列の個数を数えます\n※エラーはカウントされません';
                    break;
                case 'lcl':
                    info[i].title = 'ローカルスコープです\n※このセクション内でのみ有効です';
                    break;
                case 'psd-ly':
                    info[i].title = '出力するレイヤーの指示をします\n※第一引数が配列、第二引数が順番です';
                    break;
                case 'math-tri':
                    info[i].title = '三角関数です';
                    break;
                case 'math-flr':
                    info[i].title = '小数点以下を切り捨てます';
                    break;
                case 'math-abs':
                    info[i].title = '絶対値を求めます';
                    break;
                case 'lgc-a':
                    info[i].title = '真偽を表します';
                    break;
                case 'lgc-b':
                    info[i].title = '論理演算子です\n※and or not';
                    break;
                case 'lgc-c':
                    info[i].title = '条件式です\n※if~end、if~then、elseif~then、else~end等';
                    break;
                case 'lgc-d':
                    info[i].title = '繰り返し条件を設定し、繰り返し処理を行います';
                    break;
                case 'lgc-e':
                    info[i].title = '処理を中断、若しくはスキップします\n';
                    break;
                case 'nl':
                    info[i].title = '何も無い状態を意味します\n※エラー要素ですが、使用する場合もあります';
                    break;
                case 'lp-syn':
                    info[i].title = '口パクのオブジェクト設定です';
                    break;
                case 'bk-syn':
                    info[i].title = '目パチのオブジェクト設定です';
                    break;
                case 'pld-ly':
                    info[i].title = 'レイヤーのプルダウン指定です\n※画像ファイル側のレイヤー名も変更する必要があります';
                    break;
                case 'abs-ly':
                    info[i].title = '階層の絶対表示指定です\n※画像ファイル側の階層名も変更する必要があります';
                    break;
                case 'sct':
                    info[i].title = 'セクションの区切りです';
                    break;
                case 'obj-mes':
                    info[i].title = 'テキストオブジェクトで、文字として表示します';
                    break;
                case 'obj-eff':
                    info[i].title = 'フィルタ効果を適用します';
                    break;
                case 'obj-rnd':
                    info[i].title = '乱数を発生させます';
                    break;
                case 'obj-dwp':
                    info[i].title = 'オブジェクトを描画します';
                    break;
                case 'obj-dw':
                    info[i].title = 'オブジェクトの任意の範囲をポリゴン描画します';
                    break;
                case 'obj-stp':
                    info[i].title = '合成モード等、様々なオプションを指定します';
                    break;
                case 'obj-ld':
                    info[i].title = '任意のファイルや図形を読み込みます';
                    break;
                case 'obj-stf':
                    info[i].title = '使用するフォントを設定します';
                    break;
                case 'obj-flt':
                    info[i].title = 'フィルタ効果をスクリーン全体に適用します';
                    break;
                case 'obj-anc':
                    info[i].title = '複数のアンカーポイントを設定し、マウスドラッグで操作できるようにします';
                    break;
                case 'obj-inp':
                    info[i].title = '2点間の座標を曲線的に補間します';
                    break;
                case 'obj-gau':
                    info[i].title = '音声データを取得します';
                    break;
                case 'obj-gtn':
                    info[i].title = 'オブジェクトの区間数など、オブジェクトの各種設定を取得します';
                    break;
                case 'obj-gvl':
                    info[i].title = '設定ダイアログの数値など、オブジェクトの設定値を取得します';
                    break;
                case 'obj-gin':
                    info[i].title = 'スクリプトの各種情報を取得します';
                    break;
                case 'obj-cbf':
                    info[i].title = '画像データのバッファ間コピーを行います';
                    break;
                case 'obj-gpx':
                    info[i].title = 'ピクセルの色など、各種ピクセル情報を取得します';
                    break;
                case 'obj-ppx':
                    info[i].title = 'ピクセル情報を書き換えます';
                    break;
                case 'obj-cpx':
                    info[i].title = 'ピクセル情報をコピーします';
                    break;
                case 'obj-pxo':
                    info[i].title = 'ピクセルの各種オプションを指定をします';
                    break;
                default:
                    info[i].title = '未定義';
            };
        };
    };
};
