window.onresize = function(){
    allineaTabella();
}
window.onload = function(){

    carica_allergeni();
    cookie = getCookie();
    bloccaNumeroPersone();
    impostaMinDataAvvenimento();
    caricaUltimaPrenotazioneBozza();
}

var idHashPrenotazione = "";

//Carica gli allergeni

function carica_allergeni(){

    const xhttp = new XMLHttpRequest();
    xhttp.onload = function(){
        var XMLParser = new DOMParser();
        var xmlDoc = XMLParser.parseFromString(xhttp.responseText, "application/xml");
        let allergeni = document.getElementById("fs_prenota_allergeni_div");
        xmlDoc.childNodes.item(0).childNodes.forEach( function(row){//Inside row there are column->value
                let idHash = row.childNodes.item(0).textContent;
                let name = row.childNodes.item(1).textContent;
                let html = "<input type=\"checkbox\" name=\""+idHash+"\" value=\"" + idHash + "\"><label for=\""+idHash+"\">"+name+"</label><br>";
                allergeni.innerHTML += html;
        });
        carica_pizze();
    }
    xhttp.open('GET', '../../scripts/index.php/allergene/all', true);
    xhttp.send();
}

function carica_pizze(){
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function(){
        impostaSelettoreBasePizza(xhttp);
    }
    xhttp.open('GET', '../../scripts/index.php/pizza/all', true);
    xhttp.send();
}

function carica_ingredienti(pizzaSelezionata, async = true){
    if(pizzaSelezionata != ""){ //Controllo dovuto al selected value della lista delle pizze
        const xhttp = new XMLHttpRequest();
        xhttp.onload = function(){
            var XMLParser = new DOMParser();
            var xmlDoc = XMLParser.parseFromString(xhttp.responseText, "application/xml")
            let pizze = document.getElementById("show_aggiunte_pizza_selected_ul");
            pizze.innerHTML = "";   //Resetta le lista interna, non facendolo, si accodano gli ingredienti a quelli della pizza precedente
            xmlDoc.childNodes.item(0).childNodes.forEach( function(row){
                    let nomeAggiunta = row.childNodes.item(0).textContent;
                    let html = "<li>" + nomeAggiunta + "</li>";
                    pizze.innerHTML += html;
            });
            
        }
        xhttp.open('GET', '../../scripts/index.php/aggiunta/all?pizza='+pizzaSelezionata, async);
        xhttp.send();
    }else{
        svuotaListaIngredienti();
    }
    carica_tipo_aggiunta(async);
}

function svuotaListaIngredienti(){
    document.getElementById("show_aggiunte_pizza_selected_ul").innerHTML = "";
}


/**
 * Funzione chiamata quando l'utente preme sul tasto Invia Allergeni
 * Essa esegue la GET per prendere le pizze che non contengono allergeni tra quelli indicati
 */
function filtraPizzeByAllergeni(){
    let allergeniParams = getAllergeniIdHashAsParameters();
    
    if(allergeniParams !== ""){
        const xhttp = new XMLHttpRequest();
        xhttp.onload = function(){
            impostaSelettoreBasePizza(xhttp);
        }
        xhttp.open('GET', '../../scripts/index.php/pizza/allergeni?'+allergeniParams, true);
        xhttp.send();
    }else{
        carica_pizze(); //Nessun allergene selezionato, allora eseguo la getAll delle pizze
    }
}

