var sendButton = document.getElementById("getRequest");
var requestOption = document.getElementById("options");
var requestContent = document.getElementById("optionsContent");
var divContent = document.getElementById("content");
var tripMode = document.getElementById("trips");
var optionCollapse = true;
var finalResultLeaveTrip = [];
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
function createLabel(className, formObj, insertedTxt) {
    var tr = tableObj.insertRow(-1);
    tr.setAttribute("class", className);
    var trTxt = tr.insertCell(0);
    trTxt.innerHTML = insertedTxt;
}

//======================================================================================
tripMode.addEventListener("click", function() {
    var returnDateLabel = document.getElementById("returnDateLabel");
    var returnDate = document.getElementById("returnDate");
    
    if (document.getElementById("oneWay").checked) {
        returnDateLabel.setAttribute("style", "display: none");
    }
    else if (document.getElementById("roundTrip").checked) {   
        returnDateLabel.setAttribute("style", "display: block");
        returnDate.setAttribute("min", document.getElementById("leaveDate").value);  
        console.log(document.getElementById("leaveDate").value);
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
        stopValUser = document.getElementById("stopNum").value;
    
    if(document.getElementById("resultLeaveTrip") !== null) {
        var parent = document.getElementById("main");
        var child = document.getElementById("resultLeaveTrip");
        parent.removeChild(child);
    } 
    
    if(document.getElementById("resultReturnTrip") !== null) {
        var parent = document.getElementById("main");
        var child = document.getElementById("resultReturnTrip");
        parent.removeChild(child);
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
    

    if (maxPriceVal != "") {
        jsonRequestLeaveTrip.request["maxPrice"] = "USD" + maxPriceVal;
    };
/*    if (saleCountryVal != "") {
        jsonRequest.request["saleCountry"] = saleCountryVal.toUpperCase();
    }; */
    if (solutionsVal != "") {
        jsonRequestLeaveTrip.request["solutions"] = parseInt(solutionsVal);
        
        getData(jsonRequestLeaveTrip);
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

function getData(jsonRequestObj) {
    
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
                        console.log(document.getElementById("select_stopNum").value);
                        if (stops <= document.getElementById("select_stopNum").value) {
                            finalResult.push(results.trips.tripOption[i]);
                        }                        
                    }
                    
                    console.log(finalResult);
                    
                    var resultBr = document.createElement("br");
                    var resultForm = document.createElement("form");
                    var resultSelectButton = document.createElement("button");
                    
                    var resultTable = document.createElement("table");
                    var resultTableHeader = document.createElement("th");
                    
                    
                    for (var i = 0; i < finalResult.length; i++) {
                        stops = finalResult[i].slice[0].segment.length;
                        var resultTr = document.getElementById("resultTable");
                        createTr("options", resultTr, "Option#" + (i + 1));
                        createTr("price", resultTr, "Total Price: " + finalResult[i].saleTotal);
                        createTr("flightDuration", resultTr, "Flight Duration: " + finalResult[i].slice[0].duration + " mins");
                        for (var j = 0; j < stops; j++) {
                            createTr("iteration", resultTr, finalResult[i].slice[0].segment[j].flight.carrier + finalResult[i].slice[0].segment[j].flight.number + " from: " + finalResult[i].slice[0].segment[j].leg[0].origin + "-->" + "to: " + finalResult[i].slice[0].segment[j].leg[0].destination);
                            createTr("arrivalTime", resultTr, "Arrival Time: " + setLocaleTime(finalResult[i].slice[0].segment[j].leg[0].arrivalTime));
                            createTr("departureTime", resultTr, "Departure Time: " + setLocaleTime(finalResult[i].slice[0].segment[j].leg[0].departureTime));
                        }
                        
                    }
                    
                }
                else {
                    var resultTable = document.createElement("table");
                    var tableNode = document.createTextNode("No Result Was Found");
                    resultTable.appendChild(tableNode);
                    resultTable.setAttribute("id", "resultTable");
                    document.getElementById("resultContent").appendChild(resultTable);    
                }                
            }
            else {
                var resultTable = document.createElement("table");
                var tableNode = document.createTextNode("No Result Was Found");
                resultTable.appendChild(tableNode);
                resultTable.setAttribute("id", "resultTable");
                document.getElementById("resultContent").appendChild(resultTable);
                var resultTr = document.getElementById("resultTable").insertRow(i);
                var trText = resultTr.insertCell(0);
                trText.innerHTML = "Ooops!! Something went wrong..." + "</br>" + "Please Double Check Your Input Fields" + "</br>" + "HTTP status code: " + xhr.status;
            }
        }
        
    }
}
