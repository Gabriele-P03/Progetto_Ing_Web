window.onload = function(){
    let idHashPrenotazione = retrieveIdHashPrenotazione();
    caricaPrenotazione(idHashPrenotazione);
    allineaTabella();
}

window.onresize = function(){
    //allineaTabella();
}

/**
 * Si prende l'idHash della prenotazione posta nell'url
 */
function retrieveIdHashPrenotazione(){
    let url = document.URL;
    let indexQuestionMark = url.indexOf('?');
    url = url.substring(indexQuestionMark+1);
    let idHash = url.substring('prenotazione='.length);
    return idHash;
}

function caricaPrenotazione(idHashPrenotazione){
    if(idHashPrenotazione.length > 0){
        const xhttp = new XMLHttpRequest();
        xhttp.onload = function(){
            var XMLParser = new DOMParser();
            var xmlDoc = XMLParser.parseFromString(xhttp.responseText, "application/xml");
            caricaTHs(xmlDoc);
            caricaDati(xmlDoc);
            allineaTabella();
        };
        xhttp.open('GET', '../../../scripts/index.php/ordine/ordine?prenotazione='+encodeURIComponent(idHashPrenotazione), true);
        xhttp.send();
    }
}

function caricaDati(xmlDoc){
    let table = document.getElementsByTagName("table")[0];
    let tbody = table.querySelector("tbody");
    let ths = table.querySelectorAll("th"); //Prendo tutti gli header
    tbody.innerHTML = "";

    //item(0) per entrare nel root results
    //Prendo il totale dell'ordine
    //let totale = xmlDoc.childNodes.item(0).getAttribute("totale");
    //let divTotale = document.getElementById("info_ordine_totale");
    //divTotale.innerHTML = "Totale: " + totale + " &euro;"

    if(xmlDoc.childNodes.item(0).childNodes.length > 0){
        table.style.visibility = "visible";
        xmlDoc.childNodes.item(0).childNodes.forEach( ordine =>{

            let idHashOrdine = ordine.getAttribute("hash");

            let newTR = "<tr class=\"tr_prenotazione\">"
            
            //Salto la prima colonna essendo quella delle azioni e la seconda essendo quella del prezzo
            newTR += "<td class=\"td_prenotazione\">" + ordine.getAttribute("prezzo") + " &euro;</td>";
            for(let i = 1; i < ths.length; i++){
                let th = ths[i];
                let nomeCol = th.innerHTML;

                let parentElement = ordine.querySelector(nomeCol);

                //Vuol dire che non vi è questa colonna nell'ordinazione corrente
                if(parentElement === null){
                    newTR += "<td class=\"td_prenotazione\"></td>";
                }else{
                    if(parentElement.hasAttribute("th") && !parentElement.hasAttribute("ul")){
                        let res = caricaTD(parentElement);
                        newTR += res;
                    }else{
                        let res = caricaTDUL(parentElement.childNodes);
                        newTR += res;
                    }
                }
            }

            newTR += "</tr>";
            tbody.innerHTML += newTR;
        });
    }else{
        //Nessun ordine da visualizzare, nascondo la tabella
        table.style.visibility = "hidden";
    }
}

function caricaTDUL(col){
    let newTD = "<td class=\"td_prenotazione\"><ul class=\"ul_prenotazione\">";

    col.forEach( value =>{
        let idHash = value.getAttribute("hash");
        let nome = value.getAttribute("value");
        newTD += "<li class=\"li_prenotazione\" name=\"" + idHash + "\">" + nome + "</li>";
    } );
    newTD += "</ul></td>";
    return newTD;
}

function caricaTD(col){
    let valueHash = col.attributes[0].value;
    let value = col.attributes[1].value;
    let newTD = "<td class=\"td_prenotazione\" name=\"" + valueHash +"\">";
    newTD += value;
    newTD += "</td>";
    return newTD;
}

function caricaTHs(xmlDoc){
    if(xmlDoc.childNodes.item(0).childNodes.length > 0){ 

        //Carico la colonna delle azioni
        let azioniHTMLTH = "<th class=\"th_prenotazione\">PREZZO</th>";
        document.getElementById("table_row_header_prenotazione").innerHTML = azioniHTMLTH;
        //childNodes.item(0) per entrare nel results
        xmlDoc.childNodes.item(0).childNodes.forEach( row =>{
            row.childNodes.forEach(col => {
                aggiungiTH(col.nodeName);
            });
        });
    }
}

function aggiungiTH(nomeColonna){
    let trh = document.getElementById("table_row_header_prenotazione");
    let oldTHs = trh.getElementsByClassName("th_prenotazione");
    for(let i = 0; i < oldTHs.length; i++){
        let oldTH = oldTHs.item(i);
        if(oldTH.innerHTML === nomeColonna){
            return;
        }
    }
    trh.innerHTML += "<th class=\"th_prenotazione\">" + nomeColonna + "</th>";
}

/**
 * Per abilitare lo scroll al tbody, ho dovuto configurare il diplay block ma ciò causa la
 * perdita dell'allineamento tra i th e i td.
 * Solo tramite JS si può rimediare completamente
 */
function allineaTabella(){
    let tableTHeadTHs = document.getElementById("table_row_header_prenotazione").querySelectorAll("th");
    if(tableTHeadTHs.length === 0){
        return;
    }
    let tableTBodyTDs = document.getElementsByClassName("tr_prenotazione");
    //L'istruzione a seguire scatena un TypeError Undefined non valido
    let h = parseInt(tableTHeadTHs[0].clientHeight)+8; //Aggiungo i 4px superiori e inferiori del bordo della tabella
    h = 'calc(100% - '+h+'px)';
    document.getElementById("tbody").style.maxHeight = h;
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