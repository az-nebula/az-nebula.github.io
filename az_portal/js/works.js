const mov_lineup = document.getElementById("mov-lineup");
const mov_data = document.querySelectorAll("#works-log > ul");

//動画のセッティング
for (let i=0; i<mov_data.length; i++) {
    let children = mov_data[i].children;
    const container_wrap = mov_lineup.appendChild(document.createElement("span"));
    container_wrap.className = 'mov-con-wrap';

        const container = container_wrap.appendChild(document.createElement("div"));
        container.className = 'mov-con';
        container.title = children[0].innerHTML;
        if (i == 0) {container.classList.add("new");};

            const thm_wrap = container.appendChild(document.createElement("div"));

                const img_wrap = thm_wrap.appendChild(document.createElement("div"));
                    //サムネイル引用
                    const thumbnail = img_wrap.appendChild(document.createElement("img"));
                    const video_id = children[2].innerHTML.split("\/")[3];
                    thumbnail.src = 'https://img.youtube.com/vi_webp/'+video_id+'/mqdefault.webp';

            const text_wrap = container.appendChild(document.createElement("p"));

                const mov_name = text_wrap.appendChild(document.createElement("h2"));
                mov_name.innerHTML = children[0].innerHTML;

                text_wrap.appendChild(document.createElement("hr"));

                const word = text_wrap.appendChild(document.createElement("span"));

                    const pop_y = word.appendChild(document.createElement("a"));
                    pop_y.href = children[2].innerHTML;
                    pop_y.target = '_blank';
                    pop_y.title = 'YouTubeで視聴する';
                    const txt_y = pop_y.appendChild(document.createElement("div"));
                    txt_y.innerHTML = '▶';
                    txt_y.className = 'tube';

                    const pop_n = word.appendChild(document.createElement("a"));
                    pop_n.href = children[3].innerHTML;
                    pop_n.target = '_blank';
                    pop_n.title = 'ニコニコ動画で視聴する';
                    const txt_n = pop_n.appendChild(document.createElement("div"));
                    txt_n.innerHTML = '▲';
                    txt_n.className = 'nico';

                    const char = word.appendChild(document.createElement("ul"));
                    let cast = children[1].innerHTML.split("\,") || children[1].innerHTML;
                    for (let name of cast) {
                        const tag = char.appendChild(document.createElement("li"));
                        tag.innerHTML = '<a title="'+name+'" onclick="castTag(this)">#'+name+'</a>';
                    }

                    const list = document.querySelectorAll(".mov-con span > a");
                    let def = window.location.href;
                    for (let anchor of list) {
                        if (anchor.href == (def.split("\#")[0] || def)) {anchor.style.display = 'none';}
                    }
};

//仮リスト破棄
const works_list = document.getElementById("works-log");
works_list.remove();

//UIポジション
window.addEventListener("scroll", () => {
    if (window.scrollY < document.querySelectorAll("section")[0].offsetHeight-window.innerHeight*0.6) {side.classList.add("fixed");}
    else {side.classList.remove("fixed");}
},true);

const num = document.querySelector("#works > #title > h1");
//動画の表示
function movHide(logic) {
    const link_parent = document.querySelectorAll(".mov-con");
        for (let link of link_parent) {
            if (logic == true) {
                let bank = [link.children[0].href,link.children[1].title];
                link.children[0].href = bank[1];
                link.children[1].title = bank[0];
            }
            let def = window.location.href;
            if (link.children[0].href == (def.split("\#")[0] || def)) {
                link.children[0].closest(".mov-con-wrap").classList.add("filter");
            }
        };
};


//タグ検索機能
function castTag(e) {
    //キャストフィルター
    const mov_list = document.querySelectorAll(".mov-con-wrap");
    const tag_list = document.querySelectorAll(".mov-con > p li a");

    for (let mov of mov_list) {mov.classList.remove("filter");};
    for (let tag of tag_list) {tag.classList.remove("act");};
    if (num.innerHTML.split("の動画")[0] != e.title) {
        for (let mov of mov_list) {mov.classList.add("filter");};
        for (let tag of tag_list) {
            if (tag.title == e.title) {tag.classList.add("act");}
            if (tag.className == 'act') {tag.closest(".mov-con-wrap").classList.remove("filter");}
        };
        const news = document.querySelectorAll(".mov-con");
        if (news[0].className == 'mov-con new') {reCon();}
        //動画件数の表示
        movListup(e.title);
        if (document.querySelectorAll(".act").length==0) {movListup();};
    } else {movListup(); reCon();}
    gameTxt(e);
    topScroll(0,0);
};

//ゲームテキスト
function gameTxt(info) {
    const game_text = document.querySelectorAll("#works-txt > p");
    const game_def = document.querySelector("#works-txt > .def");
    for (let i=0; i<game_text.length; i++) {
        if (info != undefined && game_text[i].title == info.innerHTML.substring(1)) {
            game_text[i].closest("#works-txt").insertBefore(game_text[i],game_text[0]);
        } else {
            game_text[i].closest("#works-txt").insertBefore(game_def,game_text[0]);
        }
    };
}


//動画件数の表示
function movListup(cast) {
    const mov_all = document.querySelectorAll(".mov-con-wrap");
    const mov_dis = document.querySelectorAll(".filter");
    let app = mov_all.length-mov_dis.length;
    //console.log(mov_all.length,mov_dis.length,app)
    if (cast == undefined) {num.innerHTML = "全ての動画&nbsp;"+app+"件";}
    else {num.innerHTML = cast + "の動画&nbsp;"+app+"件";}
}

//ソート機能
function reCon() {
    for (let i=1; i<mov_lineup.children.length; i++) {
        mov_lineup.insertBefore(mov_lineup.children[i],mov_lineup.children[0]);
    };
};