let x = 0
window.onload = function() {
    while(x < 50){
        x++;
        console.log(x)
        document.getElementById("img_striscione").transform= 'translate(${x}px, 0px)' ; 
    }
}