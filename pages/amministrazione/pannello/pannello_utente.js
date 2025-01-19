window.addEventListener('load', function(){
        document.getElementById("bt_show_cambio_psw").addEventListener("click", showCambioPassword, false);
        document.getElementById("bt_logout").addEventListener("click", logout, false);

        document.getElementById("icona_pannello_utente").addEventListener('load', setMaxSizeByIMGAndDevice, false);
    }, false);

window.addEventListener('resize', setMaxSizeByIMGAndDevice, false);

function setMaxSizeByIMGAndDevice(){
    let aside = document.getElementsByTagName("aside")[0];
    let img = document.getElementById("icona_pannello_utente");
    if(window.outerWidth > 600){
        aside.style.maxWidth = (img.clientWidth+8)+'px';
        aside.style.maxHeight = '';
    }else{
        aside.style.maxWidth = '';
        aside.style.maxHeight = (img.clientHeight+8)+'px';
    }
}


//Usato per salvare lo stato di show dei campi per il reset della password
var flagCambiandoPsw = false;

//Costante HTML da aggiungere quando si clicca sul pulsante 'Cambio Password'
const HTML_MODIFICA_PSW = "" +
    "<div id=\"div_input_psw_reset\">" +
        "<input class=\"input_psw_reset\" id=\"username_reset_input\" type=\"text\" placeholder=\"Username\">" +
        "<input class=\"input_psw_reset\" id=\"oldpsw_reset_input\" type=\"password\" placeholder=\"Password Vecchia\">" +
        "<input class=\"input_psw_reset\" id=\"newpsw1_reset_input\" type=\"password\" placeholder=\"Password Nuova\">" +
        "<input class=\"input_psw_reset\" id=\"newpsw2_reset_input\" type=\"password\" placeholder=\"Ripeti Password Nuova\">" +
    "</div>" +
    "<div id=\"div_psw_reset_bt\">" +
        "<button id=\"bt_conferma_cambio_psw\" class=\"psw_reset_bt\" type=\"button\">Conferma</button>" +
        "<button id=\"bt_annulla_cambio_psw\" class=\"psw_reset_bt\" type=\"button\">Annulla</button>" +
    "</div>";

/**
 * Questa funzione è richiamata quando si preme sul pulsante per cambiare la password
 * Mostra i quattro campi (username, oldpassword, newpassword, repeatnewpassword) da compilare
 * al fine di modificare la password dell'operatore identificato da username
 * I campi verranno mostrati al di sotto del pulsante
 */
function showCambioPassword(){
    if(!flagCambiandoPsw){
        let div = document.getElementById("div_campi_psw_reset");
        div.innerHTML = HTML_MODIFICA_PSW;
        flagCambiandoPsw = true;

        document.getElementById("bt_conferma_cambio_psw").addEventListener('click', confermaModificaPSW, false);
        document.getElementById("bt_annulla_cambio_psw").addEventListener('click', annullaModificaPSW, false);
    }
}

/**
 * Invocato quando si clicca sul pulsante per annullare il reset della password
 * Semplicemente rimuove il div contenente i campi e i due pulsanti di conferma e annulla
 */
function annullaModificaPSW(){
    document.getElementById("bt_conferma_cambio_psw").removeEventListener('click', confermaModificaPSW, false);
    document.getElementById("bt_annulla_cambio_psw").removeEventListener('click', annullaModificaPSW, false);
    let div = document.getElementById("div_campi_psw_reset");
    if(div !== undefined)
        div.innerHTML = "";
    flagCambiandoPsw = false;

}

function confermaModificaPSW(){
    const xhttp = new XMLHttpRequest();
    let xml = document.createElement("root");

    let username = document.getElementById("username_reset_input").value;
    let oldPSW = document.getElementById("oldpsw_reset_input").value;
    let newPSW1 = document.getElementById("newpsw1_reset_input").value;
    let newPSW2 = document.getElementById("newpsw2_reset_input").value;
    if(username.length <= 0){
        alert("Il campo Username è vuoto");
        return;
    }
    if(oldPSW.length <= 0){
        alert("Il campo Vecchia Password è vuoto");
        return;
    }
    if(newPSW1.length <= 0){
        alert("Il campo Nuova Password è vuoto");
        return;
    }
    if(newPSW2.length <= 0){
        alert("Il campo Ripeti Nuova Password è vuoto");
        return;
    }
    if(newPSW1 != newPSW2){
        alert("Le due nuove password non corrispondono");
        return;
    }

    let usernameXML = document.createElement('username');
    usernameXML.setAttribute('value', username);
    xml.appendChild(usernameXML);

    let oldpasswordXML = document.createElement('password');
    oldpasswordXML.setAttribute('value', oldPSW);
    xml.appendChild(oldpasswordXML);

    let newpsw1XML = document.createElement('newpsw1');
    newpsw1XML.setAttribute('value', newPSW1);
    xml.appendChild(newpsw1XML);

    let newpsw2XML = document.createElement('newpsw2');
    newpsw2XML.setAttribute('value', newPSW2);
    xml.appendChild(newpsw2XML);

    xhttp.onload = function(){
        if(xhttp.status !== 200){
            var XMLParser = new DOMParser();
            var xmlDoc = XMLParser.parseFromString(xhttp.responseText, "application/xml");
            alert(xmlDoc.childNodes.item(0).getAttribute("value"));
        }else{
            logout();
        }
    }

    xhttp.open('PUT', '../../../scripts/index.php/anagrafica/login', true);
    xhttp.setRequestHeader('Authorization', sessionStorage.getItem('id'));
    xhttp.send(new XMLSerializer().serializeToString(xml));
}

function logout(){
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function(){
        if(xhttp.status === 200){
            sessionStorage.removeItem("id");
            window.location.href = "/pages/amministrazione/login/login.html";
        }else{
            var XMLParser = new DOMParser();
            var xmlDoc = XMLParser.parseFromString(xhttp.responseText, "application/xml");
            alert(xmlDoc.childNodes.item(0).getAttribute("value"));
        }
    }
    xhttp.open('GET', '/../../../scripts/index.php/anagrafica/logout', true);
    xhttp.setRequestHeader("Authorization", sessionStorage.getItem("id"));
    xhttp.send();
}