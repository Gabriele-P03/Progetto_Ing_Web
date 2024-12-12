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
            let i = 0;
            rows.forEach( row => {
                if(i++ === 0){
                    caricaTHs(row);
                }
                caricaPrenotazione(row);
            });
        }
    }

    xhttp.open('GET', '../../scripts/index.php/prenotazione/all', true);
    xhttp.send();
}

function caricaPrenotazione(row){
    var tbody = document.getElementsByTagName("tbody")[0];
    var newTR = "<tr class=\"tr_body\">";
    //Adesso inserisco i dati
    row.childNodes.forEach(col => {
        if(col.nodeName !== "ID_HASH"){
            let td = "<td class=\"td_storico\">";
            td += col.textContent;
            td += "</td>";
            newTR += td;
        }
    });
    newTR += "</tr>";
    tbody.innerHTML += newTR
}

function caricaTHs(row){
    var ths = document.getElementById("tr_header");
    ths.innerHTML = "";
    row.childNodes.forEach( col => {
        let nodeName = col.nodeName;
        if(nodeName !== "ID_HASH"){
            let th = "<th class=\"th_storico\">";
            th += nodeName;
            th += "</th>";
            ths.innerHTML += th;
        }
    });
}