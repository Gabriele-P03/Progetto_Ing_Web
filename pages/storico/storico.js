window.onload = function(){
    caricaStorico();
}

function caricaStorico(){
    const xhttp = new XMLHttpRequest();

    xhttp.onload = function(){
        var XMLParser = new DOMParser();
        var xmlDoc = XMLParser.parseFromString(xhttp.responseText, "application/xml");
        let rows = xmlDoc.childNodes.item(0).childNodes;
        if(rows.length > 0){
            document.getElementById("tabella_storico").style.visibility = 'visible';
            let i = 0;
            rows.forEach( row => {
                if(i++ === 0){
                    caricaTHs(row);
                }
                caricaPrenotazione(row);
            });
        }
        allineaTabella();
    }

    xhttp.open('GET', '../../scripts/index.php/prenotazione/all', true);
    xhttp.send();
}

function caricaPrenotazione(row){
    var tbody = document.getElementsByTagName("tbody")[0];
    var newTR = "<tr class=\"tr_body\">";
    var trBuffer = "";
    var tdAzioni = "<td class=\"td_storico\"><input type=button value=\"Visualizza\" onclick=\"apriVisualizzazioneIFRAME(this)\" name=";
    //Adesso inserisco i dati
    row.childNodes.forEach(col => {
        if(col.nodeName !== "ID_HASH"){
            let td = "<td class=\"td_storico\">";
            td += col.textContent;
            td += "</td>";
            trBuffer += td;
        }else{
            tdAzioni += "\"" + col.textContent + "\"></td>";
        }
    });
    tbody.innerHTML += newTR + tdAzioni + trBuffer + "</tr>";
}

function caricaTHs(row){
    var ths = document.getElementById("tr_header");
    ths.innerHTML = "<th class=\"th_storico\">AZIONI</th>";
    row.childNodes.forEach( col => {
        let nodeName = col.nodeName;
        if(nodeName !== "ID_HASH"){
            let th = "<th class=\"th_storico\">";
            th += nodeName.replace("_", " ");
            th += "</th>";
            ths.innerHTML += th;
        }
    });
}

/**
 * Per abilitare lo scroll al tbody, ho dovuto configurare il diplay block ma ciò causa la
 * perdita dell'allineamento tra i th e i td.
 * Solo tramite JS si può rimediare completamente
 */
function allineaTabella(){
    let tableTHeadTHs = document.getElementById("tr_header").querySelectorAll("th");
    let tableTBodyTDs = document.getElementsByClassName("tr_body");

    //Essendo la table inline-block prima calcolo w per ogni colonna
    //Scorrere in modo ricorsivo tutte le celle di una colonna ogni volta che viene trovato w maggiore del valore in uso
    //sarebbe stato troppo dispendioso; si preferisce dunque trovare prima il valore adatto
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

        //ora che ho trovato i valori giusti di h e w, li setto su tutta la colonna i-esima (testata compresa)
        //tableTHeadTHs[i].style.height = h;    //L'altezza della testata non deve essere modificata
        tableTHeadTHs[i].style.width = w + 'px';
        w = (parseInt(w) + 2); //Aggiungo 1px per bordo
        if(i > 0){
            tableTHeadTHs[i].style.marginLeft = '2px';
        }
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
 * Questa funzione è chiamata per ogni tasto visualizza cliccato.
 * Carichera un iframe a mo' di popup in cui verrà renderizzato il contenuto di una prenotazione in sola modalità lettura
 */
var srcPopup = "popup/popup.html";
function apriVisualizzazioneIFRAME(input){
    window.open(srcPopup+'?prenotazione='+input.name, 'Ordini', 'popup');
}