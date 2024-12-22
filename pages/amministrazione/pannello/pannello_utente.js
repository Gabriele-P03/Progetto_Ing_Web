const RUOLO_CAMERIERE = 'Cameriere';
const RUOLO_PIZZAIOLO = 'Pizzaiolo';
const RUOLO_MAGAZZINIERE = 'Magazziniere';
const RUOLO_RESPONSABILE = 'Responsabile';
const RUOLO_CAMERIERE_ICONA = '../../../resources/profilazione/cameriere_icona.png';
const RUOLO_PIZZAIOLO_ICONA = '../../../resources/profilazione/pizzaiolo_icona.png';
const RUOLO_MAGAZZINIERE_ICONA = '../../../resources/profilazione/magazziniere_icona.png';
const RUOLO_RESPONSABILE_ICONA = '../../../resources/profilazione/responsabile_icona.png';

//Usato per salvare lo stato di show dei campi per il reset della password
var flagCambiandoPsw = false;

var nome, cognome, ruolo;

window.onload = function(){
    parseInfoProfilo();
    caricaIconaProfiloByRuolo();
}

function caricaIconaProfiloByRuolo(){
    let iconaIMG = document.getElementById("icona_pannello_utente");
    let src = '';
    switch (ruolo){
        case RUOLO_CAMERIERE:
            src = RUOLO_CAMERIERE_ICONA;
        break;
        case RUOLO_MAGAZZINIERE:
            src = RUOLO_MAGAZZINIERE_ICONA;
        break;
        case RUOLO_PIZZAIOLO:
            src = RUOLO_PIZZAIOLO_ICONA;
        break;
        case RUOLO_RESPONSABILE:
            src = RUOLO_RESPONSABILE_ICONA;
        break;                        
    }
    iconaIMG.setAttribute("src", src);
}

function parseInfoProfilo(){
    let url = document.URL;
    let indexQuestionMark = url.indexOf('?');
    if(indexQuestionMark === -1){   //Nessun parametro, vuol dire che la pagina di prenotazione non è stata invocata dal tasto modifica dello storico
        return "";
    }
    url = url.substring(indexQuestionMark+1);
    urls = url.split("&");
    nome = decodeURIComponent(urls[0].split("=")[1]);
    cognome = decodeURIComponent(urls[1].split("=")[1]);
    ruolo = decodeURIComponent(urls[2].split("=")[1]);
    document.getElementById("nome_div_pannello_utente").innerHTML += nome;
    document.getElementById("cognome_div_pannello_utente").innerHTML += cognome;
    document.getElementById("ruolo_div_pannello_utente").innerHTML += ruolo;
}

//Costante HTML da aggiungere quando si clicca sul pulsante 'Cambio Password'
const HTML_MODIFICA_PSW = "" +
"<div id=\"div_campi_psw_reset\">" + 
    "<input class=\"input_psw_reset\" id=\"username_reset_input\" type=\"text\" placeholder=\"Username\">" +
    "<input class=\"input_psw_reset\" id=\"oldpsw_reset_input\" type=\"password\" placeholder=\"Password Vecchia\">" +
    "<input class=\"input_psw_reset\" id=\"newpsw1_reset_input\" type=\"password\" placeholder=\"Password Nuova\">" +
    "<input class=\"input_psw_reset\" id=\"newpsw2_reset_input\" type=\"password\" placeholder=\"Ripeti Password Nuova\">" +
    "<div id=\"div_psw_reset_bt\">" +
        "<button class=\"psw_reset_bt\" type=\"button\" onclick=\"confermaModificaPSW()\">Conferma</button>" +
        "<button class=\"psw_reset_bt\" type=\"button\" onclick=\"annullaModificaPSW()\">Annulla</button>" +
    "</div>" +
"</div>";

/**
 * Questa funzione è richiamata quando si preme sul pulsante per cambiare la password
 * Mostra i quattro campi (username, oldpassword, newpassword, repeatnewpassword) da compilare
 * al fine di modificare la password dell'operatore identificato da username
 * I campi verranno mostrati al di sotto del pulsante
 */
function showCambioPassword(){
    if(!flagCambiandoPsw){
        document.getElementById("pannello_utente").innerHTML += HTML_MODIFICA_PSW;
        flagCambiandoPsw = true;
    }
}

/**
 * Invocato quando si clicca sul pulsante per annullare il reset della password
 * Semplicemente rimuove il div contenente i campi e i due pulsanti di conferma e annulla
 */
function annullaModificaPSW(){
    let div = document.getElementById("div_campi_psw_reset");
    if(div !== undefined)
        div.remove();
    flagCambiandoPsw = false;
}

function confermaModificaPSW(){
    const xhttp = new XMLHttpRequest();
    let xml = document.createElement("root");

    let username = document.getElementById("username_reset_input").value;
    let oldPSW = document.getElementById("oldpsw_reset_input").value;
    let newPSW1 = document.getElementById("newpsw1_reset_input").value;
    let newPSW2 = document.getElementById("newpsw2_reset_input").value;

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

    xhttp.open('PUT', '../../../scripts/index.php/anagrafica/login', true);
    xhttp.send(new XMLSerializer().serializeToString(xml));
}