const RUOLO_CAMERIERE = 'Cameriere';
const RUOLO_PIZZAIOLO = 'Pizzaiolo';
const RUOLO_MAGAZZINIERE = 'Magazziniere';
const RUOLO_RESPONSABILE = 'Responsabile';
const RUOLO_CAMERIERE_ICONA = '../../../resources/profilazione/cameriere_icona.png';
const RUOLO_PIZZAIOLO_ICONA = '../../../resources/profilazione/pizzaiolo_icona.png';
const RUOLO_MAGAZZINIERE_ICONA = '../../../resources/profilazione/magazziniere_icona.png';
const RUOLO_RESPONSABILE_ICONA = '../../../resources/profilazione/responsabile_icona.png';

var nome, cognome, ruolo = 'Magazziniere';

window.onload = function(){
    parseInfoProfilo();
    caricaIconaProfiloByRuolo();
    caricaAllergeni();
    caricaAggiunteAllergeni();

    document.getElementById("annulla_modifica_allergene_bt").addEventListener('click', annullaModificaAllergene, false);
    document.getElementById("salva_nuovo_allergene").addEventListener('click', salvaAllergene, false);
}

function caricaAggiunteAllergeni(){
    const xhttp = new XMLHttpRequest();
    let tbody = document.getElementById("tbody");
    tbody.innerHTML = "";
    xhttp.onload = function(){
        const XMLParser = new DOMParser();
        xmlDoc = XMLParser.parseFromString(xhttp.responseText, 'application/xml');
        xmlDoc.childNodes.item(0).childNodes.forEach(tipo =>{
            let hashTipo = tipo.childNodes.item(0).textContent;
            let nomeTipo = tipo.childNodes.item(1).textContent;

            //Ora prendo tutte le aggiunte del tipo corrente
            const xhttp1 = new XMLHttpRequest();
            xhttp1.onload = function(){
                xmlDoc1 = XMLParser.parseFromString(xhttp1.responseText, 'application/xml');
                xmlDoc1.childNodes.item(0).childNodes.forEach(aggiunta => {
                    let hashAggiunta = aggiunta.childNodes.item(0).textContent;
                    let nomeAggiunta = aggiunta.childNodes.item(1).textContent;
                    let tr = "<tr class=\"tr_body\"><td class=\"td_body\">"+nomeTipo+"</td><td class=\"td_body\">"+nomeAggiunta+"</td><td class=\"td_body\"><button value=\""+hashAggiunta+"\" class=\"show_popup_allergeni_bt\">Visualizza</button></td></tr>";
                    tbody.innerHTML += tr; 
                })
            };
            xhttp1.open('GET', '/../../../scripts/index.php/aggiunta/allfilter?tipoaggiunta='+encodeURIComponent(hashTipo), false);
            xhttp1.send();

        });
        document.querySelectorAll(".show_popup_allergeni_bt").forEach(i => i.addEventListener('click', showPopupAllergeni, false));
        allineaTabella();
    };
    xhttp.open('GET', '/../../../scripts/index.php/tipoaggiunta/tipoaggiunta', true);
    xhttp.send();
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
 * Per abilitare lo scroll al tbody, ho dovuto configurare il diplay block ma ciò causa la
 * perdita dell'allineamento tra i th e i td.
 * Solo tramite JS si può rimediare completamente
 */
function allineaTabella(){
    let theadH = document.getElementById("thead").clientHeight;
    let h = parseInt(theadH)+8; //Aggiungo i 4px superiori e inferiori del bordo della tabella
    h = 'calc(100% - '+h+'px)';
    //document.getElementById("tbody").setAttribute("style", "max-height: "+h+"px;");
    document.getElementById("tbody").style.maxHeight = h+'px';

    let tableTHeadTHs = document.getElementById("table_row_header_aggiunta").querySelectorAll("th");
    //Resetto la w delle celle di testata
    tableTHeadTHs.forEach(i => i.style.width = ''); 
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
        tableTHeadTHs[i].style.width=w+'px';
        w = (parseInt(w)+4); //Aggiungo 2px per bordo della cella di testata
        for(let j = 0; j < tableTBodyTDs.length; j++){
            let cell = tableTBodyTDs[j].childNodes.item(i);
            cell.style.width= w+"px";
        }
    }
}

/* Gestione modifica allergene*/

var modificandoAllergene = false;
var modificandoAllergeneHash = '';

function caricaModificaAllergene(e){
    let input = e.target;
    document.getElementById("annulla_modifica_allergene_bt").style.visibility = 'visible';
    modificandoAllergene = true;
    modificandoAllergeneHash = input.value;
    document.getElementById("nome_nuovo_allergene").value = input.name;
}