function impostaSelettoreBasePizza(pizzeInfoXHTTP){
    var XMLParser = new DOMParser();
    var xmlDoc = XMLParser.parseFromString(pizzeInfoXHTTP.responseText, "application/xml")
    let pizze = document.getElementById("select_base_pizza");
    pizze.innerHTML = "<option selected value> Seleziona una pizza </option>";
    xmlDoc.childNodes.item(0).childNodes.forEach( function(row){
        let idHash = row.childNodes.item(0).textContent;
        let nome = row.childNodes.item(1).textContent;
        let prezzo = row.childNodes.item(2).textContent;
        let html = "<option value=\"" + idHash + "\" name=\"" + nome + "\"/>";
        html += "<label for=\"" + nome + "\">" + nome  + " - " + prezzo + " &euro; <label/>";
        pizze.innerHTML += html;
    });
    //Svuota la lista degli ingredienti siccome vi è l'opzione di default
    svuotaListaIngredienti();
    carica_tipo_aggiunta();
    //carica_ingredienti(xmlDoc.childNodes.item(0).childNodes.item(0).childNodes.item(0).textContent);
}

function carica_tipo_aggiunta(async = true){
    let fieldset = document.getElementById("fsprenota_tipoaggiunta_slidex_wrap_div");
    fieldset.innerHTML = "";
    const xhttp = new XMLHttpRequest();

    //Siccome gli allergeni sono selezionati esternamente, li inserisco in un array prima di entrare nei vari forEach
    var idHashAllergeni = getAllergeniIdHashAsParameters();

    xhttp.onload = function(){
        var XMLParser = new DOMParser();
        var xmlDoc = XMLParser.parseFromString(xhttp.responseText, "application/xml");
        xmlDoc.childNodes.item(0).childNodes.forEach( function(tipoAggiuntaRow){

            let idHash = tipoAggiuntaRow.childNodes.item(0).textContent;
            let etichetta = tipoAggiuntaRow.childNodes.item(1).textContent;

            params = "tipoaggiunta="+encodeURIComponent(idHash);
            let pizzaSelector = document.getElementById("select_base_pizza");
            let pizzaSelectedIdHash = pizzaSelector.childNodes.item(pizzaSelector.selectedIndex).value;
            if(pizzaSelectedIdHash !== ""){
                params += "&pizza="+encodeURIComponent(pizzaSelectedIdHash);
            }
            if(idHashAllergeni !== ""){
                params += "&" + idHashAllergeni;
            }

            const xhttpAggiunta = new XMLHttpRequest();
            var htmlAggiunta = "<div class=\"fs_tipoaggiunta_div_inner\">";
            xhttpAggiunta.onload = function(){
                var XMLParserAggiunta = new DOMParser();
                var xmlDocAggiunta = XMLParserAggiunta.parseFromString(xhttpAggiunta.responseText, "application/xml");
                let tmp = "";
                xmlDocAggiunta.childNodes.item(0).childNodes.forEach( function(aggiunta){
                    let idHashAggiunta = aggiunta.childNodes.item(0).textContent;
                    let etichetta = aggiunta.childNodes.item(1).textContent;
                    let prezzo = aggiunta.childNodes.item(2).textContent;
                    tmp += "<div class=\"fs_tipoaggiunta_aggiunta_div\"><input type=\"checkbox\" name=\"aggiunta_" + idHashAggiunta + "\" value=\"" + idHashAggiunta + "\"><label for=\"aggiunta_" + idHashAggiunta +"\">" + etichetta + " - " + prezzo + "&euro;</label></div>";
                });  
                if(tmp === ""){
                    htmlAggiunta = "";
                }else{
                    htmlAggiunta += tmp + "</div>";
                }
            };
            //Di seguito verrà chiamata una GET sincrona...
            //Si presti attenzione al fatto che essa è chiamata all'interno di una GET asincrona!!!
            xhttpAggiunta.open('GET', '../../scripts/index.php/aggiunta/allfilter?' + params, false);
            xhttpAggiunta.send();
            if(htmlAggiunta !== ""){
                let html = "<div class=\"fs_tipoaggiunta_div_outer\"><fieldset class=\"fs_tipo_aggiunta\"><legend class=\"lg_fs_tipo_aggiunta\">" + etichetta + "</legend>" + htmlAggiunta + "</fieldset></div>";
                fieldset.innerHTML += html;
            }


        });
    }
    xhttp.open('GET', '../../scripts/index.php/tipoaggiunta/all', async);
    xhttp.send();
}

