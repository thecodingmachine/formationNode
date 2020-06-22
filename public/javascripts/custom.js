var wsUri = 'ws://localhost:8080';
var output;
var myTurn = false;
var gameObject = null;
var myId = Math.floor(Math.random() * 1000000);

/**
 * SOCKET
 */
function init() {
  output = document.getElementById('output');
  websocket = new WebSocket(wsUri);
  websocket.onopen = function(evt) { onOpen(evt); };
  websocket.onclose = function(evt) { onClose(evt); };
  websocket.onmessage = function(evt) { onMessage(evt); };
  websocket.onerror = function(evt) { onError(evt); };
}

function onOpen(evt) {
  writeToScreen('CONNECTED', 'alert-success');
  doSend({msg: 'newUser', id: myId});
}

function onClose(evt) {
  writeToScreen('DISCONNECTED', 'alert-danger');
}

function onMessage(evt) {
  writeToScreen("RECEIVED : " + evt.data, 'alert-received');
  var data = JSON.parse(evt.data);
  if (gameObject && gameObject._id && gameObject._id !== data._id) {
    //console.error('wrong game')
  } else {
    gameObject = data;
    if (parseInt(gameObject.currentPlayer) === myId) {
      myTurn = true;
      writeToScreen('YOUR TURN', 'alert-success');
    } else {
      myTurn = false;
    }
    if (gameObject.user0 && gameObject.user1) {
      var colors = [];
      colors[gameObject.user0.id] = gameObject.user0.color;
      colors[gameObject.user1.id] = gameObject.user1.color;
      var obj;
      for (var index in gameObject.caseArray) {
        obj = gameObject.caseArray[index];
        document.getElementById(
            obj.caseName).style.backgroundColor = colors[obj.userId];

      }
    }
  }
}

function onError(evt) {
  writeToScreen(evt.data, 'alert-danger');
}

function doSend(message) {
  writeToScreen("SEND : " + JSON.stringify(message), 'alert-send');
  websocket.send(JSON.stringify(message));
}

function writeToScreen(message, type) {
  var pre = document.createElement('li');
  pre.style.wordWrap = 'break-word';
  pre.classList.add('collection-item');
  pre.classList.add(type);
  pre.innerHTML = message;
  output.insertBefore(pre, output.firstChild);
}

window.addEventListener('load', init, false);

/**
 * CLICK
 */
var anchors = document.getElementsByClassName('t-case');
for (var z = 0; z < anchors.length; z++) {
  var elem = anchors[z];
  elem.onclick = function(elem) {
    if (myTurn === true) {
      if (gameObject) {
        if (gameObject.caseArray && gameObject.caseArray.filter(
                (_item) => {
                  return _item.caseName === elem.id
                }).length !== 0) {
          writeToScreen('YOU CAN NOT PLAY HERE', 'alert-danger');
        } else {
          doSend({
            msg: 'gameAction',
            gameId: gameObject._id,
            caseName: elem.id,
            userId: myId
          });
        }
      }
    } else {
      writeToScreen('WAIT YOUR TURN', 'alert-danger');
    }
    return false;
  }.bind(this, elem);
}