var sendButton = document.getElementById("getRequest");
var requestOption = document.getElementById("options");
var requestContent = document.getElementById("optionsContent");
var divContent = document.getElementById("content");
var optionCollapse = true;
createSelections("adultNum");
createSelections("infantLapNum");
createSelections("infantSeatNum");
createSelections("childNum");
createSelections("seniorNum");

setMinDate();

function createSelections(id) {
    var form = document.getElementById(id);
    var selection = document.createElement("select");
    selection.setAttribute("id", "select_"+id);
    form.appendChild(selection);

    for (var i = 0; i < 10; i++) {
        var selectionOption = document.createElement("option");
        selectionOption.setAttribute("value", i);
        selectionOption.setAttribute("id", id+i);
        var selectionOptionText = document.createTextNode(i);
        selectionOption.appendChild(selectionOptionText);
        selection.appendChild(selectionOption);
    }

}

function setMinDate() {
    var currentDate = new Date();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    if (month < 10) {
        month = "0" + month.toString();
    } else {
        month = month.toString();
    }
    var minDate = year + "-" + month + "-" + day;
    document.getElementById("date").setAttribute("min", minDate);
}


requestOption.addEventListener("click", function() {
    
    optionCollapse = !optionCollapse;
    if(optionCollapse) {
        requestOption.setAttribute("class", "goog-zippy-header goog-zippy-collapsed");
        requestOption.setAttribute("aria-expanded", "false");
        requestContent.setAttribute("style", "margin-top: -120px;");     
        divContent.setAttribute("style", "overflow: hidden; display: none;");
    }
    else {
        requestOption.setAttribute("class", "goog-zippy-header goog-zippy-expanded");
        requestOption.setAttribute("aria-expanded", "true");
        requestContent.setAttribute("style", "margin-top: 0px;");
        divContent.setAttribute("style", "overflow: hidden;");
    }
})


sendButton.addEventListener("click", function() {
    
    var solutionsVal = document.getElementById("solution").value,
        maxPriceVal = document.getElementById("price").value,
        saleCountryVal = document.getElementById("country").value;
    /*
    
    jsonRequest = {
        request: {
             passengers: {
                adultCount: parseInt(document.getElementById("select_adultNum").value),
                infantInLapCount: parseInt(document.getElementById("select_infantLapNum").value),
                infantInSeatCount: parseInt(document.getElementById("select_infantSeatNum").value),
                childCount: parseInt(document.getElementById("select_childNum").value),
                seniorCount: parseInt(document.getElementById("select_seniorNum").value)
            },
            slice: [
                {
                    origin: document.getElementById("origin").value.toUpperCase(),
                    destination: document.getElementById("destination").value.toUpperCase(),
                    date: document.getElementById("date").value                
                }
            ],
            refundable: document.getElementById("refund").checked
        }
    }
    
    if (solutionsVal != "") {
        jsonRequest.request["solutions"] = parseInt(solutionsVal);
    };
    if (maxPriceVal != "") {
        jsonRequest.request["maxPrice"] = "USD" + maxPriceVal;
    };
    if (saleCountryVal != "") {
        jsonRequest.request["saleCountry"] = saleCountryVal.toUpperCase();
    };
    
*/
    jsonRequest = {
        request: {
             passengers: {
                adultCount: 1,
                infantInLapCount: 0,
                infantInSeatCount: 0,
                childCount: 0,
                seniorCount: 0
            },
            slice: [
                {
                    origin: "SAN",
                    destination: "SJC",
                    date: "2016-06-30"
                }
            ],
            refundable: document.getElementById("refund").checked,
            solutions: 5
        }
    }
    
    

    
    var holder = JSON.stringify(jsonRequest);
    //console.log(holder);
 
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://www.googleapis.com/qpxExpress/v1/trips/search?key=AIzaSyCdpM_bMNykHOs2j4HDfOSsgCR8TE5HCqE");
    xhr.setRequestHeader("Content-Type", "application/json");
    window.setTimeout(function() {
        console.log(xhr.readyState);
    }, 3000);
    xhr.onreadystatechange = function() {
        if ((xhr.readyState == 4) && (xhr.status == 200 || xhr.status == 304)) {
            var results = JSON.parse(xhr.responseText);
            var stops = 1;
            var resultDiv = document.createElement("div");
            var node = document.createTextNode("Airfare Results: ");
            resultDiv.appendChild(node);
            document.getElementById("main").appendChild(resultDiv);
            console.log(results.trips.tripOption);
            console.log("*********this is seperate line********");

            
            for (var i = 0; i < jsonRequest.request.solutions; i++) {
                
                stops = results.trips.tripOption[i].slice[0].segment.length;
                console.log("Total Price: " + results.trips.tripOption[i].saleTotal);
                console.log("flight duration: " + results.trips.tripOption[i].slice[0].duration + " mins");
                for (var j = 0; j < stops; j++) {                    
                    console.log(results.trips.tripOption[i].slice[0].segment[j].flight.carrier + results.trips.tripOption[i].slice[0].segment[j].flight.number + "-from: " + results.trips.tripOption[i].slice[0].segment[j].leg[0].origin + "-->" + "to: " + results.trips.tripOption[i].slice[0].segment[j].leg[0].destination);
                    console.log("arrival time: " + results.trips.tripOption[i].slice[0].segment[j].leg[0].arrivalTime);
                    console.log("departure time: " + results.trips.tripOption[i].slice[0].segment[j].leg[0].departureTime);
                }
                                
                console.log("*********this is seperate line********");
                
            }
          
        }
    }
    xhr.send(holder);
    

})
