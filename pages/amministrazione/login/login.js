/**
 * Questa funzione viene richiamata dal pulsante di login
 */

const RUOLO_CAMERIERE = 'Cameriere';
const RUOLO_PIZZAIOLO = 'Pizzaiolo';
const RUOLO_MAGAZZINIERE = 'Magazziniere';
const RUOLO_RESPONSABILE = 'Responsabile';
const RUOLO_CAMERIERE_PAGE = '/cameriere/cameriere.html';
const RUOLO_PIZZAIOLO_PAGE = '/pizzaiolo/pizzaiolo.html';
const RUOLO_MAGAZZINIERE_PAGE = '/magazziniere/magazziniere.html';
const RUOLO_RESPONSABILE_PAGE = '/responsabile/responsabile.html';

function login(){
    let nomeUtente = document.getElementById("login_username").value;
    let password = document.getElementById("login_password").value;
    if(nomeUtente.length !== 0 && password.length !== 0){

        xml = document.createElement("root");
        usrXML = document.createElement("username");
        usrXML.setAttribute("value", nomeUtente);
        pswXML = document.createElement("password");
        pswXML.setAttribute("value", password);
        xml.appendChild(usrXML);
        xml.appendChild(pswXML);

        const xhttp = new XMLHttpRequest();

        xhttp.onload = function(){
            var XMLParser = new DOMParser();
            var xmlDoc = XMLParser.parseFromString(xhttp.responseText, "application/xml");
            if(xhttp.status === 401){
                let resp = xmlDoc.childNodes.item(0).attributes[0].value;
                document.getElementById("error_login_log").innerText = resp;
            }else{
                //Ok, ora prendo i dati e il ruolo dell'operatore
                let row = xmlDoc.documentElement    //Prendo il child row
                let nome = row.getElementsByTagName("NOME")[0].textContent;
                let cognome = row.getElementsByTagName("COGNOME")[0].textContent;
                let ruolo = row.getElementsByTagName("RUOLO")[0].childNodes.item(0).textContent;
                let parameters = "nome="+encodeURIComponent(nome)+"&cognome="+encodeURIComponent(cognome)+"&ruolo="+encodeURIComponent(ruolo);
                caricaPaginaByRuolo(ruolo, parameters);
            }
        }
        
        xhttp.open('POST', '../../../scripts/index.php/anagrafica/login', true);
        xhttp.send(new XMLSerializer().serializeToString(xml));
    }
}

function caricaPaginaByRuolo(ruolo, parameters){
    switch (ruolo){
        case RUOLO_CAMERIERE:
            window.location.href = '..'+RUOLO_CAMERIERE_PAGE + '?'+parameters;
        break;
        case RUOLO_MAGAZZINIERE:
            window.location.href = '..'+RUOLO_MAGAZZINIERE_PAGE + '?'+parameters;
        break;
        case RUOLO_PIZZAIOLO:
            window.location.href = '..'+RUOLO_PIZZAIOLO_PAGE + '?'+parameters;
        break;
        case RUOLO_RESPONSABILE:
            window.location.href = '..'+RUOLO_RESPONSABILE_PAGE + '?'+parameters;
        break;
    }
}