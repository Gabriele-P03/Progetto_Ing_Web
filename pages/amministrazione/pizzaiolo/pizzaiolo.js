const RUOLO_CAMERIERE = 'Cameriere';
const RUOLO_PIZZAIOLO = 'Pizzaiolo';
const RUOLO_MAGAZZINIERE = 'Magazziniere';
const RUOLO_RESPONSABILE = 'Responsabile';
const RUOLO_CAMERIERE_ICONA = '../../../resources/profilazione/cameriere_icona.png';
const RUOLO_PIZZAIOLO_ICONA = '../../../resources/profilazione/pizzaiolo_icona.png';
const RUOLO_MAGAZZINIERE_ICONA = '../../../resources/profilazione/magazziniere_icona.png';
const RUOLO_RESPONSABILE_ICONA = '../../../resources/profilazione/responsabile_icona.png';

var nome, cognome, ruolo = 'Pizzaiolo';

var ingredienti = Array('');

window.onload = function(){
    parseInfoProfilo();
    caricaIconaProfiloByRuolo();
    caricaPizze();

    document.getElementById("date_input").addEventListener('change', caricaPrenotazioni, false);

    document.getElementById("show_ingredienti").addEventListener('click', mostraPopupIngredienti, false);
    document.getElementById("salva_pizza").addEventListener('click', salvaPizza, false);
    document.getElementById("annulla_modifica_pizza").addEventListener('click', annullaModificaPizza, false);
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
function caricaPrenotazioni(e){
    let input = e.target;
    let date = input.value;
    if(date !== null){
        let tbody = document.getElementById("tbody_prenotazioni");
        tbody.innerHTML = "";
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
                tr += "<td class=\"td_tbody\"><button class=\"apri_prenotazione_bt\" type=\"button\" value=\""+hash+"\">Visualizza</button></td>";
                tr += "</tr>";
                tbody.insertAdjacentHTML('beforeend', tr);
            });
            document.querySelectorAll(".apri_prenotazione_bt").forEach(i => i.addEventListener('click', apriPrenotazione, false));
            allineaTabella();
        }
        xhttp.open('GET', '../../../scripts/index.php/prenotazione/prenotazione?date='+encodeURIComponent(date) + '&asporto=1', true);
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
            //tableTHeadTHs[i].style.marginLeft = '2px';
        }

        w = (parseInt(w)+2); //Aggiungo 2px per bordo della cella di testata
        for(let j = 0; j < tableTBodyTDs.length; j++){
            let cell = tableTBodyTDs[j].childNodes.item(i);
            cell.style.width = w + 'px';
            if(i > 0){
                cell.style.marginLeft = '2px';
            }
        }
    }
}

/**
 * Funzione per mostrare il popup degli ingredienti
 */
function mostraPopupIngredienti(e, allowSave = true){
    let input = e.target;
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

        let doc = XMLParser.parseFromString(div, 'text/html');
        document.body.appendChild(doc.getElementById("div_popup_ingredienti"));
        document.addEventListener('click', clickClosePopup, false);
        if(allowSave){
            document.getElementById("button_save_ingredienti").addEventListener('click', salvaIngredientiTMP, false);
        }
        spuntaIngredienti(hash, allowSave);
        
    }
    xhttp.open('GET', '/../../../scripts/index.php/aggiunta/aggiunta?pizza=true', true);
    xhttp.send();
}

function spuntaIngredienti(hashPizza, allowSave){
    //Se allowSave è abilitato, ovvero sto dando la possibilità di apportare modifiche agli ingredienti, devo
    //spuntarli in base all'array in memoria, in quanto contiene le eventuali modifiche
    //In caso di modifica di una pizza, l'array è già stato popolato
    if(allowSave){
        ingredienti.forEach(hash => {
            spuntaIngredienteByHash(hash);
        })
    }else{
        const xhttp = new XMLHttpRequest();
        //tutte le checkbox del popup, il value corrisponde all'hash dell'aggiunta
        
        xhttp.onload = function(){
            const XMLParser = new DOMParser();
            let xmlDoc = XMLParser.parseFromString(xhttp.responseText, 'application/xml');
            //Ora prendo gli hash delle aggiunte e le spunto
            xmlDoc.childNodes.item(0).childNodes.forEach(row => {
                let hash = row.childNodes.item(1).textContent;
                spuntaIngredienteByHash(hash);
            });
        }
        xhttp.open('GET', '/../../../scripts/index.php/aggiunta/aggiunta?pizza='+encodeURIComponent(hashPizza), true);
        xhttp.send();
    }
}

