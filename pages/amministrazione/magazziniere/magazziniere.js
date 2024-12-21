var nome, cognome, ruolo;

window.onload = function(){
    parseInfoProfilo();
    caricaIframeProfilo();
    impostaMinDataAvvenimento();
}

function caricaIframeProfilo(){
    var iframe = document.getElementById("iframe_pannello_utente");
    let parameters = "nome="+encodeURIComponent(nome)+"&cognome="+encodeURIComponent(cognome)+"&ruolo="+encodeURIComponent(ruolo);
    iframe.setAttribute("src", "http://localhost/pages/amministrazione/pannello/pannello_utente.html?"+parameters);
    iframe.onload = function(){
        iframe.contentDocument.getElementById("nome_div_pannello_utente").innerHTML += nome;
        iframe.contentDocument.getElementById("cognome_div_pannello_utente").innerHTML += cognome;
        iframe.contentDocument.getElementById("ruolo_div_pannello_utente").innerHTML += ruolo;
    }
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

        let row = xmlDoc.documentElement    //Prendo il child row
        
    }
    let date = document.getElementById("date_prenotazioni").value;
    xhttp.open('GET', '../../../scripts/index.php/prenotazione/all?date='+encodeURIComponent(date), true);
    xhttp.send();
}