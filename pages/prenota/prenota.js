//Carica gli allergeni

function carica_allergeni(){

    const xhttp = new XMLHttpRequest();
    xhttp.onload = function(){
        var XMLParser = new DOMParser();
        var xmlDoc = XMLParser.parseFromString(xhttp.responseText, "application/xml")
        let allergeni = document.getElementById("fs_prenota_allergeni");
        xmlDoc.childNodes.item(0).childNodes.forEach( function(row){
            row.childNodes.forEach( function(colValue){ //Inside row there are column->value
                let x = colValue.childNodes.item(0).textContent;
                let html = "<input type=\"checkbox\" name=\""+x+"\" value=\"" + x + "\"><label for=\""+x+"\">"+x+"</label><br>";
                allergeni.innerHTML += html;
            });
        });
        
    }
    xhttp.open('GET', '../../scripts/index.php/allergeni/all', true);
    xhttp.send();
}

window.onload = function(){

    carica_allergeni();
}