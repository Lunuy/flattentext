
function makeIframe(url : string) : Promise<HTMLIFrameElement> {
    return new Promise(solve => {
        const iframe = document.createElement("iframe");
        iframe.src = url;
        iframe.addEventListener("load", e => {
            solve(iframe);
        });

        //
        iframe.style.visibility = "hidden";
        iframe.style.position = "absolute";
        iframe.style.width = "0";
        iframe.style.height = "0";
        document.body.appendChild(iframe);
    });
}

export default makeIframe;