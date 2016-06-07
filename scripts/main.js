var sendButton = document.getElementById("getRequest");
var requestOption = document.getElementById("options");
var requestContent = document.getElementById("optionsContent");
var divContent = document.getElementById("content");
var tripMode = document.getElementById("trips");
var optionCollapse = true;
createSelections("adultNum", 10, 1);
createSelections("childNum", 10);
createSelections("stopNum", 4, 0);
setMinDate();

//======================================================================================
function createSelections(id, numOfOptions, defaultVal) {
    var form = document.getElementById(id);
    var selection = document.createElement("select");
    selection.setAttribute("id", "select_"+id);
    form.appendChild(selection);

    for (var i = 0; i < numOfOptions; i++) {
        var selectionOption = document.createElement("option");
        selectionOption.setAttribute("value", i);
        selectionOption.setAttribute("id", id+i);
        var selectionOptionText = document.createTextNode(i);
        selectionOption.appendChild(selectionOptionText);
        selection.appendChild(selectionOption);
    }
    
    if (defaultVal) {
        var temp = document.getElementById(id+defaultVal);
        temp.setAttribute("selected", "selected");
    }

}

//======================================================================================
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
    if (day < 10) {
        day = "0" + day.toString();
    } else {
        day = day.toString();
    }
    var minDate = year + "-" + month + "-" + day;
    document.getElementById("leaveDate").setAttribute("min", minDate);
    document.getElementById("leaveDate").setAttribute("value", minDate);
    document.getElementById("returnDate").setAttribute("min", minDate);
}

//======================================================================================
function setLocaleTime(timeStr) {
    timeStr = timeStr.replace("T", " ");
    var idx_cal = timeStr.lastIndexOf(":");
    var hr_cal = parseInt(timeStr.substr((idx_cal-3), 3));
    timeStr = timeStr.slice(0, idx_cal-3) + " UTC " + timeStr.slice(idx_cal-3);
    return timeStr;
    
}

//======================================================================================
function buildResultBlock(Element, attribute, attributeVal, parentNode, infoTxt) {
    var myElement = document.createElement(Element);
    myElement.setAttribute(attribute, attributeVal);
    var myDivResults = document.createElement("div");
    myDivResults.setAttribute("class", "divResults");
    if (infoTxt !== undefined) {
        var txtNode = document.createTextNode(infoTxt);
        myElement.appendChild(txtNode);
    }    
    myDivResults.appendChild(myElement);
    parentNode.appendChild(myDivResults);
}

//======================================================================================
tripMode.addEventListener("click", function() {
    var returnDateLabel = document.getElementById("returnDateShown");
    var returnDate = document.getElementById("returnDate");
    
    if (document.getElementById("oneWay").checked) {
        returnDateLabel.setAttribute("style", "display: none");
    }
    else if (document.getElementById("roundTrip").checked) {   
        returnDateLabel.setAttribute("style", "display: block");
        returnDate.setAttribute("min", document.getElementById("leaveDate").value);  
        console.log(document.getElementById("leaveDate").value);
        document.getElementById("returnDateDiv").style.backgroundColor = "yellow";
        window.setTimeout(function() {
            document.getElementById("returnDateDiv").style.backgroundColor = "azure";    
        }, 300);
        
    }
})

//======================================================================================
requestOption.addEventListener("click", function() {
    
    optionCollapse = !optionCollapse;
    if(optionCollapse) {
        requestOption.setAttribute("aria-expanded", "false");
        //requestContent.setAttribute("style", "margin-top: -10px;");     
        divContent.setAttribute("style", "overflow: hidden; display: none;");
    }
    else {
        requestOption.setAttribute("aria-expanded", "true");
        //requestContent.setAttribute("style", "margin-top: 0px;");
        divContent.setAttribute("style", "overflow: hidden;");
    }
})

