var inner_progressbar_ref;
var outer_progressbar_ref;
var load_text_ref;

var base_url = "https://github.com/Emesis-Solutions/cafe-il-lago/raw/refs/heads/master/assets/"

assets = [
    "animated.webp",
    "aryan.png",
    "bigaryan.png",
    "chef_1.png",
    "IstokWeb-Bold.ttf",
    "IstokWeb-Regular.ttf",
    "IstokWeb-Italic.ttf",
    "IstokWeb-Regular.ttf",
    "suthelvasi.webp"
]
function update_progress(percentage) {
    inner_progressbar_ref.style.width = percentage + "%";
    load_text_ref.text = "Loading: " + percentage + "%";
}

async function fetch_me_their_souls() {
    try {

        for (let i = 0; i < assets.length; i++) {
            let asset = assets[i];
            console.log("Loading asset: " + asset + " from " + base_url);
            let response = await fetch(base_url + asset, { mode: "no-cors", cache: "default" });
            let blob = await response.blob();
            let url = URL.createObjectURL(blob);
            if (asset.endsWith('.png') || asset.endsWith('.webp')) {
                let img = new Image();
                img.src = url;
                img.onload = function () {
                    update_progress(((i + 1) / assets.length) * 100);
                }
            } else if (asset.endsWith('.ttf')) {
                let font = new FontFace(asset, `url(${url})`);
                font.load().then(function (loadedFont) {
                    document.fonts.add(loadedFont);
                    update_progress(((i + 1) / assets.length) * 100);
                }).catch(function (error) {
                    console.error("Error loading font:", error);
                });
            }
            update_progress(((i + 1) / assets.length) * 100);
        }
        load_text_ref.innerHTML = "Loading complete!";
        window.location.href = window.location.href + "menu.html";
        
    } catch (error) {
        console.error("Error loading assets:", error);
        load_text_ref.innerHTML = "Error loading assets. Check your internet connection.";
        outer_progressbar_ref.style.opacity = 0;
    }
}
function initial() {
    load_text_ref = document.getElementById("load_status_text");
    inner_progressbar_ref = document.getElementsByClassName("loading_bar_inner")[0];
    outer_progressbar_ref = document.getElementsByClassName("loading_bar")[0];
    //base_url = window.location.href;
    load_text_ref.innerHTML = "Loading, please wait...";
    fetch_me_their_souls();
}

initial();