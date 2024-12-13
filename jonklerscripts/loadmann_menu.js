window.onload = async () => {
    var json;
    const fetchMenuData = async () => {
        try {
            const response = await fetch("https://raw.githubusercontent.com/Emesis-Solutions/CIL-CAT/refs/heads/main/" + (paramValue === "food" ? "food.json" : "drinks.json"));
            const menuData = await response.json();
            json = menuData;
            console.log(menuData);
        } catch (error) {
            console.error('Error fetching menu data:', error);
        }
    };
    const RS = (length) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    };

    const urlParams = new URLSearchParams(window.location.search);
    const paramValue = urlParams.get('menu'); // Replace 'paramName' with the actual parameter name
    if(paramValue != "food" && paramValue != "drinks") {
        console.error("Invalid menu type, you dumbass.");
        return;
    }
    var switchbuttons = document.getElementsByClassName("switch_menu_btn");
    var opposite = paramValue == "food" ? "Drikke" : "Mad";
    for(var i = 0; i < switchbuttons.length; i++){
        switchbuttons[i].innerText = opposite + " " + switchbuttons[i].innerText;
        switchbuttons[i].onclick = () => {
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.set('menu', paramValue === "food" ? "drinks" : "food");
            window.location.href = newUrl.toString();
        };
    }

    await fetchMenuData();
    var gen = document.getElementsByClassName("category_entry");
    var genElement = gen[0].cloneNode(true);
    genElement.classList.remove('genesis');
    //var firstH1 = genElement.querySelector('h1'); // category title
    var itemElement = genElement.querySelector('label').cloneNode(true); //put it inside .item_entries div
    console.log(itemElement);
    genElement.querySelector('.item_entries').innerHTML = "";

    function createElement(title, price, description) {
        var item = itemElement.cloneNode(true);
        doculabel = RS(10);
        item.htmlFor = doculabel;
        var checkbox = item.querySelector('input');
        checkbox.id = doculabel;
        item.querySelector('h2.title').innerText = title;
        item.querySelector('h2.price').innerText = price;
        item.querySelector('p').innerText = description;
        return item;
    }
    const categories = {};
    let recommended = [];
    recommended = json.filter(item => item.isRecommended);
  

    json.forEach(item => {
        if (!categories[item.category]) {
            categories[item.category] = [];
        }
        categories[item.category].push(item);
    });

    Object.keys(categories).forEach(category => {
        const categoryElement = genElement.cloneNode(true);
        categoryElement.querySelector('h1').innerText = category; 
        const itemEntries = categoryElement.querySelector('.item_entries');
        categories[category].forEach(menuItem => {
            const item = createElement(menuItem.title, menuItem.price, menuItem.description);
            itemEntries.appendChild(item);
        });
        document.getElementsByClassName("category_entries")[0].appendChild(categoryElement);
    });

    var recommendeddiv = document.getElementsByClassName("recommended_items")[0];
    var recommendedul = recommendeddiv.querySelector('ul');
    recommended.forEach(item => {
        const li = document.createElement('li');
        li.innerText = item.title;
        recommendedul.appendChild(li);
    });

}