//======================================================================================
sendButton.addEventListener("click", function() {
    
    var solutionsVal = document.getElementById("solution").value,
        maxPriceVal = document.getElementById("price").value,
        //saleCountryVal = document.getElementById("country").value,
        stopValUser = document.getElementById("stopNum").value,
        leaveTripNode = document.getElementById("resultLeaveTrip"),
        returnTripNode = document.getElementById("resultReturnTrip");
    
    while (leaveTripNode.firstChild) {
        leaveTripNode.removeChild(leaveTripNode.firstChild);
    }
    
    while (returnTripNode.firstChild) {
        returnTripNode.removeChild(returnTripNode.firstChild);
    }

    jsonRequestLeaveTrip = {
        request: {
             passengers: {
                adultCount: parseInt(document.getElementById("select_adultNum").value),
                //infantInLapCount: parseInt(document.getElementById("select_infantLapNum").value),
                //infantInSeatCount: parseInt(document.getElementById("select_infantSeatNum").value),
                childCount: parseInt(document.getElementById("select_childNum").value),
                //seniorCount: parseInt(document.getElementById("select_seniorNum").value)
            },
            slice: [
                {
                    origin: document.getElementById("origin").value.toUpperCase(),
                    destination: document.getElementById("destination").value.toUpperCase(),
                    date: document.getElementById("leaveDate").value                
                }
            ],
            refundable: document.getElementById("refund").checked
        }
    }
    
    
    
    if (document.getElementById("roundTrip").checked) {
        jsonRequestReturnTrip = {
            request: {
                passengers: {
                    adultCount: parseInt(document.getElementById("select_adultNum").value),
                    //infantInLapCount: parseInt(document.getElementById("select_infantLapNum").value),
                    //infantInSeatCount: parseInt(document.getElementById("select_infantSeatNum").value),
                    childCount: parseInt(document.getElementById("select_childNum").value),
                    //seniorCount: parseInt(document.getElementById("select_seniorNum").value)
                },
            slice: [
                {
                    origin: document.getElementById("destination").value.toUpperCase(),
                    destination: document.getElementById("origin").value.toUpperCase(),
                    date: document.getElementById("returnDate").value                
                }
            ],
            refundable: document.getElementById("refund").checked
            }
        }
    }
    
    //if(document.getElementById)
    

    if (maxPriceVal != "" && document.getElementById("oneWay").checked) {
        jsonRequestLeaveTrip.request["maxPrice"] = "USD" + maxPriceVal;
    }
    else if (maxPriceVal != "" && document.getElementById("roundTrip").checked) {
        jsonRequestLeaveTrip.request["maxPrice"] = "USD" + maxPriceVal;
        jsonRequestReturnTrip.request["maxPrice"] = "USD" + maxPriceVal;
    };

    if (solutionsVal != "" && document.getElementById("oneWay").checked) {
        jsonRequestLeaveTrip.request["solutions"] = parseInt(solutionsVal);
        getData(jsonRequestLeaveTrip, "resultLeaveTrip", "leave");
        
        console.log(jsonRequestLeaveTrip);
    }
    else if (solutionsVal != "" && document.getElementById("roundTrip").checked) {
        jsonRequestLeaveTrip.request["solutions"] = parseInt(solutionsVal);
        jsonRequestReturnTrip.request["solutions"] = parseInt(solutionsVal);
        
        console.log(jsonRequestLeaveTrip);
        console.log(jsonRequestReturnTrip);
        
        getData(jsonRequestLeaveTrip, "resultLeaveTrip", "Leave");
        getData(jsonRequestReturnTrip, "resultReturnTrip", "Return");
    }
    else {
        alert("Please tell me the max number of results you want to know");
    };
    /* for quick debugging purpose
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
    
    */


})

//======================================================================================

