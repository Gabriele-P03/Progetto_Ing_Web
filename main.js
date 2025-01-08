document.addEventListener("DOMContentLoaded", function(){

    let frasi_c = document.getElementsByTagName("li").length;

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