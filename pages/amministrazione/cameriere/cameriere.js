const RUOLO_CAMERIERE = 'Cameriere';
const RUOLO_PIZZAIOLO = 'Pizzaiolo';
const RUOLO_MAGAZZINIERE = 'Magazziniere';
const RUOLO_RESPONSABILE = 'Responsabile';
const RUOLO_CAMERIERE_ICONA = '../../../resources/profilazione/cameriere_icona.png';
const RUOLO_PIZZAIOLO_ICONA = '../../../resources/profilazione/pizzaiolo_icona.png';
const RUOLO_MAGAZZINIERE_ICONA = '../../../resources/profilazione/magazziniere_icona.png';
const RUOLO_RESPONSABILE_ICONA = '../../../resources/profilazione/responsabile_icona.png';

var nome, cognome, ruolo = 'Cameriere';

window.onload = function(){
    parseInfoProfilo();
    caricaIconaProfiloByRuolo();
    impostaMinDataAvvenimento();
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

function impostaMinDataAvvenimento(){
    let datePicker = document.getElementById("date_prenotazioni");
    datePicker.min = new Date().toISOString().split("T")[0];
}

/**
 * Funzione richiamata quando il cameriere cambia la data dal picker
 * Carica le prenotazioni per la data richiesta e visualizza i tutti i tavoli 
 */
function caricaPrenotazioniTavoli(){
    const xhttp = new XMLHttpRequest();

    xhttp.onload = function(){
        var XMLParser = new DOMParser();
        var xmlDoc = XMLParser.parseFromString(xhttp.responseText, "application/xml");
        document.getElementById("tbody").innerHTML = "";
        xmlDoc.childNodes.item(0).childNodes.forEach(row => {
            let tr = "<tr class=\"tr_prenotazione\">";
                let nome = row.childNodes.item(1).textContent;
                tr += "<td class=\"td_prenotazione\">" + nome + "</td>";
                let persone = row.childNodes.item(5).textContent;
                tr += "<td class=\"td_prenotazione\">" + persone + "</td>";
                let tavolo = row.childNodes.item(9).textContent;
                tr += "<td class=\"td_prenotazione\">" + (parseInt(tavolo)+1) + "</td>";
                let stato = row.childNodes.item(4).textContent;
                tr += "<td class=\"td_prenotazione\">" + stato + "</td>";
                let telefono = row.childNodes.item(8).textContent;
                tr += "<td class=\"td_prenotazione\">" + telefono + "</td>";
            document.getElementById("tbody").innerHTML += tr;
        });    //Prendo il child row
        if(xmlDoc.childNodes.item(0).childNodes.length > 0){
            document.getElementById("prenotazioni_cameriere").style.visibility = 'visible';
            caricaTHs();
            allineaTabella();
        }else{
            document.getElementById("prenotazioni_cameriere").style.visibility = 'hidden'; 
        }        
    }
    let date = document.getElementById("date_prenotazioni").value;
    xhttp.open('GET', '../../../scripts/index.php/prenotazione/all?date='+encodeURIComponent(date), true);
    xhttp.send();
}


function caricaTHs(){
    document.getElementById("thead").innerHTML = "<tr id=\"table_row_header_prenotazione\">"+
                                    "<th class=\"th_prenotazione\">Nome</th>"+
                                    "<th class=\"th_prenotazione\">Persone</th>"+
                                    "<th class=\"th_prenotazione\">Tavolo</th>"+
                                    "<th class=\"th_prenotazione\">Stato</th>"+
                                    "<th class=\"th_prenotazione\">Telefono</th>"+
                                "</tr>";
}

/**
 * Per abilitare lo scroll al tbody, ho dovuto configurare il diplay block ma ciò causa la
 * perdita dell'allineamento tra i th e i td.
 * Solo tramite JS si può rimediare completamente
 */
function allineaTabella(){
    let tableTHeadTHs = document.getElementById("table_row_header_prenotazione").querySelectorAll("th");
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