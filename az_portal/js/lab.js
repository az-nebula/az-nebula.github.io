const lab_lineup = document.getElementById("lab-data");
const lab_data = document.querySelectorAll("#lab-log > ul");

//記事のセッティング
for (let i=0; i<lab_data.length; i++) {
    let children = lab_data[i].children;
    const lab_con = lab_lineup.appendChild(document.createElement("tr"));
        const con_name = lab_con.appendChild(document.createElement("th"));
            const anchor = con_name.appendChild(document.createElement("a"));
                anchor.textContent = children[0].innerHTML;
        const con_text = lab_con.appendChild(document.createElement("td"));
            con_text.textContent = children[1].innerHTML;
        const con_date = lab_con.appendChild(document.createElement("td"));
            con_date.textContent = children[3].innerHTML;
            
            if (children[2].innerHTML != "") {
                anchor.href = children[2].innerHTML;
                anchor.target = '_blank';
            } else {
                anchor.classList.add("cut");
                con_text.classList.add("cut");
                con_date.classList.add("cut");
            }      
};

//仮リスト破棄
const lab_list = document.getElementById("lab-log");
lab_list.remove();