function getAllergeniIdHashAsParameters(){
    let allergeniParams = "";  //Conterrà i digest degli allergeni a mo' di query param
    let div = document.getElementById("fs_prenota_allergeni_div");
    let options = div.querySelectorAll("input");   //Prendo tutte le options
    let i = 0;
    options.forEach( (option) =>{ 
        if(option.checked){
            if(i > 0){
                allergeniParams += "&";
            }
            let encodedAllergeneValue = encodeURIComponent(option.value);   //Si ricorda che un parametro deve essere prima passato all'encoding
            allergeniParams += "allergene" + i++ + "=" + encodedAllergeneValue;
        }
    });
    return allergeniParams;
}

function salvaNuovaPizza(){
    xml = creaXMLFormOrdine();
    //var cookie = getCookie();
    const putHTTP = new XMLHttpRequest();
    if(idHashPrenotazione.length == 0){
        alert("Per poter salvare gli ordini devi prima inserire le informazioni della prenotazione");
        return;
    }
    putHTTP.onload = function(){
        caricaOrdiniPrenotazione();
    }
    putHTTP.open('POST', '../../scripts/index.php/ordine/save?prenotazione=' + idHashPrenotazione, true);
    putHTTP.setRequestHeader("Content-Type", "text/xml");
    putHTTP.send(new XMLSerializer().serializeToString(xml));
    return false;
}

function creaXMLFormOrdine(){
    xml = document.createElement("root");
    //Carico gli allergeni
    let inputs = document.getElementById("fs_prenota_allergeni_div").querySelectorAll("input");
    let allergeniXML = document.createElement("allergeni");
    inputs.forEach(element => {
        if(element.checked){
            let allergeneXML = document.createElement("allergene");
            allergeneXML.setAttribute("hash", element.value);
            allergeniXML.appendChild(allergeneXML);
        }
    });
    xml.appendChild(allergeniXML);
    let pizzaSelected = document.getElementById("select_base_pizza");
    let pizzaSelectedIdHash = pizzaSelected.value;
    //Creo l'elemento pizza e ne aggiungo l'idHash
    if(pizzaSelectedIdHash !== ""){
        let pizza = document.createElement("pizza");
        pizza.setAttribute("hash", pizzaSelectedIdHash);
        xml.appendChild(pizza);
    }

    //Prendo tutti i fieldset delle aggiunte
    let fss = document.getElementsByClassName("fs_tipo_aggiunta");
    let aggiunteXML = document.createElement("aggiunte");
    for(var i = 0; i < fss.length; i++){
        let fs = fss[i];
        let legend = fs.getElementsByClassName("lg_fs_tipo_aggiunta")[0].innerText;
        fsXML = document.createElement(legend);
        let inputs = fs.getElementsByClassName("fs_tipoaggiunta_div_inner")[0].querySelectorAll("input");
        inputs.forEach( function(input){
            if(input.checked){
                aggiunta = document.createElement("aggiunta");
                aggiunta.setAttribute("hash", input.value);
                fsXML.appendChild(aggiunta);
            }
        });
        aggiunteXML.appendChild(fsXML);
    }
    xml.appendChild(aggiunteXML);
    return xml;
}

/**
 * Viene chiamata quando vengono salvate le informazioni di una prenotazione
 * POST e PUT vengono discriminate in base al contenuto dell'hidden div  'id_prenotazione_hidden'
 */