function annullaModificaAllergene(){
    modificandoAllergene = false;
    modificandoAllergeneHash = '';
    document.getElementById("nome_nuovo_allergene").value = "";
    document.getElementById("annulla_modifica_allergene_bt").style.visibility = 'hidden';
}

function caricaAllergeni(){
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function(){
        const domParser = new DOMParser();
        xmlDoc = domParser.parseFromString(xhttp.responseText, 'application/xml');

        let div = document.getElementById("storico_etichette_div");
        div.innerHTML = "";
        xmlDoc.childNodes.item(0).childNodes.forEach( row => {
            let nome = row.childNodes.item(1).textContent;
            let hash = row.childNodes.item(0).textContent;
            let divInner = "" + 
            "<div class=\"div_etichetta_bt\">"+
                "<div class=\"div_etichetta\">"+
                nome+
                "</div>"+
                "<div class=\"allergene_bt_div\">" +
                    "<button class=\"allergene_bt allergene_bt_elimina\" type=\"button\" name=\""+nome+"\" value=\"" + hash + "\">Elimina</button>" + 
                    "<button class=\"allergene_bt allergene_bt_modifica\" type=\"button\" name=\""+nome+"\" value=\"" + hash + "\">Modifica</button>" + 
                "</div>" +
            "</div>";
            div.innerHTML += divInner;
        });
        div.innerHTML += "</div>";
        document.querySelectorAll(".allergene_bt_elimina").forEach(i => i.addEventListener('click', eliminaAllergene, false));
        document.querySelectorAll(".allergene_bt_modifica").forEach(i => i.addEventListener('click', caricaModificaAllergene, true));
    };
    xhttp.open('GET', '/../../../scripts/index.php/allergene/allergene', true);
    xhttp.send();
}

function eliminaAllergene(e){
    let input = e.target;
    let go = confirm("Sicuro di voler eliminare l'allergene " + input.name + "?");
    if(go){
        let hash = input.value;
        const xhttp = new XMLHttpRequest();
        xhttp.onload = function(){
            if(xhttp.status !== 200){
                const XMLParser = new DOMParser();
                xmlDoc = XMLParser.parseFromString(xhttp.responseText, 'application/xml');
                alert(xmlDoc.childNodes.item(0).getAttribute('value'));
            }else{
                caricaAllergeni();
            }
        }
        
        xhttp.open('DELETE', '/../../../scripts/index.php/allergene/allergene?hash='+hash, true);
        xhttp.setRequestHeader("Authorization", sessionStorage.getItem("id"));
        xhttp.send();
    }
}

function salvaAllergene(){
    let nome = document.getElementById("nome_nuovo_allergene").value;
    if(nome.length <= 0){
        return;
    }
    let xml = document.createElement("root");
    let nomeXML = document.createElement("nome");
    let appendice = '';
    let metodo = 'POST';
    if(modificandoAllergene){
        appendice = '?hash='+encodeURIComponent(modificandoAllergeneHash);
        metodo = 'PUT';
    }
    nomeXML.setAttribute("value", nome);
    xml.appendChild(nomeXML);
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function(){
        if(xhttp.status !== 200){
            const XMLParser = new DOMParser();
            xmlDoc = XMLParser.parseFromString(xhttp.responseText, 'application/xml');
            alert(xmlDoc.childNodes.item(0).getAttribute('value'));
        }else{
            caricaAllergeni();
            annullaModificaAllergene();
        }
    }
    xhttp.open(metodo, '/../../../scripts/index.php/allergene/allergene'+appendice, true);
    xhttp.setRequestHeader("Authorization", sessionStorage.getItem("id"));
    xhttp.send(new XMLSerializer().serializeToString(xml));

}

/**Gestione della N-N tra allergeni e aggiunte */

function showPopupAllergeni(e){
    let input = e.target;
    let hash = input.value;
    let body = document.getElementsByTagName("body")[0];
    //Rimuovo eventuali popup già aperti
    let old = document.getElementById("div_popup_aggiuntaallergeni");
    if(old !== null){
        document.getElementById("save_aggiunta_allergeni_bt").removeEventListener('click', salvaAggiuntaAllergeni, false);
        old.remove();
        body.removeEventListener('click', clickClosePopup, false);
        openedPopup = false;
    }

    let div = "<div id=\"div_popup_aggiuntaallergeni\">"
    div += retrieveAllAllergeniAsSelect(hash);
    div += "</div>";

    
    /*
        Modificando direttamente tramite body.innerHTML, data la gestione del DOM, tutti gli elementi HTMl vengono ricreati
        e dunque i listeners eliminati; opto in questo caso dunque per usare insertAdjacentHTML (ottimo per la compatibilità)
        'beforeend' in modo da aggiungere div dopo l'ultimo child element
        https://stackoverflow.com/questions/7327056/appending-html-string-to-the-dom
    */
    body.insertAdjacentHTML('beforeend', div);
    spuntaAllergeni(hash);

    document.getElementById("save_aggiunta_allergeni_bt").addEventListener('click', salvaAggiuntaAllergeni, false);

    document.getElementsByTagName("body")[0].addEventListener('click', clickClosePopup, false);
}

