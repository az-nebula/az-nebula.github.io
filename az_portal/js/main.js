const head = document.getElementById("header");
const top_btn = document.getElementById("top-btn");
const side = document.getElementById("cast-list");

//UIポジション
window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {head.classList.add("fixed"); top_btn.classList.add("fixed");}
    else {head.classList.remove("fixed"); top_btn.classList.remove("fixed");}
},true);

//トップスクロール
function topScroll(top,left) {
    let x = left || 0;
    let y = top || 0;
    window.scrollTo({top: y, left: x, behavior: "smooth"});
};

//ページ切り替え
function page(e) {
    const section = document.querySelectorAll("section");
    if (section[0].id == e.title) {topScroll(0,0);} else {
        let y = 0;
        for (point of section) {
            if (point.id == e.title) {topScroll(y-48,0);}; y += point.offsetHeight;
        };
    };
};