function salvaPrenotazione(){
    //Scelgo se fare una post o una put
    let method = 'POST';
    if(idHashPrenotazione.length > 0){
        method = 'PUT';
    }
    var cookie = getCookie();  //usrcok concordato con backend PHP
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function(){
        if(method === 'POST'){  //Solo se post avrò il digest della prenotazione
            var XMLParser = new DOMParser();
            var xmlDoc = XMLParser.parseFromString(xhttp.responseText, "application/xml");
            idHashPrenotazione = xmlDoc.childNodes.item(0).childNodes.item(0).attributes[0].value;
        }
    }

    let path = '../../scripts/index.php/prenotazione/save';
    if(method === 'PUT'){
        path += "?prenotazione="+encodeURIComponent(idHashPrenotazione);
    }
    xhttp.open(method, path, true);
    xhttp.setRequestHeader("Content-Type", 'application/xml; charset=utf-8');
    let xml = infoPrenotazioneToXML();
    if(xml !== ""){ //Ritorna stringa vuota a causa di return
        xhttp.send(new XMLSerializer().serializeToString(xml));
    }
}

function getCookie(){
    //Prendo il cookie e ne eseguo il decoding al fine di bonificare da eventuali caratteri speciali
    let decodedCookie = document.cookie;    
    //Stringa vuota vuol dire dunque che non vi è un cookie con quel nome
    return decodedCookie;
}

function bloccaNumeroPersone(){
    let cbAsporto = document.getElementById("cb_asporto");
    let personeTextField = document.getElementById("tf_persone");
    if(cbAsporto.checked){
        personeTextField.innerText = "";    //Reset del numero
        personeTextField.disabled = true;
    }else{
        personeTextField.disabled = false;
    }
}

function impostaMinDataAvvenimento(){
    let datePicker = document.getElementById("date_dataavvenimento");
    datePicker.min = new Date().toISOString().split("T")[0];
}

function caricaUltimaPrenotazioneBozza(){
    var cookie = getCookie();  //usrcok concordato con backend PHP
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function(){
        var XMLParser = new DOMParser();
        var xmlDoc = XMLParser.parseFromString(xhttp.responseText, "application/xml");
        let row = xmlDoc.documentElement;
        if(row.childNodes.item(0).childNodes.length === 10){
            idHashPrenotazione = row.getElementsByTagName("ID_HASH")[0].textContent; //ID_HASH
            document.getElementById("nominativo_input").value = row.getElementsByTagName("NOME")[0].textContent;//Nominativo
            document.getElementById("date_dataavvenimento").value = row.getElementsByTagName("DATA_PRENOTAZIONE")[0].textContent;//Data avventimento
            document.getElementById("telefono_input").value = row.getElementsByTagName("TELEFONO")[0].textContent;  //Telefono

            let cb_asporto_value = row.getElementsByTagName("TIPO")[0].textContent;
            document.getElementById("cb_asporto").checked = cb_asporto_value;
            if(!cb_asporto_value){
                document.getElementById("tf_persone").value = row.getElementsByTagName("NUMERO_PERSONE")[0].textContent;
            }else{
                bloccaNumeroPersone();
            }
        }

        caricaOrdiniPrenotazione();
    }
    xhttp.open('GET', '../../scripts/index.php/prenotazione/continua', true);
    xhttp.send();

}

function infoPrenotazioneToXML(){

    //Prendo le info di asporto e numero persone
    let asportBool = document.getElementById("cb_asporto").checked;
    let numeroPers = 0;
    if(!asportBool){
        numeroPers = document.getElementById("tf_persone").value; 
        if(numeroPers === ""){
            alert("Se la prenotazione non è da asporto, devi mettere il quantitativo di persone");
            return "";
        }
    }

    //Adesso prendo telefono e data avvenimento
    let divTipo = document.getElementById('ordine_telefono_data_div');
    let telefono = divTipo.querySelectorAll("input")[0].value;
    let data = divTipo.querySelectorAll("input")[1].value;
    let nominativo = document.getElementById("info_ordine_nome_div").querySelector("input").value;

    if(telefono === ""){
        alert("Nessun numero di telefono inserito");
        return ""; 
    }
    if(data === ""){
        alert("Nessuna data inserita");
        return ""; 
    }
    if(nominativo === ""){
        alert("Nessun nominativo inserito");
        return ""; 
    }

    xml = document.createElement("root");
    
    asportoXML = document.createElement("asporto");
    asportoXML.setAttribute("value", asportBool);
    xml.appendChild(asportoXML);

    numeroXML = document.createElement("numero_persone");
    numeroXML.setAttribute("value", numeroPers);
    xml.appendChild(numeroXML);
    
    telefonoXML = document.createElement("telefono");
    telefonoXML.setAttribute("value", telefono);
    xml.appendChild(telefonoXML);

    dataXML = document.createElement("data");
    dataXML.setAttribute("value", data);
    xml.appendChild(dataXML);

    nomeXML = document.createElement("nome");
    nomeXML.setAttribute("value", nominativo);
    xml.appendChild(nomeXML);

    return xml;
}

