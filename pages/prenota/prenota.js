//Carica gli allergeni

function carica_allergeni(){

    const xhttp = new XMLHttpRequest();
    xhttp.onload = function(){
        var XMLParser = new DOMParser();
        var xmlDoc = XMLParser.parseFromString(xhttp.responseText, "application/xml")
        let allergeni = document.getElementById("fs_prenota_allergeni_div");
        xmlDoc.childNodes.item(0).childNodes.forEach( function(row){
            row.childNodes.forEach( function(colValue){ //Inside row there are column->value
                let x = colValue.childNodes.item(0).textContent;
                let html = "<input type=\"checkbox\" name=\""+x+"\" value=\"" + x + "\"><label for=\""+x+"\">"+x+"</label><br>";
                allergeni.innerHTML += html;
            });
        });
        
    }
    xhttp.open('GET', '../../scripts/index.php/allergene/all', true);
    xhttp.send();
}

function carica_pizze(){
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function(){
        var XMLParser = new DOMParser();
        var xmlDoc = XMLParser.parseFromString(xhttp.responseText, "application/xml")
        let pizze = document.getElementById("select_base_pizza");
        xmlDoc.childNodes.item(0).childNodes.forEach( function(row){
            //row.childNodes.forEach( function(colValue){ //Inside row there are column->value
                let idHash = row.childNodes.item(0).textContent;
                let nome = row.childNodes.item(1).textContent;
                let html = "<option value=\"" + idHash + "\" name=\"" + nome + "\"/>";
                html += "<label for=\"" + nome + "\">" + nome + "<label/>";
                pizze.innerHTML += html;
            //});
        });
        
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
    xhttp.open('GET', '../../scripts/index.php/aggiunta/all?pizza='+pizzaSelezionata.value, true);
    xhttp.send();
}

window.onload = function(){

    carica_allergeni();
    carica_pizze();
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