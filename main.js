document.addEventListener("DOMContentLoaded", function(){

    let frasi_c = document.getElementsByTagName("li").length

    for(let i = 0; i < frasi_c; i++){
        let nomeLI = "li_aside_frasi_" + (i+1)
        let li = document.getElementById(nomeLI);
        if(i%2 == 1){
            li.style.textAlign = "right";
            li.animate(
                [
                    {
                        transform: 'translateX(-100%)'
                    },
                    {
                        transform: 'translateX(0%)'
                    }
                ],{
                    duration: 1000,
                    iterations: 1
                }
            )
        }else{
            li.style.textAlign = "left";
            li.animate(
                [
                    {
                        transform: 'translateX(100%)'
                    },
                    {
                        transform: 'translateX(0%)'
                    }
                ],{
                    duration: 1000,
                    iterations: 1
                }
            )
        }

    }
});


let footer_arrow_state = true
function footer_up(){

    let arrow = document.getElementById("footer_arrow");
    let footer = document.getElementById("footer_info");

    if(footer_arrow_state){
        arrow.setAttribute
        arrow.setAttribute("src", 'resources/body/footer/footer_down.png');
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
        arrow.setAttribute("src", 'resources/body/footer/footer_up.png');
        footer_arrow_state = true;
        footer.style.display = "none";
    }
    console.log(footer);
    console.log(footer_arrow_state);
}