function spuntaIngredienteByHash(hashIngrediente){
    let checkboxes = document.getElementById("div_ingredienti_checkbox").querySelectorAll("input");
    for(let i = 0; i < checkboxes.length; i++){
        let cb = checkboxes.item(i);
        if(cb.value === hashIngrediente){
            cb.checked = true;
            break;
        }
    }
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
            let prezzo = row.childNodes.item(2).textContent;
            let div = "<div class=\"div_pizza\">"+nome+" - "+prezzo+"&euro;<div class=\"div_pizza_bottoni\">";
            //Aggiungo i tre bottoni: elimina, modifica, visualizza ingredienti
            div += "<button class=\"modifica_pizza_bt\" type=\"button\" name=\""+nome+"\" value=\""+hash+"\" prezzo=\""+prezzo+"\">Modifica</button>";
            div += "<button class=\"elimina_pizza_bt\" type=\"button\" name=\""+nome+"\" value=\""+hash+"\">Elimina</button>";
            div += "<button class=\"mostra_ingredienti_pizza_bt\" type=\"button\" value=\""+hash+"\">Visualizza</button>";
            div += "</div></div>";
            parentDiv.insertAdjacentHTML('beforeend', div);
        });
        document.querySelectorAll(".modifica_pizza_bt").forEach(i => i.addEventListener('click', caricaModificaPizza, false));
        document.querySelectorAll(".elimina_pizza_bt").forEach(i => i.addEventListener('click', eliminaPizza, false));
        document.querySelectorAll(".mostra_ingredienti_pizza_bt").forEach(i => i.addEventListener('click', function(e){mostraPopupIngredienti(e, false)}, false));
        
    }
    xhttp.open('GET', '/../../../scripts/index.php/pizza/pizza', true);
    xhttp.send();
}

var modificandoPizza = false;
var modificandoPizzaHash = '';
function caricaModificaPizza(e){
    let input = e.target;
    let hash = input.value;
    let nome = input.name;
    let prezzo = input.getAttribute("prezzo");  //Di per sè un tag html non contiene l'attributo prezzo e dunque non posso accedervi direttamente
    //Mostro il pulsante di annulla modifica
    document.getElementById("annulla_modifica_pizza").style.visibility = 'visible';
    document.getElementById("input_nome_pizza").value = nome;
    document.getElementById("input_prezzo_pizza").value = prezzo;
    modificandoPizza = true;
    modificandoPizzaHash = hash;
    document.getElementById("show_ingredienti").value = hash;
    //Popolo l'array degli ingredienti in quanto, poiché potrebbe modificarli, devo tenerli in memoria, e dunque uso l'array
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function(){
        const XMLParser = new DOMParser();
        let xmlDoc = XMLParser.parseFromString(xhttp.responseText, 'application/xml');
        //Ora prendo gli hash delle aggiunte e le spunto
        xmlDoc.childNodes.item(0).childNodes.forEach(row => {
            let hash = row.childNodes.item(1).textContent;
            ingredienti.push(hash);
        });
    }
    xhttp.open('GET', '/../../../scripts/index.php/aggiunta/aggiunta?pizza='+encodeURIComponent(hash), true);
    xhttp.send();
}