/**
 * 
 * 
 * INIZIA LA PERTE INERENTE LA TABELLA DEGLI ORDINI DI UNA PRENOTAZIONE
 * 
 * 
 */

function caricaOrdiniPrenotazione(){
    if(idHashPrenotazione.length > 0){
        const xhttp = new XMLHttpRequest();
        xhttp.onload = function(){
            var XMLParser = new DOMParser();
            var xmlDoc = XMLParser.parseFromString(xhttp.responseText, "application/xml");
            caricaTHs(xmlDoc);
            caricaDati(xmlDoc);
            allineaTabella();
        };
        xhttp.open('GET', '../../scripts/index.php/ordine/get?prenotazione='+encodeURIComponent(idHashPrenotazione), true);
        xhttp.send();
    }
}

function caricaDati(xmlDoc){

    let table = document.getElementById("tabella_prenotazione").querySelector("tbody");
    let ths = document.getElementById("tabella_prenotazione").querySelectorAll("th"); //Prendo tutti gli header
    table.innerHTML = "";
    //item(0) per entrare nel root results
    //row è l'ordine
    xmlDoc.childNodes.item(0).childNodes.forEach( ordine =>{

        let idHashOrdine = ordine.getAttribute("hash");

        let newTR = "<tr class=\"tr_prenotazione\">"
        //Aggiungo i due tasti per le azioni
        newTR += "<td class=\"td_prenotazione\">"
        newTR += "<input class=\"azione_prenotazione_button\" type=\"button\" value=\"Modifica\" name=\"" + idHashOrdine + "\" onclick=popolaFormPerModifica(this)>";
        newTR += "<input class=\"azione_prenotazione_button\" type=\"button\" value=\"Elimina\" name=\"" + idHashOrdine + "\" onclick=cancellaOrdine(this)>";
        newTR += "</td>";

        //Salto la prima colonna essendo quella delle azioni
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
        table.innerHTML += newTR;
    });
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
        let azioniHTMLTH = "<th class=\"th_prenotazione\">AZIONI</th>";
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
    let tableTBodyTDs = document.getElementsByClassName("tr_prenotazione")[0];
    if(tableTBodyTDs !== undefined){
        document.getElementById("tabella_prenotazione").style.visibility = "visible";
        tableTBodyTDs = tableTBodyTDs.querySelectorAll("td");
    
        //Parte da 1 in modo da non prendere la colonna delle azioni
        for(let i = 0; i < tableTBodyTDs.length; i++){
            let th = tableTHeadTHs[i];
            let e = tableTBodyTDs[i];
            let w = e.scrollWidth-2-2;//.offsetWidth - e.style.marginLeft - e.style.marginRight;
            if(th.clientWidth > w){
                e.style.width = th.clientWidth + 'px';
            }else{
                th.style.width = w+'px';
            }
            if(i > 0){
                tableTHeadTHs[i].style.marginLeft = '2px';
            }
        }
    }else{
        document.getElementById("tabella_prenotazione").style.visibility = "hidden";
    }
}


