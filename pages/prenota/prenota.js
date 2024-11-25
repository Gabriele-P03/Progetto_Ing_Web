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
    xhttp.open('GET', '../../scripts/index.php/allergeni/all', true);
    xhttp.send();
}

window.onload = function(){

    carica_allergeni();
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