function annullaModificaPizza(){
    document.getElementById("annulla_modifica_pizza").style.visibility = 'hidden';
    document.getElementById("input_nome_pizza").value = '';
    document.getElementById("input_prezzo_pizza").value = '';
    modificandoPizza = false;
    modificandoPizzaHash = ''; 
    document.getElementById("show_ingredienti").value = '';
    ingredienti = [];   //Svuoto l'array degli ingredienti
}

/**
 * Funzione chiamata dal tasto salva interno al div popup degli ingredienti
 * Salva nell'array dichiarato a inizio file gli hash degli ingredienti selezionati
 */
function salvaIngredientiTMP(e){
    let input = e.target;
    //Devo salire di due parentElement in quanto il bottone è contenuto in un proprio div (al fine di centrarlo)
    let inputs = input.parentElement.parentElement.getElementsByTagName("input"); //Il bottone salva non è contemplato in quanto button e non input
    ingredienti = [];//Pulisco l'array per sicurezza
    for(let i = 0; i < inputs.length; i++){
        let input = inputs[i];
        if(input.checked){
            ingredienti.push(input.value);
        }
    }
    document.getElementById("div_popup_ingredienti").remove();
    document.removeEventListener('click', clickClosePopup, false);
}

function eliminaPizza(e){
    let input = e.target;
    if(modificandoPizza){
        alert("Non puoi eliminare una pizza se è in corso una modifica!");
    }else{
        //Chiedo prima conferma
        let go = confirm("Sicuro di voler eliminare la pizza " + input.name);
        if(go){
            const xhttp = new XMLHttpRequest();
            xhttp.onload = function(){
                if(xhttp.status !== 200){
                    const XMLParser = new DOMParser();
                    let xmlDoc = XMLParser.parseFromString(xhttp.responseText, 'application/xml');
                    let res = xmlDoc.childNodes.item(0).getAttribute("value");
                    alert(res);
                }else{
                    caricaPizze();
                }
            }
            xhttp.open('DELETE', '/../../../scripts/index.php/pizza/pizza?hash='+encodeURIComponent(input.value), true);
            xhttp.setRequestHeader("Authorization", sessionStorage.getItem("id"));
            xhttp.send();
        }
    }
}

/**
 * Funzione per salvare o modificare effettivamente una pizza
 */
function salvaPizza(){
    let nome = document.getElementById("input_nome_pizza").value;
    let prezzo = document.getElementById("input_prezzo_pizza").value;
    let appendice = "";
    let metodo = 'POST';
    if(modificandoPizza){
        appendice = "?hash="+encodeURIComponent(modificandoPizzaHash);
        metodo = 'PUT';
    }
    //Costruisco il file xml con gli hash degli ingredienti
    let xml = document.createElement("root");
    let pizzaXML = document.createElement("pizza");
    pizzaXML.setAttribute('nome', nome);
    pizzaXML.setAttribute('prezzo', prezzo);
    for(let i = 0; i < ingredienti.length; i++){
        let ingredienteXML = document.createElement("ingrediente");
        ingredienteXML.setAttribute('value', ingredienti[i]);
        pizzaXML.appendChild(ingredienteXML);
    }
    xml.appendChild(pizzaXML);
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function(){
        if(xhttp.status !== 200){
            const XMLParser = new DOMParser();
            let xmlDoc = XMLParser.parseFromString(xhttp.responseText, 'application/xml');
            let res = xmlDoc.childNodes.item(0).getAttribute("value");
            alert(res);
        }else{
            caricaPizze();
            //Pulisco il form
            annullaModificaPizza();
        }
    }
    xhttp.open(metodo, '/../../../scripts/index.php/pizza/pizza'+appendice, true);
    xhttp.setRequestHeader("Authorization", sessionStorage.getItem("id"));
    xhttp.send(new XMLSerializer().serializeToString(xml));

}

/**
 * Sfrutto lo storico popup già scritto per il cliente circa le sue prenotazioni
 */
var srcPopup = "/pages/storico/popup/popup.html";
function apriPrenotazione(e){
    window.open(srcPopup+'?prenotazione='+e.target.value, 'Ordini', 'popup');
}