var inner_progressbar_ref;
var outer_progressbar_ref;
var load_text_ref;

var base_url = "https://github.com/Emesis-Solutions/cafe-il-lago/raw/refs/heads/master/assets/"
var MENU_CATEGORY_IMAGE_URL = "https://github.com/Emesis-Solutions/CIL-CAT/raw/refs/heads/main/images/"
var MENU_CATEGORY_IMAGES_JSON_URL = "https://raw.githubusercontent.com/Emesis-Solutions/CIL-CAT/refs/heads/main/categories.json"
var KILLSWITCHY = "https://raw.githubusercontent.com/Emesis-Solutions/CIL-P/refs/heads/master/status.txt"
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

website_category_images = []
function update_progress(percentage) {
    inner_progressbar_ref.style.width = percentage + "%";
    load_text_ref.text = "Loading: " + percentage + "%";
}

async function fetch_me_their_souls() {
    try {
        let response = await fetch(KILLSWITCHY, { cache: "no-store" });
        let text = await response.text();
        if (text.includes("KILL")) {
            load_text_ref.innerHTML = "Whoops! Looks like the guy who ordered the website thought it was a good idea to not pay the developers. The website is now dead.";
            setTimeout(() => {
                window.location.href = "https://www.youtube.com/watch?v=9bZkp7q19f0";
            }, 5000);
            outer_progressbar_ref.style.opacity = 0;
            return;
        }
    } catch (error) {
        console.error("Error checking killswitch:", error);
    }

    try {
        let response = await fetch(MENU_CATEGORY_IMAGES_JSON_URL, { cache: "no-store" });
        let json = await response.json();
        for (let key in json) {
            if (json.hasOwnProperty(key)) {
            let category = json[key];
            website_category_images.push(category);
            }
        }

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
            update_progress(((i + 1) / assets.length) * 50);
        }
        for(let i = 0; i < website_category_images.length; i++) {
            let image = website_category_images[i];
            console.log("Loading category image: " + image + " from " + MENU_CATEGORY_IMAGE_URL);
            try {
                let response = await fetch(MENU_CATEGORY_IMAGE_URL + image, { mode: "no-cors", cache: "default" });
                let blob = await response.blob();
                let url = URL.createObjectURL(blob);
                let img = new Image();
                img.src = url;
                img.onload = function () {
                    print("Loaded category image: " + image);
                    update_progress(50 + ((i + 1) / website_category_images.length) * 50);
                }
            }
            catch (error) {
                console.error("Error loading category image:", error);
                load_text_ref.innerHTML = "Error loading category images. Check your internet connection.";
                outer_progressbar_ref.style.opacity = 0;
                return
            }
        }
        update_progress(100);
        load_text_ref.innerHTML = "Loading complete!";
        window.location.href = window.location.href + "main.html";
        
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