/** 
 * Genera il div popup degli allergeni collegati all'aggiunta il cui bottone Visualizza è stato cliccato.
 * Aggancia l'eventListener sul click per chiudere il popup in caso di click al di fuori di esso
*/
var openedPopup = false;
function clickClosePopup(e){
    let flag = false;
    let popup = document.getElementById('div_popup_aggiuntaallergeni');
    if(popup === e.target || popup.contains(e.target)){ //Sia se il click è eseguito sul div parent, sia su qualcosa di contenuto
        flag = true;
    }
    if(!flag && openedPopup){
        document.getElementById("save_aggiunta_allergeni_bt").removeEventListener('click', salvaAggiuntaAllergeni, false);
        document.getElementById("div_popup_aggiuntaallergeni").remove();
        document.getElementsByTagName("body")[0].removeEventListener('click', clickClosePopup, false);
        openedPopup = false;
    }else{
        openedPopup = true;
    }
}

/**
 * Crea una select con opzioni multiple in base a tutti gli allergeni disponibili
 * In base a checkedAllergeni, setta a true (checked) quelli attribuiti all'aggiunta 
 */

function retrieveAllAllergeniAsSelect(hashAggiunta){

    const xhttp = new XMLHttpRequest();
    let select = "<div id=\"div_allergeni_popup\">";
    xhttp.onload = function(){
        const domParser = new DOMParser();
        xmlDoc = domParser.parseFromString(xhttp.responseText, 'application/xml');
        xmlDoc.childNodes.item(0).childNodes.forEach( row => {
            let nome = row.childNodes.item(1).textContent;
            let hash = row.childNodes.item(0).textContent;
            let option = "<div class=\"div_allergene_popup\"><input type=\"checkbox\" value=\""+hash+"\" name=\""+hash+"\"><label for=\""+hash+"\">"+nome+"</label></div>";
            select += option;
        });
        
    };
    xhttp.open('GET', '/../../../scripts/index.php/allergene/allergene', false);
    xhttp.send();
    select += "</div>";
    select += "<button id=\"save_aggiunta_allergeni_bt\" type=\"button\" value=\""+hashAggiunta+"\">Salva</button>";
    return select;
}

//manda la richiesta per salvare gli allergeni di un'aggiunta
function salvaAggiuntaAllergeni(e){
    let input = e.target;
    let inputs = input.parentElement.querySelectorAll("input");
    let xml = document.createElement("root");
    for(let i = 0; i < inputs.length; i++){
        let input = inputs[i];
        if(input.checked){
            let allergeneXML = document.createElement("allergene");
            allergeneXML.setAttribute('hash', input.value);
            xml.appendChild(allergeneXML);
        }
    }

    const xhttp = new XMLHttpRequest();
    xhttp.onload = function(){
        if(xhttp.status !== 200){
            const XMLParser = new DOMParser();
            xmlDoc = XMLParser.parseFromString(xhttp.responseText, 'application/xml');
            alert(xmlDoc.childNodes.item(0).getAttribute('value'));
        }else{
            caricaAggiunteAllergeni();
        }
    }
    xhttp.open('PUT', '/../../../scripts/index.php/aggiunta/allergeni?hash='+encodeURIComponent(input.value));
    xhttp.setRequestHeader("Authorization", sessionStorage.getItem("id"));
    xhttp.send(new XMLSerializer().serializeToString(xml));
}

function spuntaAllergeni(hash){
    let options = document.getElementById("div_popup_aggiuntaallergeni");
    options = options.getElementsByTagName("input");
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function(){
        const domParser = new DOMParser();
        xmlDoc = domParser.parseFromString(xhttp.responseText, 'application/xml');
        let checkedAllergeni = xmlDoc.childNodes.item(0);
        checkedAllergeni.childNodes.forEach( allergene => {
            let hash = allergene.childNodes.item(0).textContent;
    
            for(let i = 0; i < options.length; i++){
                let option = options.item(i);
                if(option.value === hash){
                    option.checked = true;
                    break;
                }
            }
        });
    }
    xhttp.open('GET', '/../../../scripts/index.php/allergene/allergene?aggiunta='+encodeURIComponent(hash), true);
    xhttp.send();
}