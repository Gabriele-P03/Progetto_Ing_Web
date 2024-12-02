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

function carica_ingredienti(pizzaSelezionata){
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
        xhttp.open('GET', '../../scripts/index.php/aggiunta/all?pizza='+pizzaSelezionata, true);
        xhttp.send();
    }else{
        svuotaListaIngredienti();
    }
    carica_tipo_aggiunta();
}

function svuotaListaIngredienti(){
    document.getElementById("show_aggiunte_pizza_selected_ul").innerHTML = "";
}

window.onload = function(){

    carica_allergeni();
    carica_pizze();
    cookie = getCookie();
    bloccaNumeroPersone();
    impostaMinDataAvvenimento();
    caricaUltimaPrenotazioneBozza();
}

let footer_arrow_state = true
function footer_up(){

    let arrow = document.getElementById("footer_arrow");
    let footer = document.getElementById("footer_info");

    if(footer_arrow_state){
        arrow.setAttribute("src", '../../resources/body/footer/footer_down.png');
        footer_arrow_state = false;
        footer.style.display = "block";
        footer.animate([
                {
                    transform: 'translateY(100%)'
                },
                {
                    transform: 'translateY(0%)'
                }
            ],{
                duration: 1000,
                iterations: 1
            }
        );
    }else{
        arrow.setAttribute("src", '../../resources/body/footer/footer_up.png');
        footer_arrow_state = true;
        footer.style.display = "none";
    }
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

function carica_tipo_aggiunta(){
    let fieldset = document.getElementById("fsprenota_tipoaggiunta_slidex_wrap_div");
    fieldset.innerHTML = "";
    const xhttp = new XMLHttpRequest();

    //Siccome gli allergeni sono selezionati esternamente, li inserisco in un array prima di entrare nei vari forEach
    var idHashAllergeni = getAllergeniIdHashAsParameters();
    console.log(idHashAllergeni);

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
                xmlDocAggiunta.childNodes.item(0).childNodes.forEach( function(aggiunta){
                    let idHashAggiunta = aggiunta.childNodes.item(0).textContent;
                    let etichetta = aggiunta.childNodes.item(1).textContent;
                    let prezzo = aggiunta.childNodes.item(2).textContent;
                    htmlAggiunta += "<div class=\"fs_tipoaggiunta_aggiunta_div>\"><input type=\"checkbox\" name=\"aggiunta_" + idHashAggiunta + "\" value=\"" + idHash + "\"><label for=\"aggiunta_" + idHashAggiunta +"\">" + etichetta + " - " + prezzo + "&euro;</label></div>";
                });  
                htmlAggiunta += "</div>";
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
    xhttp.open('GET', '../../scripts/index.php/tipoaggiunta/all', true);
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
    const putHTTP = XMLHttpRequest();
    putHTTP.setRequestHeader("Content-Type", "text/xml");
    putHTTP.open('PUT', '../../scripts/index.php?prenotazione=' + idHashPrenotazione, true);
    putHTTP.send(xml);
    return false;
}

function creaXMLFormOrdine(){
    xml = document.createElement("root");
    //Carico gli allergeni
    let inputs = document.getElementById("fs_prenota_allergeni_div").querySelectorAll("checkbox");
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
    for(let fs in fss){
        let legend = fs.getElementsByClassName("lg_fs_tipo_aggiunta").innertText;
        fsXML = document.createElement(legend);
        let divs = fs.getElementById("fs_tipoaggiunta_div_inner").getElementsByClassName("fs_tipoaggiunta_aggiunta_div");
        let inputs = divs.querySelectorAll("input");
        inputs.forEach( function(input){
            if(input.checked){
                aggiunta = document.createElement("aggiunta");
                aggiunta.setAttribute("hash", input.value);
                fsXML.appendChild(aggiunta);
            }
        });
        xml.appendChild(fsXML);
    }
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
        console.log("Prenotazione salvata");
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
    console.log("Cookie: " + decodedCookie);
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
    console.log("Caricando l'ultima prenotazione in bozza");
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

function controllaCookieRitornato(){

}