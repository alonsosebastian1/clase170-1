AFRAME.registerComponent("create-botton",{
    init:function(){
        var botton1 = document.createElement("button");
        botton1.innerHTML="calificar";
        botton1.setAttribute("id","rating-botton");
        botton1.setAttribute("class","btn btn-warning mr-3");
        var botton2 = document.createElement("button");
        botton2.innerHTML="ordenar";
        botton2.setAttribute("id","order-botton");
        botton2.setAttribute("class","btn btn-warning mr-4");
        var buttonDiv = document.getElementById("button-div");
    buttonDiv.appendChild(botton1);
    buttonDiv.appendChild(botton2);
    }
})