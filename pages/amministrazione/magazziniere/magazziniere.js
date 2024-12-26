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
    
}

function caricaAggiunte(){
    let optionsTipoAggiunte = document.getElementById("tipoaggiunta_input_list").querySelectorAll("option");
    optionsTipoAggiunte.forEach(option => {

        const xhttp = new XMLHttpRequest();
        xhttp.onload = function(){
            
        };
        xhttp.open('GET', '/../../../scripts/index.php/tipoaggiunta/allfilter?tipoaggiunta='+encodeURIComponent(option.value), true);
        xhttp.send();
    });
    allineaTabella();
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
                    "<button class=\"tipoaggiunta_bt\" type=\"button\" name=\""+nome+"\" value=\"" + hash + "\" onclick=\"eliminaTipoAggiunta(this)\">Elimina</button>" + 
                    "<button class=\"tipoaggiunta_bt\" type=\"button\" name=\""+nome+"\" value=\"" + hash + "\" onclick=\"caricaModificaTipoAggiunta(this)\">Modifica</button>" + 
                "</div>" +
            "</div>";
            div.innerHTML += divInner;

            //Devo inoltre aggiungerli al selettore per le aggiunte
            let option = "<option value=\""+hash+"\">" + nome + "</option>";
            divSelettoreTipoAggiunte.innerHTML += option;
        });
        div += "</div>";
        caricaAggiunte();
    }
    xhttp.open('GET', '/../../../scripts/index.php/tipoaggiunta/all', true);
    xhttp.send();
}

function eliminaTipoAggiunta(input){
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
        xhttp.send();
    }
}

var modificandoTipoAggiuntaHash='';
var modificandoTipoAggiunta = false;
var templateAnnullaModificaTipoAggiunta = "<button id=\"annulla_modifica_tipoaggiunta_bt\" type=\"button\" onclick=\"annullaModificaTipoAggiunta()\">Annulla</button>"
function caricaModificaTipoAggiunta(input){
    let precModifica = document.getElementById("annulla_modifica_tipoaggiunta_bt");
    if(precModifica !== null)
        precModifica.remove();
    document.getElementById("aggiungi_tipoaggiunta_form").innerHTML += templateAnnullaModificaTipoAggiunta;
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
    xhttp.send(new XMLSerializer().serializeToString(xml));
}

function annullaModificaTipoAggiunta(){
    modificandoTipoAggiunta = false;
    document.getElementById("nome_nuovo_tipoaggiunta").value = "";
    modificandoTipoAggiuntaHash = '';
    document.getElementById("annulla_modifica_tipoaggiunta_bt").remove();
}

/**
 * Per abilitare lo scroll al tbody, ho dovuto configurare il diplay block ma ciò causa la
 * perdita dell'allineamento tra i th e i td.
 * Solo tramite JS si può rimediare completamente
 */
function allineaTabella(){
    let tableTHeadTHs = document.getElementById("table_row_header_aggiunta").querySelectorAll("th");
    let tableTBodyTDs = document.getElementsByClassName("tr_prenotazione");

    //Essendo la table inline-block prima calcolo h e w per ogni colonna
    //Scorrere in modo ricorsivo tutte le celle di una colonna ogni volta che viene trovato h o w maggiore del valore in uso
    //sarebbe stato troppo dispendioso; si preferisce dunque trovare prima i due valori adatti 
    let hs = [];
    for(let i = 0; i < tableTHeadTHs.length; i++){
        //Inizializzo sempre w al valore della cella di testata
        let w = tableTHeadTHs[i].clientWidth;
        //Scorro la colonna i-esima alla ricerca di aventuali h o w maggiori 
        for(let j = 0; j < tableTBodyTDs.length; j++){
            let cell = tableTBodyTDs[j].childNodes.item(i);
            if(cell.clientWidth > w){
                w = cell.clientWidth;
            }
            hs.push(parseInt(tableTBodyTDs[j].clientHeight)-4);
        }

        //ora che ho trovato i valori giusti di h e w, li setto su tutta la colonna i-esima (testata compresa)
        //tableTHeadTHs[i].style.height = h;    //L'altezza della testata non deve essere modificata
        tableTHeadTHs[i].style.width = w + 'px';
        if(i > 0){
            tableTHeadTHs[i].style.marginLeft = '2px';
        }
        w = (parseInt(w) + 2); //Aggiungo 1px per bordo
        for(let j = 0; j < tableTBodyTDs.length; j++){
            let cell = tableTBodyTDs[j].childNodes.item(i);
            cell.style.width = w + 'px';
            cell.style.height = hs[j] + 'px';
            if(i > 0){
                cell.style.marginLeft = '2px';
            }
        }
    }
}