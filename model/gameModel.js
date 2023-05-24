var mongoose = require('mongoose');

var schema = new mongoose.Schema(
    {
      user0: mongoose.Schema.Types.Mixed,
      user1: mongoose.Schema.Types.Mixed,
      caseArray: [mongoose.Schema.Types.Mixed],
      currentPlayer: Number,
      wonBy: Number,
      wonColor: String,
    }
);

schema.methods.initGame = function(user0, user1) {
  if (user0 && user1) {
    this.user0 = user0;
    this.user1 = user1;
    this.caseArray = [];
    var rand = Math.floor(Math.random() * 100);
    if (rand % 2 === 0) {
      this.currentPlayer = this.user0.id;
      this.user0.color = 'red';
      this.user1.color = 'yellow';
    } else {
      this.currentPlayer = this.user1.id;
      this.user0.color = 'yellow';
      this.user1.color = 'red';
    }
  }
};

schema.methods.checkWinners = function() {
  let map = {};

  for (var i = 0; i < this.caseArray.length; i++) {

    const currentCase = this.caseArray[i];
    const currentCasePosition = currentCase.caseName.replace('case', '');

    const currentPosX = currentCasePosition[0];
    const currentPosY = currentCasePosition[1];
    if (!map[currentPosX]) {
      map[currentPosX] = {};
    }
    map[currentPosX][currentPosY] = currentCase.userId;
  }
  for (var key in map) {
    const currentLine = map[key];
    console.log(currentLine);
    if (Object.keys(currentLine).length !== 3) {
      continue;
    }
    let lastPlayerCase = null;
    let totalSuccess = 0;
    console.log(currentLine);
    for (var keyLine in currentLine) {
      if (lastPlayerCase && lastPlayerCase !== currentLine[keyLine]) {
        continue;
      }
      lastPlayerCase = currentLine[keyLine];
      totalSuccess++;
    }
    if (totalSuccess === 3) {
      return lastPlayerCase;
    }
  }
  return null;
}

schema.methods.gameAction = function(userId, caseName) {
  if (this.wonBy) {
    return;
  }
  if (userId === parseInt(this.currentPlayer)) {
    if (!this.caseArray) {
      this.caseArray = [];
    }
    if (this.caseArray.filter(function(item) {
          return item.caseName === caseName;
        }).length !== 0) {
      console.error('try to overwrite');
    } else {
      this.caseArray.push({
        caseName: caseName,
        userId: userId
      });
      this.wonBy = this.checkWinners();
      if (this.wonBy) {
        this.wonColor = this.wonBy === this.user0.id ? this.user0.color : this.user1.color;
      }
      if (this.currentPlayer) {
        if (parseInt(this.currentPlayer) === this.user0.id) {
          this.currentPlayer = this.user1.id;
        } else if (parseInt(this.currentPlayer) === this.user1.id) {
          this.currentPlayer = this.user0.id;
        } else {
          console.error('the value of current player is incorrect');
        }
      } else {
        console.error('currentPlayer must be init');
      }
    }
  } else {
    console.error('wrong current player');
  }

};

schema.set('versionKey', false);
module.exports = mongoose.model('Game', schema);

