function easy_debug_print(things_to_print) {
    console.log("Easy debug printer :\n")

    for (i=0; i < things_to_print.length; i++) {
        console.log(i + ". " + things_to_print[i]);
    }
}


function initMap(title, latLng, id) {
    const map = new google.maps.Map(document.getElementById(id), {
      zoom: 17,
      center: latLng
    });
    new google.maps.Marker({
      position: latLng,
      map,
      title: title
    });
  }

function loading(stop=false) {
    let send_btn = document.getElementById("send");

    try {
        if (!stop) {
            send_btn.innerHTML = '<span id="spinner" class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Chargement...'
            send_btn.disabled = true;
        } else {
            spinner = document.getElementById("spinner");
            send_btn.innerHTML = "Envoyer";
            send_btn.removeChild(spinner);
        }
    } catch (error) {
        console.log(error);
    }

    if (stop) { send_btn.disabled = false; }
    
}

function map_already_exist(map_div_id) {
        if (document.getElementById(map_div_id) == null) {
            return false;
        } else {
            return true;
        }
}

function add_msg(string, user_name, map=false) {

    if (string == "") {
        return 0;
    }

    //New list element
    var li = document.createElement("li");
    li.classList.add("d-flex", "mb-4", "mpl-1");

    //Body who contain title and msg
    var chat_body = document.createElement("div");
    chat_body.classList.add("chat-body", "white", "p-3", "z-depth-1", "smooth-border");

    //name container
    var header = document.createElement("div");
    header.classList.add("header");

    //Name
    var name = document.createElement("strong");
    name.classList.add("primary-front");
    name.appendChild(document.createTextNode(user_name));

    header.appendChild(name);

    //Simple CSS separator
    var hr = document.createElement("hr");
    hr.classList.add("w-100");

    //Text msg
    var content = document.createElement("p");
    content.classList.add("mb-0");
    content.id = "last";
    content.appendChild(document.createTextNode(string));

    //Avatar img
    if (user_name=="user") {

        var avatar_src = "https://mdbootstrap.com/img/Photos/Avatars/avatar-5.jpg";
        var avatar = document.createElement("img");
        avatar.src = avatar_src;
        avatar.classList.add("avatar", "rounded-circle", "mr-2", "ml-lg-3", "ml-0", "z-depth-1");
        avatar.alt = "user avatar";

        chat_body.appendChild(header);
        chat_body.appendChild(hr);
        chat_body.appendChild(content);

        li.classList.add("justify-content-end");

        li.appendChild(chat_body);
        li.appendChild(avatar);

    } else if (user_name=="grandpy") {

        var avatar_src = "https://img2.pngio.com/download-free-grandfather-png-file-hd-icon-favicon-freepngimg-grandfather-icon-png-512_512.png";
        var avatar = document.createElement("img");
        avatar.src = avatar_src;
        avatar.classList.add("avatar", "rounded-circle", "mr-2", "ml-lg-3", "ml-0", "z-depth-1");
        avatar.alt = "grandpy avatar";

        li.appendChild(avatar);

        chat_body.appendChild(header);
        chat_body.appendChild(hr);
        chat_body.appendChild(content);

        li.classList.add("justify-content-start", "pb-3");
        li.appendChild(chat_body);

        if (map != false) {

            br = document.createElement("br");

            map_div = document.createElement("div");
            map_div.id = map['id'];
            map_div.classList.add("map", "z-depth-2");
            
            chat_body.appendChild(br);
            chat_body.appendChild(map_div);
        }

    } else {
        console.log("Invalid usage of add_msg.");
        return 0;
    }

    var ul = document.getElementById("msg-list");
    ul.appendChild(li)
    ul.scrollTop = ul.scrollHeight;

    console.log("new msg added")
    return 0;
}

function send_msg() {
    const string = document.getElementById("text_to_send").value;
    loading();
    setTimeout(add_msg, 1, string, "user");
    setTimeout(grandpy_answer, 1000, string, "grandpy");
    setTimeout(loading, 4000, stop=true);
};


function grandpy_answer(string) {
    
    var get_url =  window.location.href + 'api/answer?str=' + string

    console.log(get_url)
    xhr = new XMLHttpRequest();
    var res = NaN
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            //console.log(xhr.responseText);
            parsed = JSON.parse(xhr.responseText);
            API_fails = parsed["API_fails"];
            info = parsed["answer"];
        }
    }
    xhr.open("GET", get_url, false);
    xhr.send();

    console.log(parsed)

    if (API_fails["gmap"]) {

        res = "Mais de quoi parle tu enfin ? Tu te fais vieux !"
        add_msg(res, "grandpy");
        return 0;
    } else {
        place_title = info[0];
        place_address = info[1];
        place_location = info[3];
        div_id = info[4];
        map_data = {title: place_title, location: place_location, id: div_id};
        
        msg = "Mais oui bien sur ! Voila l'addresse :" + place_address;

        check = map_already_exist(div_id);

        if (!check) {
            setTimeout(add_msg, 500, msg, "grandpy", map=map_data);
            setTimeout(initMap, 1000, place_title, place_location, div_id);
        } else {
            msg = "Mais, je viens de t'en parler ! Tu te fais vieux !"
            setTimeout(add_msg, 500, msg, "grandpy");
            return 0;
        }

        if (API_fails['wiki']) {

            msg = "Malheureusement je ne suis jamais alle la bas ...";
            setTimeout(add_msg, 500, msg, "grandpy");
        } else {

        place_history = info[2];
        msg = "Mais connais-tu son histoire ? " + place_history;
        setTimeout(add_msg, 2001, msg, "grandpy");
        }
    } 

}