var API_KEY = 'abcdef';

function doGet(e) {
    if (!isAuthorized(e)) {
        return buildErrorResponse('not authorized');
    }

    if ('name' in e.parameters ){
        var name= e.parameters.name[0];
    }
    if ('surname' in e.parameters ){
        var surname= e.parameters.surname[0];
    }

    var listPax = readPax(name,surname);
    var listMsg = readMsg()
    var listLinks = readLinks()
    return buildSuccessResponse(listPax,listMsg, listLinks);

}
function isAuthorized(e) {
    return 'key' in e.parameters && e.parameters.key[0] === API_KEY;
}
function buildSuccessResponse(listPax,listMsg,listLink) {

    var output = JSON.stringify({
        status: 'success',
        pax: listPax,
        msg: listMsg,
        links: listLink

    });

    return ContentService.createTextOutput(output)
        .setMimeType(ContentService.MimeType.JSON);
}
function buildErrorResponse(message) {
    var output = JSON.stringify({
        status: 'error',
        message: message
    });

    return ContentService.createTextOutput(output)
        .setMimeType(ContentService.MimeType.JSON);
}


function compare(fullName,query){
    var fullNameLower = fullName.toLowerCase();
    var queryLower = query.toLowerCase();

    if ( fullNameLower.indexOf(queryLower) != -1){
        return true;
    }
    else{
        return false;
    }
}


function readPax(queryName, querySurname){

    var SPREADSHEET_ID = '1chrzz9C-cFUz-BzayC64vaafCzdUEMov3zLn4lYxBpE';
    var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    var ws = spreadsheet.getSheets()[0];
    if (ws == null){
        return "Can't access spreadsheet"
    }

    var matchingListObj = [];

    for (var r = 2; r<300;r++){ //od 2 bo pierwszy wiersz jest infromacją
        if (compare(JSON.stringify(ws.getRange(r, 1).getValue()),queryName) && compare(JSON.stringify(ws.getRange(r, 2).getValue()),querySurname)){
            var newMatch = {
                "name": ws.getRange(r, 1).getValue(),
                "surname": ws.getRange(r, 2).getValue(),
                "lbg":ws.getRange(r, 3).getValue(),
                "appliedAs": ws.getRange(r, 4).getValue(),
                "studentDorm": ws.getRange(r, 5).getValue(),
                "dormNr": ws.getRange(r, 6).getValue(),
                "WSOOD": ws.getRange(r, 7).getValue(),
                "lunchOOD" : ws.getRange(r, 8).getValue(),
                "busNr" : ws.getRange(r, 9).getValue(),
                "canteen" : ws.getRange(r, 10).getValue(),
                "houseNr" : ws.getRange(r, 11).getValue(),
                "roomNr" :  ws.getRange(r, 12).getValue(),
                "plenarySession" :  ws.getRange(r, 13).getValue()
            }
            matchingListObj.push(newMatch);
        }
    }
    return matchingListObj;

}




function countNotEmptyRows(ws,colNumber){
    var i =1;
    var empty = false
    while (!empty){
        empty = true;
        for (var col = 1;col<=colNumber; col++){
            if(ws.getRange(i, col).getValue()!=""){
                empty = false;
            }
        }
        i++;
    }
    return i-2;
}

function readMsg(){

    var SPREADSHEET_ID = '1chrzz9C-cFUz-BzayC64vaafCzdUEMov3zLn4lYxBpE';
    var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    var ws = spreadsheet.getSheets()[1];
    if (ws == null){
        return "Can't access spreadsheet"
    }
    var rowTotal = countNotEmptyRows(ws,3);
    var matchingListObj = [];

    for (var r = 2; r<=rowTotal;r++){ //od 2 bo pierwszy wiersz jest infromacją
        var newMatch = {
            "title": ws.getRange(r, 1).getValue(),
            "message": ws.getRange(r, 2).getValue(),
            "date":ws.getRange(r, 3).getValue(),
        }
        matchingListObj.push(newMatch);
    }

    return matchingListObj;
}


function readLinks(){

    var SPREADSHEET_ID = '1chrzz9C-cFUz-BzayC64vaafCzdUEMov3zLn4lYxBpE';
    var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    var ws = spreadsheet.getSheets()[2];
    if (ws == null){
        return "Can't access spreadsheet"
    }
    var rowTotal = countNotEmptyRows(ws,3);
    var matchingListObj = [];

    for (var r = 2; r<=rowTotal;r++){ //od 2 bo pierwszy wiersz jest infromacją
        var newMatch = {
            "title": ws.getRange(r, 1).getValue(),
            "url": ws.getRange(r, 2).getValue(),
            "description":ws.getRange(r, 3).getValue(),
        }
        matchingListObj.push(newMatch);
    }

    return matchingListObj;
}


function test(){
    name="Agnieszka"
    surname=""
    var listPax = readPax(name,surname);
    var listMsg = readMsg();
    var listLink = readLinks();
    var output = JSON.stringify({
        status: 'success',
        pax: listPax,
        msg: listMsg,
        links: listLink

    });

    Logger.log(output);

}
