let game;

game = {
    t:'違う冬のぼくら',
    o:'講談社がプレゼンするクリエイターズラボの紹介にてリリースされた<br>\
        二人プレイ専用のパズルアドベンチャー。ところにょり氏制作。<br>\
        「自分の見ている世界は、本当にみんなと同じ世界なのかと<br>\
        考えたことはないでしょうか。」というメッセージともコンセプト<br>\
        ともとれるコメントが記載されている。軽微なグロテスク表現あり。',
    p:'iOS, Android, Steam, Switch'
}
nest(game);

game = {
    t:'Library Of Ruina',
    o:'韓国のインディーゲームスタジオ、Project Moonによって開発された<br>\
        STGゲームです。前作「Lobotomy Corporation」からの続編作品でもあり、<br>\
        好きにデッキやパッシブを組み込んで遊べるのが特徴となります。<br>\
        物語自体は前作を未プレイでも楽しめますが、物語に残虐な表現や、<br>\
        戦闘中も少し血生臭い表現がありますので注意。',
    p:'Xbox One, Xbox Series X/S, Steam, PS4, Switch'
}
nest(game);

game = {
    t:'進め! キノピオ隊長',
    o:'任天堂が開発したパズル要素のある箱庭アドベンチャーゲーム。<br>\
        スーパーマリオ3Dワールドで登場したミニゲーム、キノピオ隊長の冒険<br>\
        を基にめでたく本作で単体のパッケージ化を果たしました。<br>\
        箱庭とはあるが一画面から、広大なステージまで形態は様々。<br>\
        難易度も程々なのでパズルアクション初心者でも楽しめます。',
    p:'Will U, 3DS, Switch'
}
nest(game);

game = {
    t:'Pile Up! Box by Box',
    o:'handy-gamesが開発したパーティー向けパズルアドベンチャーゲーム。<br>\
        4人まで同時にプレイ出来るが、ローカルのみの対応です。<br>\
        パーティープレイを前提としているのか、カメラ操作は出来ない模様。<br>\
        登場するオブジェクトは全て段ボール等の紙類でデザインされており、<br>\
        動きも滑らか。物語・会話は視覚的に分かるように制作されてます。',
    p:'Xbox One, Steam, PS4, Switch'
}
nest(game);

game = {
    t:'FILMECHANISM',
    o:'インディーゲームサークル、Chemical Puddingによって開発された<br>\
        パズルゲーム。主人公のレックはカメラの機能を用いてパズルを解きます。<br>\
        状態を記録するレコードと状態を復元するリストアを上手く使いこなし、<br>\
        ステージを突破していこう。序盤から高難度に挑戦することも出来るので<br>\
        パズルセンスに自身のある方は是非。',
    p:'Steam, Switch'
}
nest(game);

game = {
    t:'QV',
    o:'韓国のインディーゲームスタジオ、izzleによって開発された<br>\
        パズルゲーム。主人公のキュビは次元の歪みを修復するため遺跡を<br>\
        探索する。道中で出会う仲間と共に解くパズルもあります。<br>\
        水の上を走れるインクを用いたり、ポータルにも扉にもなる不思議な遺構<br>\
        を駆使し、遺跡の最深部を目指そう。',
    p:'Steam, Switch'
}
nest(game);

game = {
    t:'さかだちの街',
    o:'インディーゲームチーム、Marudiceによって開発された<br>\
        パズルゲーム。主人公のウララはサカサマ現象の原因を調査するため<br>\
        街中や、工場、果てはリゾートまで探索をします。ストーリー要素があり、<br>\
        配信のガイドライン、及び配信に配慮したゲームモードも実装されています\
        ので、短編実況の予定がある方は是非。<br>',
    p:'Steam, Switch'
}
nest(game);

//リストの生成
function nest(game) {
    const game_log = document.getElementById("works-txt");
    const game_txt = game_log.appendChild(document.createElement("p"));
    game_txt.title = game.t;
    game_txt.innerHTML = game.o + '<hr>' + game.p;
};