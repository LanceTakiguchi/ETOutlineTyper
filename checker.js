console.log("checker.js")
document.addEventListener('DOMContentLoaded', function(event) {
    // console.log("Hello World")
    // const outline = JSON.parse(SourceOutline);

    // var request = new XMLHttpRequest();
    // request.open("GET", "../outline.json", false);
    // request.send(null)
    // var outline = JSON.parse(request.responseText);
    // alert (outline.result[0]);

    // var outline = 0;
    // $.getJSON('outline.json', function(data) {         
    //     outline = data;
    //     alert(outline);
    // });
    // console.log(outline);

    // var letterIndex = 0;
    // const outlineOrder = ["I"]

    // for(var section of outlineOrder){
    //     console.log(outline.outlineOrder[section])
    // }
    $.getJSON("../dev/outline.json", function(json) {
        console.log('get json')
        console.log(json); // this will show the info it in firebug console
    });

    // const userInput:string = document.getElementsByClassName("text-checker").value;
    // console.log(userInput);
})

const userInput = document.querySelector(".ice-cream");


selectElement.addEventListener("change", (event) => {
    result.textContent = `You like ${event.target.value}`;
  });