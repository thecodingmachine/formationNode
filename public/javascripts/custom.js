var wsUri = "ws://localhost:3000";
var output;
var myTurn = false;
var gameObject = null;
var myId = Math.floor(Math.random()*1000000);

/**
 * SOCKET
 */
function init()
{
    output = document.getElementById("output");
    websocket = new WebSocket(wsUri);
    websocket.onopen = function(evt) { onOpen(evt) };
    websocket.onclose = function(evt) { onClose(evt) };
    websocket.onmessage = function(evt) { onMessage(evt) };
    websocket.onerror = function(evt) { onError(evt) };
}

function onOpen(evt)
{
    writeToScreen("CONNECTED");
    doSend({ msg : 'newUser', id : myId});
}

function onClose(evt)
{
    writeToScreen("DISCONNECTED");
}

function onMessage(evt)
{
    writeToScreen('<span style="color: blue;">RESPONSE: ' + evt.data+'</span>');
    var data = JSON.parse(evt.data);
    if(gameObject && gameObject._id && gameObject._id != data._id){
        //console.error('wrong game')
    } else {
        gameObject = data;
        if (gameObject.currentPlayer == myId) {
            myTurn = true;
            writeToScreen('<span style="color: green;">YOUR TURN</span> ');
        } else {
            myTurn = false;
        }
        if(gameObject.user0 && gameObject.user1){
            var colors = [];
            colors[gameObject.user0.id] = gameObject.user0.color;
            colors[gameObject.user1.id] = gameObject.user1.color;
            var obj;
            for (var index in gameObject.caseArray) {
                obj = gameObject.caseArray[index];
                document.getElementById(obj.caseName).style.backgroundColor = colors[obj.userId];

            }
        }
    }
}

function onError(evt)
{
    writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
}

function doSend(message)
{
    writeToScreen("SENT: " + JSON.stringify(message));
    websocket.send(JSON.stringify(message));
}

function writeToScreen(message)
{
    var pre = document.createElement("p");
    pre.style.wordWrap = "break-word";
    pre.innerHTML = message;
    output.appendChild(pre);
}

window.addEventListener("load", init, false);

/**
 * CLICK
 */
var anchors = document.getElementsByClassName('elp-case');
for(var z = 0; z < anchors.length; z++) {
    var elem = anchors[z];
    elem.onclick = function(elem) {
        if(myTurn == true){
            if(gameObject){
                if(gameObject.caseArray && gameObject.caseArray.filter(function (_item) {
                        return _item.caseName == elem.id
                    }).length != 0){
                    writeToScreen('<span style="color: red;">You CAN NOT PLAY HERE:</span> ');
                } else{
                    doSend({ msg : 'gameAction', gameId :gameObject._id, caseName : elem.id, userId : myId});
                }
            }
        }
        return false;
    }.bind(this, elem);
}