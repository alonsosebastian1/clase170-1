var tableNumber = null;
AFRAME.registerComponent("markerHandler",{
    init:async function(){
        if(tableNumber === null){
          this.askTableNumber();
        }
        var dishes = await this.getDishes();
        this.el.addEventListener("markerFound",()=>{
            if(tableNumber !== null){
                var markerId = this.el.id;
                this.handleMarkerFound(dishes,markerId);
            }
        });
        this.el.addEventListener("markerLost",()=>{
            this.handleMarkerLost();
        })
    },
    askTableNumber:function(){
        var iconUrl = "https://raw.githubusercontent.com/whitehatjr/menu-card-app/main/hunger.png";
        swal({
            title:"bienvenido a el antojo",
            icon:iconUrl,
            content:{
                element:"input",
                attributes:{placeholder:"escribe el numero de tu mesa",
            type:"number",
        min:1}
            },
          closeOnClickOutside:false,
        }).then(inputValue=>{
            tableNumber=inputValue
        })
    },
    handleMarkerFound:function(dishes,markerId){
        var toDaysDate = new Date();
        var toDaysDay = toDaysDate.getDay();
        var days=[
            "domingo",
            "lunes",
            "martes",
            "miercoles",
            "jueves",
            "viernes",
            "sabado"
        ]
        var dish=dishes.filter(dish=>dish.id === markerId)[0];
        if(dish.unavailable_days.include(days[toDaysDay])){
            swal({
                icon:"warning",
                title:dish.dish_name.toUpperCase(),
                text:"este platillo no esta disponible hoy",
                timer:2500,
                buttons:false
            })
        }else{
            var model = document.querySelector(`#model-${dish.id}`);
            model.setAttribute("position",dish.model_geometry.position);
            model.setAttribute("rotation",dish.model_geometry.rotation);
            model.setAttribute("scale",dish.model_geometry.scale);
            model.setAttribute("visible",true);
            var ingredientsContainer = document.querySelector(`#main-plane-${dish.id}`);
            ingredientsContainer.setAttribute("visible",true);

            var pricePlane = document.querySelector(`#price-plane-${dish.id}`);
            pricePlane.setAttribute("visible",true);

            var buttonDiv = document.getElementById("button-div");
            buttonDiv.style.display = "flex";

            var ratingButton = document.getElementById("rating-button");
            var orderButton = document.getElementById("order-button");

            if(tableNumber != null){
                ratingButton.addEventListener("click",function(){
                    swal({
                        icon:"warning",
                        title:"calificar platillo",
                        text:"procesando calificacion"
                    })
            })
            orderButton.addEventListener("click",()=>{
                var tNumber;
                tableNumber <= 9 ? (tNumber=`T0${tableNumber}`):`T${tableNumber}`;
                this.handleOrder(tNumber,dish);
                swal({
                    icon:"https://i.imgur.com/4NZ6uLY.jpg",
                    title:"gracias por tu orden",
                    text:"resiviras tu orden pronto",
                    timer:2000,
                    buttons:false
                })
             })
        }
     }
    },
    handleOrder:function(tNumber,dish){
        firebase
        .fireStore()
        .collection("tables")
        .doc(tNumber)
        .get()
        .then(doc =>{
            var details = doc.data();
            if(details["current_orders"][dish.id]){
                details["current_orders"][dish.id]["quantity"]+=1;
                var currentQuantity = details["current_orders"][dish.id]["quantity"];
                details["current_orders"][dish.id]["subtotal"] =
                currentQuantity*dish.price;
            }else{
                details["current_orders"][dish.id]={
                    item:dish.dish_name,
                    price:dish.price,
                    quantity:1,
                    subtotal:dish.price*1
                }
            }
          details.total += dish.price;
          firebase
          .fireStore()
          .collection("tables")
          .doc(doc.id)
          .update(details);
        })
    },
    getDishes:async function(){
        return await firebase
        .fireStore()
        .collection("dishes")
        .get()
        .then(snap=>{
            return snap.docs.map(doc=>doc.data());
        })
    },
    handleMarkerLost:function(){
        var buttonDiv = document.getElementById("button-div");
        buttonDiv.style.display="none";
    },
    

})
   