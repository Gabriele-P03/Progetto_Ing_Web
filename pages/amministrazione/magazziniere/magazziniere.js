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
    caricaTipoAggiunte();
    
    document.getElementById("salva_nuovo_tipoaggiunta").addEventListener('click', salvaTipoAggiunta, false);
    document.getElementById("annulla_modifica_tipoaggiunta_bt").addEventListener('click', annullaModificaTipoAggiunta, false);
    document.getElementById("salva_nuova_aggiunta").addEventListener('click', salvaAggiunta, false);
    document.getElementById("annulla_modifica_aggiunta").addEventListener('click', annullaModificaAggiunta, false);
}

function caricaAggiunte(){
    let optionsTipoAggiunte = document.getElementById("tipoaggiunta_input_list").querySelectorAll("option");
    let body = document.getElementById("tbody");
    body.innerHTML = "";    //Pulisco il tbody
    optionsTipoAggiunte.forEach(option => {
        if(option.value !== ""){    //Scarto la prima opzione che è quella senza valori ("Seleziona")
            const xhttp = new XMLHttpRequest();


            xhttp.onload = function(){
                //Carico i dati nella tabella

                var XMLParser = new DOMParser();
                var xmlDoc = XMLParser.parseFromString(xhttp.responseText, "application/xml");

                xmlDoc.childNodes.item(0).childNodes.forEach(aggiunta => {
                    let nome = aggiunta.childNodes.item(1).textContent;
                    let hash = aggiunta.childNodes.item(0).textContent;
                    let row = "<tr class=\"tr_body\">";
                    //Aggiungo il td del tipo aggiunta
                    row += "<td class=\"td_body\" value=\""+option.value+"\">"+option.innerHTML+"</td>";
                    //Aggiungo l'aggiunta
                    row += "<td class=\"td_body\">"+nome+"</td>";
                    //Aggiungo la quantità
                    row += "<td class=\"td_body\">"+aggiunta.childNodes.item(3).textContent+"</td>";
                    //Aggiungo il prezzo
                    row += "<td class=\"td_body\">"+aggiunta.childNodes.item(2).textContent+"&euro;</td>";
                    //Aggiungo i tasti di elimina e modifica
                    row += "<td class=\"td_body\"><button class=\"bt_modifica_aggiunta\" type=\"button\" value=\""+hash+"\" name=\""+nome+"\">Modifica</button>"
                    row += "<button class=\"bt_elimina_aggiunta\" type=\"button\" name=\""+nome+"\" value=\""+hash+"\">Elimina</button>";
                    row += "</td>";
                    body.innerHTML += row;
                });

                //Adesso aggiungo i listeners
                document.querySelectorAll(".bt_modifica_aggiunta").forEach(bt => bt.addEventListener('click', caricaModificaAggiunta, false));
                document.querySelectorAll(".bt_elimina_aggiunta").forEach(bt => bt.addEventListener('click', eliminaAggiunta, false));
            }; 
            xhttp.open('GET', '/../../../scripts/index.php/aggiunta/allfilter?tipoaggiunta='+encodeURIComponent(option.value), false);
            xhttp.send();
        }
    });
}

var modificandoAggiuntaHash = '';
var modificandoAggiunta = false;
function caricaModificaAggiunta(e){
    let input = e.target;
    modificandoAggiuntaHash = input.value;
    let nome = input.name;
    modificandoAggiunta = true;
    let parentRow = input.parentElement.parentElement; 
    //Setta il tipo aggiunta
    let tipoAggiuntaHash = parentRow.childNodes.item(0).getAttribute("value");
    document.getElementById("tipoaggiunta_input_list").value=tipoAggiuntaHash;  //Setta automaticamente la option selezionata
    //Pongo il nome nella casella di testo
    document.getElementById("nome_nuova_aggiunta").value = nome;
    //Pongo la quantità
    document.getElementById("quantita_nuova_aggiunta").value = parentRow.childNodes.item(2).innerHTML;
    //Pongo il prezzo
    document.getElementById("prezzo_nuova_aggiunta").value = parentRow.childNodes.item(3).innerHTML.slice(0,-1);

    document.getElementById("annulla_modifica_aggiunta").style.visibility = "visible";
}

function eliminaAggiunta(e){
    let input = e.target;
    let go = confirm("Sicuro di voler eliminare l'aggiunta " + input.name + "?");
    if(go){
        const xhttp = new XMLHttpRequest();
        let hash = input.value;
        xhttp.onload = function(){
            if(xhttp.status === 200){
                caricaAggiunte();
                allineaTabella();
            }else{
                var XMLParser = new DOMParser();
                var xmlDoc = XMLParser.parseFromString(xhttp.responseText, "application/xml");
                alert(xmlDoc.childNodes.item(0).getAttribute("value"));
            }
        }
        xhttp.open('DELETE', '/../../../scripts/index.php/aggiunta/aggiunta?hash='+hash, true);
        xhttp.setRequestHeader("Authorization", sessionStorage.getItem("id"));
        xhttp.send();
    }
}

