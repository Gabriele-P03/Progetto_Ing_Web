//Carica gli allergeni

function carica_allergeni(){

    const xhttp = new XMLHttpRequest();
    xhttp.onload = function(){
        var XMLParser = new DOMParser();
        var xmlDoc = XMLParser.parseFromString(xhttp.responseText, "application/xml")
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
    carica_tipo_aggiunta();
}

window.onload = function(){

    carica_allergeni();
    carica_pizze();
    //carica_tipo_aggiunta();
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
    pizze.innerHTML = "";
    xmlDoc.childNodes.item(0).childNodes.forEach( function(row){
        let idHash = row.childNodes.item(0).textContent;
        let nome = row.childNodes.item(1).textContent;
        let prezzo = row.childNodes.item(2).textContent;
        let html = "<option value=\"" + idHash + "\" name=\"" + nome + "\"/>";
        html += "<label for=\"" + nome + "\">" + nome  + " - " + prezzo + " &euro; <label/>";
        pizze.innerHTML += html;
    });
    carica_ingredienti(xmlDoc.childNodes.item(0).childNodes.item(0).childNodes.item(0).textContent);
}

function carica_tipo_aggiunta(){
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
                params += idHashAllergeni;
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
                    console.log(htmlAggiunta);
                });  
                htmlAggiunta += "</div>";
            };
            //Di seguito verrà chiamata una GET sincrona...
            //Si presti attenzione al fatto che essa è chiamata all'interno di una GET asincrona!!!
            xhttpAggiunta.open('GET', '../../scripts/index.php/aggiunta/allfilter?' + params, false);
            xhttpAggiunta.send();
            console.log(htmlAggiunta);
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