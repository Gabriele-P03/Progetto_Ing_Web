const RUOLO_CAMERIERE = 'Cameriere';
const RUOLO_PIZZAIOLO = 'Pizzaiolo';
const RUOLO_MAGAZZINIERE = 'Magazziniere';
const RUOLO_RESPONSABILE = 'Responsabile';
const RUOLO_CAMERIERE_ICONA = '../../../resources/profilazione/cameriere_icona.png';
const RUOLO_PIZZAIOLO_ICONA = '../../../resources/profilazione/pizzaiolo_icona.png';
const RUOLO_MAGAZZINIERE_ICONA = '../../../resources/profilazione/magazziniere_icona.png';
const RUOLO_RESPONSABILE_ICONA = '../../../resources/profilazione/responsabile_icona.png';

var nome, cognome, ruolo = 'Pizzaiolo';

window.onload = function(){
    parseInfoProfilo();
    caricaIconaProfiloByRuolo();
    caricaPizze();
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


/**
 * Richiamta quando si cambia la data al date-picker
 * Esegue la get delle prenotazioni per quella data e inserisce i dati nella tabella
 */
function caricaPrenotazioni(input){
    let date = input.value;
    let body = document.getElementById("tbody_prenotazioni");
    if(date !== null){
        const xhttp = new XMLHttpRequest();
        xhttp.onload = function(){
            const XMLParser = new DOMParser();
            xmlDoc = XMLParser.parseFromString(xhttp.responseText, 'application/xml');
            xmlDoc.childNodes.item(0).childNodes.forEach(row => {
                let hash = row.childNodes.item(0).textContent;
                let nome = row.childNodes.item(1).textContent;
                let asporto = row.childNodes.item(7).textContent;

                let tr = "<tr class=\"tr_body\">"
                tr += "<td class=\"td_tbody\">"+nome+"</td>";
                tr += "<td class=\"td_tbody\">"+(asporto === '1' ? 'Sì' : 'No')+"</td>";
                tr += "<td class=\"td_tbody\"><button type=\"button\" value=\""+hash+"\">Visualizza</button></td>";
                tr += "</tr>";
                body.innerHTML += tr;
            });
            allineaTabella();
        }
        xhttp.open('GET', '../../../scripts/index.php/prenotazione/all?date='+encodeURIComponent(date) + '&asporto=1', true);
        xhttp.send();
    }
}

/**
 * Per abilitare lo scroll al tbody, ho dovuto configurare il diplay block ma ciò causa la
 * perdita dell'allineamento tra i th e i td.
 * Solo tramite JS si può rimediare completamente
 */
function allineaTabella(){
    let theadH = document.getElementById("thead_prenotazioni").clientHeight;
    let h = parseInt(theadH)+8; //Aggiungo i 4px superiori e inferiori del bordo della tabella
    h = 'calc(100% - '+h+'px)';
    document.getElementById("tbody_prenotazioni").style.maxHeight = h;

    let tableTHeadTHs = document.getElementById("tr_thead_prenotazioni").querySelectorAll("th");
    let tableTBodyTDs = document.getElementsByClassName("tr_body");

    //Essendo la table inline-block prima calcolo h e w per ogni colonna
    //Scorrere in modo ricorsivo tutte le celle di una colonna ogni volta che viene trovato h o w maggiore del valore in uso
    //sarebbe stato troppo dispendioso; si preferisce dunque trovare prima i due valori adatti 
    for(let i = 0; i < tableTHeadTHs.length; i++){
        //Inizializzo sempre w al valore della cella di testata
        let w = tableTHeadTHs[i].clientWidth;
        //Scorro la colonna i-esima alla ricerca di aventuali h o w maggiori 
        for(let j = 0; j < tableTBodyTDs.length; j++){
            let cell = tableTBodyTDs[j].childNodes.item(i);
            if(cell.clientWidth > w){
                w = cell.clientWidth;
            }
        }

        //ora che ho trovato i valore giusto di w, lo setto su tutta la colonna i-esima (testata compresa)
        tableTHeadTHs[i].style.width = w + 'px';
        if(i > 0){
            tableTHeadTHs[i].style.marginLeft = '2px';
        }

        w = (parseInt(w)+4); //Aggiungo 2px per bordo della cella di testata
        for(let j = 0; j < tableTBodyTDs.length; j++){
            let cell = tableTBodyTDs[j].childNodes.item(i);
            cell.style.width = w + 'px';
        }
    }
}

/**
 * Funzione per mostrare il popup degli ingredienti
 */
function mostraPopupIngredienti(input, allowSave){
    let hash = input.value;

    const xhttp = new XMLHttpRequest();
    xhttp.onload = function(){
        let div = "<div id=\"div_popup_ingredienti\"><div id=\"div_ingredienti_checkbox\">";
        
        const XMLParser = new DOMParser();
        let xmlDoc = XMLParser.parseFromString(xhttp.responseText, 'application/xml');
        xmlDoc.childNodes.item(0).childNodes.forEach(row => {
            let hash1 = row.childNodes.item(1).textContent;
            let nome1 = row.childNodes.item(0).textContent;

            let checkboxHTML = "<div class=\"div_ingrediente_popup\"><input type=\"checkbox\" value=\""+hash1+"\" name=\""+hash1+"\"><label for=\""+hash1+"\">"+nome1+"</label></div>"
            div += checkboxHTML;
        });

        div += "</div>";
        if(allowSave){
            div += "<div id=\"div_button_ingredienti\"><button id=\"button_save_ingredienti\" type=\"button\">Salva</button></div>";
        }
        div += "</div>";

        let body = document.getElementById("body");
        body.innerHTML += div;
        document.addEventListener('click', clickClosePopup, false);
        spuntaIngredienti(hash);
        
        //Ora creo il listener per chiudere il popup
    }
    xhttp.open('GET', '/../../../scripts/index.php/aggiunta/all?pizza=true', true);
    xhttp.send();
}

function spuntaIngredienti(hashPizza){
    const xhttp = new XMLHttpRequest();
    //tutte le checkbox del popup, il value corrisponde all'hash dell'aggiunta
    let checkboxes = document.getElementById("div_ingredienti_checkbox").querySelectorAll("input");
    xhttp.onload = function(){
        const XMLParser = new DOMParser();
        let xmlDoc = XMLParser.parseFromString(xhttp.responseText, 'application/xml');
        //Ora prendo gli hash delle aggiunte e le spunto
        xmlDoc.childNodes.item(0).childNodes.forEach(row => {
            let hash = row.childNodes.item(1).textContent;
            for(let i = 0; i < checkboxes.length; i++){
                let cb = checkboxes.item(i);
                if(cb.value === hash){
                    cb.checked = true;
                    break;
                }
            }
        });
    }
    xhttp.open('GET', '/../../../scripts/index.php/aggiunta/all?pizza='+encodeURIComponent(hashPizza), true);
    xhttp.send();
}

/** 
 * Genera il div popup degli allergeni collegati all'aggiunta il cui bottone Visualizza è stato cliccato.
 * Aggancia l'eventListener sul click per chiudere il popup in caso di click al di fuori di esso
*/
function clickClosePopup(e){
    let popup = document.getElementById('div_popup_ingredienti');
    if(popup !== e.target && !popup.contains(e.target)){ //Sia se il click è eseguito sul div parent, sia su qualcosa di contenuto
        document.getElementById("div_popup_ingredienti").remove();
        document.removeEventListener('click', clickClosePopup, false);
    }
}

/**
 * Funzione richiamata da onload per caricare tutte le pizze disponibili e farle visualizzare nel relativo div
 */
function caricaPizze(){
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function(){
        const XMLParser = new DOMParser();
        let xmlDoc = XMLParser.parseFromString(xhttp.responseText, 'application/xml');
        let parentDiv = document.getElementById("div_pizze");
        parentDiv.innerHTML = "";   //Pulisco il div per sicurezza
        xmlDoc.childNodes.item(0).childNodes.forEach(row => {
            let hash = row.childNodes.item(0).textContent;
            let nome = row.childNodes.item(1).textContent;
            let div = "<div class=\"div_pizza\">"+nome+"<div class=\"div_pizza_bottoni\">";
            //Aggiungo i tre bottoni: elimina, modifica, visualizza ingredienti
            div += "<button type=\"button\" value=\""+hash+"\">Modifica</button>";
            div += "<button type=\"button\" value=\""+hash+"\">Elimina</button>";
            div += "<button type=\"button\" value=\""+hash+"\" onclick=\"mostraPopupIngredienti(this, false)\">Visualizza</button>";
            div += "</div></div>";
            parentDiv.innerHTML += div;
        });

        
    }
    xhttp.open('GET', '/../../../scripts/index.php/pizza/all', true);
    xhttp.send();
}