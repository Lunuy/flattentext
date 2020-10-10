
function makeList(docDatas) { 
    const div = document.createElement("div");
    div.style.backgroundColor = "white";
    div.style.position = "fixed";
    div.style.top = "0px";
    div.style.right = "0px";
    div.style.padding = "10px";

    for(const docData of docDatas) {
        const a = document.createElement("a");
        a.href = "#doc" + docData.numId;
        a.style.display = "block";
        a.appendChild(new Text(docData.info));
        div.appendChild(a);
    }
    return div;
}

const main = document.getElementById("main");
if(window.parent === window) { //현재 창이 최상위 창일 경우
    const docH1 = main.getElementsByTagName("h1")[0];
    (async () => {
        const result = await flattenText.flat(main, {
            createContainer(count) {
                const div = document.createElement("div");
                div.style.borderStyle = "solid";
                div.style.borderWidth = "1px 0 0 0";
                div.style.backgroundColor = "rgba(0, 0, 0, 0.05)"
                return div;
            },
            modifyContainer(container, count) {
                const h1 = container.getElementsByTagName("h1")[0];
                h1.id = `doc${count}`;
            }
        });
        
        const docDatas = result.flat(Infinity);
        docH1.id = `doc${docDatas.length}`;
        const list = makeList([...docDatas, {
            numId: docDatas.length,
            info: docH1.innerText
        }]);
        document.body.appendChild(list);
    })();
}
flattenText.register(() => main, {
    getInfo() {
        return document.title;
    }
});