function annullaModificaAggiunta(){
    modificandoAggiunta = false;
    modificandoAggiuntaHash = "";
    document.getElementById("annulla_modifica_aggiunta").style.visibility = "hidden";
    document.getElementById("tipoaggiunta_input_list").value=""; 
    document.getElementById("nome_nuova_aggiunta").value = "";
    document.getElementById("quantita_nuova_aggiunta").value = "";
    document.getElementById("prezzo_nuova_aggiunta").value = "";
}

function salvaAggiunta(){
    let metodo = 'POST';
    let appendiceParametro = '';
    if(modificandoAggiunta){
        metodo = 'PUT';
        appendiceParametro = '?hash='+modificandoAggiuntaHash;
    }
    //Genero il file xml
    xml = document.createElement("root");
    //Allego il nome
    let nome = document.getElementById("nome_nuova_aggiunta").value;
    if(nome === ''){
        alert("Il nome dell'aggiunta è vuoto");
        return;
    }
    nomeXML = document.createElement("nome");
    nomeXML.setAttribute("value", nome);
    xml.appendChild(nomeXML);
    //Allego il prezzo
    let prezzo = document.getElementById("prezzo_nuova_aggiunta").value;
    if(prezzo === ''){
        alert("Il prezzp dell'aggiunta è vuoto");
        return;
    }
    prezzoXML = document.createElement("prezzo");
    prezzoXML.setAttribute("value", prezzo);
    xml.appendChild(prezzoXML);
    //Allego la quantità
    let quantita = document.getElementById("quantita_nuova_aggiunta").value;
    if(quantita === ''){
        alert("La quantità dell'aggiunta è vuota");
        return;
    }
    quantitaXML = document.createElement("quantita");
    quantitaXML.setAttribute("value", quantita);
    xml.appendChild(quantitaXML);
    //Allego il tipo aggiunta
    let tipoaggiunta = document.getElementById("tipoaggiunta_input_list").value;
    if(tipoaggiunta === ''){
        alert("Il tipo aggiunta non è stato selezionato");
        return;
    }
    tipoaggiuntaXML = document.createElement("tipoaggiunta");
    tipoaggiuntaXML.setAttribute("value", tipoaggiunta);
    xml.appendChild(tipoaggiuntaXML);    

    const xhttp = new XMLHttpRequest();
    xhttp.onload = function(){
        if(xhttp.status === 200){
            caricaAggiunte();
            allineaTabella();
        }else{
            var XMLParser = new DOMParser();
            var xmlDoc = XMLParser.parseFromString(xhttp.responseText, "application/xml");
            alert(xmlDoc.childNodes.item(0).getAttribute("value"));
        }
    }
    xhttp.open(metodo, '/../../../scripts/index.php/aggiunta/aggiunta'+appendiceParametro, true);
    xhttp.setRequestHeader("Authorization", sessionStorage.getItem("id"));
    xhttp.send(new XMLSerializer().serializeToString(xml));
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

function caricaTipoAggiunte(){
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function(){

        var XMLParser = new DOMParser();
        var xmlDoc = XMLParser.parseFromString(xhttp.responseText, "application/xml");
        let div = document.getElementById("storico_etichette_div");
        let divSelettoreTipoAggiunte = document.getElementById("tipoaggiunta_input_list");
        divSelettoreTipoAggiunte.innerHTML = "<option selected=\"\" value=\"\">Seleziona</option>";
        div.innerHTML = "";
        xmlDoc.childNodes.item(0).childNodes.forEach( row => {
            let nome = row.childNodes.item(1).textContent;
            let hash = row.childNodes.item(0).textContent;
            let divInner = "" + 
            "<div class=\"div_etichetta\">"+
                nome+
                "<div class=\"tipoaggiunta_bt_div\">" +
                    "<button class=\"tipoaggiunta_bt tipoaggiunta_bt_elimina\" type=\"button\" name=\""+nome+"\" value=\"" + hash + "\">Elimina</button>" + 
                    "<button class=\"tipoaggiunta_bt tipoaggiunta_bt_modifica\" type=\"button\" name=\""+nome+"\" value=\"" + hash + "\">Modifica</button>" + 
                "</div>" +
            "</div>";
            div.innerHTML += divInner;

            //Devo inoltre aggiungerli al selettore per le aggiunte
            let option = "<option value=\""+hash+"\">" + nome + "</option>";
            divSelettoreTipoAggiunte.innerHTML += option;


        });
        div += "</div>";
        //Adesso aggiungo i listeners
        document.querySelectorAll(".tipoaggiunta_bt_elimina").forEach(bt => bt.addEventListener('click', eliminaTipoAggiunta, false));
        document.querySelectorAll(".tipoaggiunta_bt_modifica").forEach(bt => bt.addEventListener('click', caricaModificaTipoAggiunta, false));
        caricaAggiunte();
        allineaTabella();
    }
    xhttp.open('GET', '/../../../scripts/index.php/tipoaggiunta/tipoaggiunta', true);
    xhttp.send();
}

function eliminaTipoAggiunta(e){
    let input = e.target;
    let ok = confirm("Vuoi veramente cancellare il tipo aggiunta " + input.name + "?");    
    if(ok){
        let etichetta = input.value;
        const xhttp = new XMLHttpRequest();
        xhttp.onload = function(){
            if(xhttp.status !== 200){
                var XMLParser = new DOMParser();
                var xmlDoc = XMLParser.parseFromString(xhttp.responseText, "application/xml");
                alert(xmlDoc.childNodes.item(0).attributes[0].textContent);
            }else{
                caricaTipoAggiunte();
            }
        };
        xhttp.open('DELETE', '/../../../scripts/index.php/tipoaggiunta/tipoaggiunta?hash='+etichetta, true);
        xhttp.setRequestHeader("Authorization", sessionStorage.getItem("id"));
        xhttp.send();
    }
}

var modificandoTipoAggiuntaHash='';
var modificandoTipoAggiunta = false;
function caricaModificaTipoAggiunta(e){
    let input = e.target;
    document.getElementById("annulla_modifica_tipoaggiunta_bt").style.visibility = 'visible';
    let inputText = document.getElementById("nome_nuovo_tipoaggiunta");
    inputText.value = input.name;
    modificandoTipoAggiunta = true;
    modificandoTipoAggiuntaHash = input.value;
}

function salvaTipoAggiunta(){
    let nuovaEtichetta = document.getElementById("nome_nuovo_tipoaggiunta").value;
    const xhttp = new XMLHttpRequest();
    let xml = document.createElement("root");
    let etichettaXML = document.createElement("etichetta");
    etichettaXML.setAttribute("value", nuovaEtichetta);
    xml.appendChild(etichettaXML);
    xhttp.onload = function(){
        if(xhttp.status === 200){
            caricaTipoAggiunte();
            annullaModificaTipoAggiunta();
        }else{
            var XMLParser = new DOMParser();
            var xmlDoc = XMLParser.parseFromString(xhttp.responseText, "application/xml");
            alert(xmlDoc.childNodes.item(0).attributes[0].textContent);
        }
    };
    let metodo = 'POST';
    let appendiceParametro = "";
    if(modificandoTipoAggiunta){
        metodo = 'PUT';
        appendiceParametro = '?hash=' + modificandoTipoAggiuntaHash;
    }
    xhttp.open(metodo, '/../../../scripts/index.php/tipoaggiunta/tipoaggiunta'+appendiceParametro, true);
    xhttp.setRequestHeader("Authorization", sessionStorage.getItem("id"));
    xhttp.send(new XMLSerializer().serializeToString(xml));
}

function annullaModificaTipoAggiunta(){
    modificandoTipoAggiunta = false;
    document.getElementById("nome_nuovo_tipoaggiunta").value = "";
    modificandoTipoAggiuntaHash = '';
    document.getElementById("annulla_modifica_tipoaggiunta_bt").style.visibility = 'hidden';
}

/**
 * Per abilitare lo scroll al tbody, ho dovuto configurare il diplay block ma ciò causa la
 * perdita dell'allineamento tra i th e i td.
 * Solo tramite JS si può rimediare completamente
 */
function allineaTabella(){
    let tableTHeadTHs = document.getElementById("table_row_header_aggiunta").querySelectorAll("th");
    let tableTBodyTDs = document.getElementsByClassName("tr_body");

    let tbody = document.getElementsByTagName("tbody")[0];
    let h = "calc(100% - "+(tableTHeadTHs[0].clientHeight+4) + "px)";
    tbody.style.maxHeight = h;

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
        tableTHeadTHs[i].style.width = (parseInt(w)+2) + 'px';
        if(i > 0){
            tableTHeadTHs[i].style.marginLeft = '2px';
        }

        w = (parseInt(w)+4); //Aggiungo 2px per bordo della cella di testata
        for(let j = 0; j < tableTBodyTDs.length; j++){
            let cell = tableTBodyTDs[j].childNodes.item(i);
            cell.style.width = w + 'px';
            if(i > 0){
                cell.style.marginLeft = '2px'
            }
        }
    }
}