var idHashOrdineModificando = "";
function popolaFormPerModifica(ordine){
    idHashOrdineModificando = ordine.name;
    let row = ordine.parentElement.parentElement;

    //Popolo gli allergeni
    //childNodes[2] prendo il td. childNodes[0] prendo la UL
    let allergeniIN = row.childNodes[2].childNodes[0];
    let allergeni = document.getElementById("fs_prenota_allergeni_div").querySelectorAll("input");
    for(let i = 0; i < allergeni.length; i++){
        let allergene = allergeni[i];
        allergene.checked = false;
        for(let i1 = 0; i1 < allergeniIN.childNodes.length; i1++){
            let allergeneIN = allergeniIN.childNodes[i1];
            if(allergeneIN.getAttribute("name") === allergene.getAttribute("name")){
                allergene.checked = true;
                break;
            }
        }
    }

    //prendo la pizza
    let pizza = row.childNodes[1];
    let value = (pizza.hasAttribute("name")) ? pizza.getAttribute("name") : "";
    document.getElementById("select_base_pizza").value = value;
    carica_ingredienti(value, false);

    let divTipoaggiunte = document.getElementById("fsprenota_tipoaggiunta_slidex_wrap_div");
    divTipoaggiunte = divTipoaggiunte.getElementsByClassName("fs_tipoaggiunta_div_outer");
    let ths = document.getElementById("table_row_header_prenotazione").getElementsByClassName("th_prenotazione");

    //Popolo le aggiunte
    //SAlto le azioni, la pizza e gli allergeni, e dunque parto da 3
    for(let i = 3; i < row.childNodes.length; i++){
        if(row.childNodes[i].childNodes.length > 0){
            let aggiunte = row.childNodes[i].childNodes[0].childNodes;
            let th = ths[i].innerHTML;//Prendo l'etichetta del tipo aggiunta relativa alla colonna in questione

            //Prendo il div delle aggiunte
            for(let i1 = 0; i1 < divTipoaggiunte.length; i1++){
                let fsCR = divTipoaggiunte[i1].getElementsByClassName("fs_tipo_aggiunta")[0];
                let legendFSCR = fsCR.getElementsByClassName("lg_fs_tipo_aggiunta")[0].innerText;
                if(legendFSCR === th){
                    //Ho trovato il fieldset giusto, lo popolo

                    let options = fsCR.querySelectorAll("input");
                    for(let i2 = 0; i2 < options.length; i2++){
                        options[i2].checked = false;
                        aggiunte.forEach(aggiunta => {
                            if(aggiunta.getAttribute("name") === options[i2].value){
                                options[i2].checked = true;
                            }
                        });
                    }

                    break;
                }
            }
        }
    }

    document.getElementById("salva_button").style.visibility = "hidden";
    document.getElementsByClassName("modifica_bottoni")[0].style.visibility = "visible";
    document.getElementsByClassName("modifica_bottoni")[1].style.visibility = "visible";
}

function cancellaOrdine(ordine){
    if(idHashOrdineModificando !== ""){
        if(idHashOrdineModificando === ordine.name){
            alert("Non puoi cancellare quest'ordine siccome è in fase di modifica");
            return;
        }
    }
    let confermato = confirm("Sei sicuro di voler eliminare quest'ordine?");
    if(confermato){
        let idHashOrdine = ordine.name;
        const xhttp = new XMLHttpRequest();
        xhttp.onload = function(){
            caricaOrdiniPrenotazione();
        }
        xhttp.open('DELETE', '../../scripts/index.php/ordine/delete?ordine='+idHashOrdine, true);
        xhttp.send();
    }
}

function annullaOrdine(){
    document.getElementById("salva_button").style.visibility = "visible";
    document.getElementsByClassName("modifica_bottoni")[0].style.visibility = "hidden";
    document.getElementsByClassName("modifica_bottoni")[1].style.visibility = "hidden";
    idHashOrdineModificando = "";
    resetForm();
}

function resetForm(){
    carica_allergeni();
}