function initMap(title, latLng, id) {
    // Init a new google map with the latitude and title from server request
    // and add it to the new div.

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
    // Deactivate the sending button. Reactivate when stop=true.

    let send_btn = document.getElementById("send");

    try {
        if (!stop) { 
            //add the MDB spinner effect
            send_btn.innerHTML = '<span id="spinner" class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Chargement...'
            //Disable the button
            send_btn.disabled = true;
        } else {
            //Reverse
            spinner = document.getElementById("spinner");
            send_btn.innerHTML = "Envoyer";
            send_btn.removeChild(spinner);
        }
    } catch (error) {
        console.log(error);
    }

    //Force the reactivation of the button (safe case)
    if (stop) { send_btn.disabled = false; }
    
}

function map_already_exist(map_div_id) {
    // Check if a map already exist with the ID in parameters.

        if (document.getElementById(map_div_id) == null) {
            return false;
        } else {
            return true;
        }
}

function add_msg(string, user_name, map=false) {
    //Add a message to the msg-list. 

    if (string == "") { //safe case
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


    if (user_name=="user") {

        //Avatar
        var avatar_src = "https://mdbootstrap.com/img/Photos/Avatars/avatar-5.jpg";
        var avatar = document.createElement("img");
        avatar.src = avatar_src;
        avatar.classList.add("avatar", "rounded-circle", "mr-2", "ml-lg-3", "ml-0", "z-depth-1");
        avatar.alt = "user avatar";

        // Fill the chat_body
        chat_body.appendChild(header);
        chat_body.appendChild(hr);
        chat_body.appendChild(content);

        // Center the message box to the right
        li.classList.add("justify-content-end");

        //fill the li.
        li.appendChild(chat_body);
        li.appendChild(avatar);

    } else if (user_name=="grandpy") {

        //avatar
        var avatar_src = "https://img2.pngio.com/download-free-grandfather-png-file-hd-icon-favicon-freepngimg-grandfather-icon-png-512_512.png";
        var avatar = document.createElement("img");
        avatar.src = avatar_src;
        avatar.classList.add("avatar", "rounded-circle", "mr-2", "ml-lg-3", "ml-0", "z-depth-1");
        avatar.alt = "grandpy avatar";

        li.appendChild(avatar);

        //Fill the chat_body
        chat_body.appendChild(header);
        chat_body.appendChild(hr);
        chat_body.appendChild(content);

        // Center the message box to the left
        li.classList.add("justify-content-start", "pb-3");
        li.appendChild(chat_body);

        if (map != false) { //in case we need to add a map

            br = document.createElement("br");

            //map
            map_div = document.createElement("div");
            map_div.id = map['id'];
            map_div.classList.add("map", "z-depth-2");
            
            chat_body.appendChild(br);
            chat_body.appendChild(map_div);
        }

    } else { //safe case
        console.log("Invalid usage of add_msg.");
        return 0;
    }

    //Append the msg-list with the msg and auto scroll down.
    var ul = document.getElementById("msg-list");
    ul.appendChild(li)
    ul.scrollTop = ul.scrollHeight;

    console.log("new msg added")
    return 0;
}

function send_msg() {
    // Triggered by the send button

    const string = document.getElementById("text_to_send").value;
    loading();
    setTimeout(add_msg, 1, string, "user");
    setTimeout(grandpy_answer, 1000, string, "grandpy");
    setTimeout(loading, 4000, stop=true);
};


function grandpy_answer(string) {
    // Query the server with the text and reply
    
    //url for flask
    var get_url =  window.location.href + 'api/answer?str=' + string

    console.log(get_url)
    xhr = new XMLHttpRequest(); //request
    var res = NaN
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            //console.log(xhr.responseText);
            parsed = JSON.parse(xhr.responseText);
            API_fails = parsed["API_fails"]; //Case of API reach failed
            info = parsed["answer"]; // response to analyse
        }
    }
    xhr.open("GET", get_url, false);
    xhr.send();

    console.log(parsed)

    if (API_fails["gmap"]) { // in case of the place don't exist

        res = "Mais de quoi parle tu enfin ? Tu te fais vieux !"
        add_msg(res, "grandpy");
        return 0;
    } else {
        place_title = info[0]; // Title
        place_address = info[1]; // Address
        place_location = info[3]; // Lat and lng
        div_id = info[4]; // unique map id 
        map_data = {title: place_title, location: place_location, id: div_id};
        
        msg = "Mais oui bien sur ! Voila l'addresse :" + place_address;

        check = map_already_exist(div_id);

        if (!check) {
            setTimeout(add_msg, 500, msg, "grandpy", map=map_data);
            setTimeout(initMap, 1000, place_title, place_location, div_id);
        } else { // safe case : The user already asked about this place
            msg = "Mais, je viens de t'en parler ! Tu te fais vieux !"
            setTimeout(add_msg, 500, msg, "grandpy");
            return 0;
        }

        if (API_fails['wiki']) { // safe case: mediaWiki failed

            msg = "Malheureusement je ne suis jamais alle la bas ...";
            setTimeout(add_msg, 500, msg, "grandpy");
        } else {

        place_history = info[2]; // MediaWiki description
        msg = "Mais connais-tu son histoire ? " + place_history;
        setTimeout(add_msg, 2001, msg, "grandpy");
        }
    } 

}