function getData(jsonRequestObj, targetDivID, tripDirection) {
    var finalResult = [];
    console.log(jsonRequestObj);
    
    
    var holder = JSON.stringify(jsonRequestObj);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://www.googleapis.com/qpxExpress/v1/trips/search?key=AIzaSyCdpM_bMNykHOs2j4HDfOSsgCR8TE5HCqE");
    xhr.setRequestHeader("Content-Type", "application/json");
    
    for (var idx = 0; idx < document.getElementsByClassName("line").length; idx++) {
            document.getElementsByClassName("line")[idx].style.display = "inline-block";    
    } 

    xhr.send(holder);
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            //create result block
            for (var idx = 0; idx < document.getElementsByClassName("line").length; idx++) {
                document.getElementsByClassName("line")[idx].style.display = "none";    
            }
                        
            if (xhr.status == 200 || xhr.status == 304) {
                var results = JSON.parse(xhr.responseText);
                console.log(results);
                var stops = 0;
                var resultText = "";   
                
                if (results.trips.tripOption !== undefined) {
                    var numResults = results.trips.tripOption.length;
                    
                    
                    for (var i = 0; i < numResults; i++) {
                        stops = results.trips.tripOption[i].slice[0].segment.length - 1;
                        if (stops <= document.getElementById("select_stopNum").value) {
                            finalResult.push(results.trips.tripOption[i]);
                        }                        
                    }
                    
                    console.log(finalResult);
                    
                    if (finalResult.length < 1 && document.getElementById("resultLeaveTrip").firstChild == null) {
                        buildResultBlock("h3", "id", tripDirection + "h3", document.getElementById("resultLeaveTrip"), "Sorry... No result was found. Please add more stops.");
                    }
                    else {
                        for (var i = 0; i < finalResult.length; i++) {
                            stops = finalResult[i].slice[0].segment.length - 1;

                            var myForm = document.createElement("form");
                            myForm.setAttribute("id", tripDirection + "Trip" + (i + 1));
                            var myFieldSet = document.createElement("fieldset");
                            myFieldSet.setAttribute("id", tripDirection + "Fieldset" + (i + 1));
                            var myLegend = document.createElement("legend");
                            var legendTxt = document.createTextNode(tripDirection + "Option" + (i + 1));
                            myLegend.appendChild(legendTxt);
                            myFieldSet.appendChild(myLegend);
                            myForm.appendChild(myFieldSet);
                            document.getElementById(targetDivID).appendChild(myForm);

                            buildResultBlock("button", "id", tripDirection + "button" + (i + 1), myFieldSet, "Select");


                            //var myDiv = document.createElement("div");
                            //myDiv.setAttribute("class", "divButton");
                            //var myButton = document.createElement("button");
                            //myButton.setAttribute("id", "button" + (i + 1));
                            //var buttonTxt = document.createTextNode("Select" + (i + 1));
                            //myButton.appendChild(buttonTxt);
                            //myDiv.appendChild(myButton);
                            //myFieldSet.appendChild(myDiv);

                            buildResultBlock("label", "class", "priceOption" + (i + 1), myFieldSet, "Price: " + finalResult[i].saleTotal);
                            buildResultBlock("label", "class", "durationOption" + (i + 1), myFieldSet, "Flight Duration: " + finalResult[i].slice[0].duration + " mins");
                            for (var j = 0; j <= stops; j++) {
                                buildResultBlock("ul", "id", tripDirection + "Stop" + (i + 1) + (j + 1), myFieldSet);
                                buildResultBlock("li", "id", tripDirection + "ListOfStop" + (i + 1) + (j + 1), document.getElementById(tripDirection + "Stop" + (i + 1) + (j + 1)), finalResult[i].slice[0].segment[j].flight.carrier + finalResult[i].slice[0].segment[j].flight.number + " from: " + finalResult[i].slice[0].segment[j].leg[0].origin + "-->" + "to: " + finalResult[i].slice[0].segment[j].leg[0].destination);
                                buildResultBlock("p", "class", "departingTime", document.getElementById(tripDirection + "ListOfStop" + (i + 1) + (j + 1)), "Departure Time: " + setLocaleTime(finalResult[i].slice[0].segment[j].leg[0].departureTime));
                                buildResultBlock("p", "class", "arrivalTime", document.getElementById(tripDirection + "ListOfStop" + (i + 1) + (j + 1)), "Arrival Time: " + setLocaleTime(finalResult[i].slice[0].segment[j].leg[0].arrivalTime));

                            }


                            /*

                            createTr("options", resultTr, "Option#" + (i + 1));
                            createTr("price", resultTr, "Total Price: " + finalResult[i].saleTotal);
                            createTr("flightDuration", resultTr, "Flight Duration: " + finalResult[i].slice[0].duration + " mins");
                            for (var j = 0; j < stops; j++) {
                                createTr("iteration", resultTr, finalResult[i].slice[0].segment[j].flight.carrier + finalResult[i].slice[0].segment[j].flight.number + " from: " + finalResult[i].slice[0].segment[j].leg[0].origin + "-->" + "to: " + finalResult[i].slice[0].segment[j].leg[0].destination);
                                createTr("arrivalTime", resultTr, "Arrival Time: " + setLocaleTime(finalResult[i].slice[0].segment[j].leg[0].arrivalTime));
                                createTr("departureTime", resultTr, "Departure Time: " + setLocaleTime(finalResult[i].slice[0].segment[j].leg[0].departureTime));
                            }
                            */
                        }
                    }
                }
                else {
                    var resultTable = document.createElement("table");
                    var tableNode = document.createTextNode("No Result Was Found");
                    resultTable.appendChild(tableNode);
                    resultTable.setAttribute("id", "resultTable");
                    document.getElementById(targetDivID).appendChild(resultTable);    
                }                
            }
            else {
                var resultTable = document.createElement("table");
                var tableNode = document.createTextNode("No Result Was Found");
                resultTable.appendChild(tableNode);
                resultTable.setAttribute("id", "resultTable");
                document.getElementById("resultLeaveTrip").appendChild(resultTable);
                var resultTr = document.getElementById("resultTable").insertRow(i);
                var trText = resultTr.insertCell(0);
                trText.innerHTML = "Ooops!! Something went wrong..." + "</br>" + "Please Double Check Your Input Fields" + "</br>" + "HTTP status code: " + xhr.status;
                document.getElementById(targetDivID).appendChild(resultTable);
            }
        }
        
    }
}
