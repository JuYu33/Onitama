import React, {Component} from 'react';
import ReactDOM from 'react-dom';
//import App from './App';
//import ReactFancybox from 'react-fancybox';
import './index.css';

const tiger = require('./img/tiger.png');
const crab = require('./img/crab.png');
const monkey = require('./img/monkey.png');
const crane = require('./img/crane.png');
const dragon = require('./img/dragon.png');
const elephant = require('./img/elephant.png');
const mantis = require('./img/mantis.png');
const boar = require('./img/boar.png');
const frog = require('./img/frog.png');
const goose = require('./img/goose.png');
const horse = require('./img/horse.png');
const eel = require('./img/eel.png');
const rabbit = require('./img/rabbit.png');
const rooster = require('./img/rooster.png');
const ox = require('./img/ox.png');
const cobra = require('./img/cobra.png');
const regexO = /[oO]/

const Square = (props) => (
  <button className={props.active} onClick={() => props.onClick()}>
    {props.value}
  </button>
)

const Start = (props) => (
  <button onClick={() => props.onClick()}>
    Game Start
  </button>
)

const SelectableCard = (props) => (
  <div className={props.className}  onClick={() => props.onClick()}>
    <h1 className="card-name">{props.card}</h1>
    <div className="lineup">
      <img src={props.src}/> 
    </div>
  </div>
)

const Card = (props) => (
<div className={props.className}>
  <h1 className="card-name">{props.card}</h1>
  <div className="lineup">
    <img src={props.src}/> 
  </div>
</div>
)

class Board extends Component {
  constructor() {
    super();
    this.state = {
      squares: [['x','x','X','x','x'],
                ['','','','',''],
                ['','','','',''],  
                ['','','','',''],
                ['o','o','O','o','o']],
      positionO: [4,2],
      cards:  {
                tiger: [[0,2], [0,-1]],
                crab: [[-2,0], [0,1], [2,0]],
                monkey: [[-1,1], [1,1], [-1,-1], [1,-1]],
                crane: [[0,1], [-1,-1], [1,-1]],
                dragon: [[-2,1],[-1,-1],[1,-1],[2,1]],
                elephant: [[-1,1],[-1,0],[1,1],[1,0]],
                mantis: [[-1,1],[0,-1],[1,1]],
                boar: [[-1,0],[0,1],[1,0]],
                frog: [[-2,0], [-1,1], [1,-1]],
                goose: [[-1,1], [-1,0], [1,0], [1,-1]],
                horse: [[-1,0], [0,1], [0,-1]],
                eel: [[-1,1], [-1,-1], [1,0]],
                rabbit: [[-1,-1], [1,1], [2,0]],
                rooster: [[-1,-1], [-1,0], [1,0], [1,1]],
                ox: [[0,1], [0,-1], [1,0]],
                cobra: [[-1,0], [1,1], [1,-1]]
              },
      deck: ['tiger', 'crab', 'monkey', 'crane', 'dragon', 'elephant', 'mantis', 'boar', 'frog', 'goose', 'horse', 'eel', 'rabbit', 'rooster', 'ox', 'cobra'],
      discard: [],
      selected: '',
      pieceIsSelected: false,
      nextCard: [],
      player1Cards: ['',''],
      player2Cards: ['',''],
      validSquares: [],
      p1CardIndex: -1,
      p2LastUsed: '',
      cardCss: ['card1', 'card2'],
      isCaptured: {O: false, X: false},
      cpuMoves: [],
      cpuState: {
                      x1: {
                            isCaptured: false,
                            position: [0,0]
                          },
                      x2: {
                            isCaptured: false,
                            position: [0,1]
                          },
                      X:  {
                            isCaptured: false,
                            position: [0,2]
                          },
                      x3: {
                            isCaptured: false,
                            position: [0,3]
                          },
                      x4: {
                            isCaptured: false,
                            position: [0,4]
                          }
                    }
    };
  }

  //From the props set the hands of players and update the deck.
  async componentWillMount() {
    let tempDeck = this.state.deck.slice();
    tempDeck = shuffleDeck(tempDeck);
    let newDeckState = getCard.call(this, "player1Cards", tempDeck);
    tempDeck = newDeckState[0];
    await this.setState({player1Cards: [newDeckState[1], newDeckState[2]]})
    newDeckState = getCard.call(this, "player2Cards", tempDeck);
    await this.setState({player2Cards: [newDeckState[1], newDeckState[2]]})
    await this.setState({deck: newDeckState[0]});
    await this.setState({nextCard: newDeckState[0][0]});
  }

  async selectThisCard(isCard1){
    if(isCard1){
      await this.setState({cardCss: ["card1 selected-card", "card2"]})
      await this.setState({p1CardIndex: 0})
    } else {
      await this.setState({cardCss: ["card1", "card2 selected-card"]})
      await this.setState({p1CardIndex: 1})
    }

    if(this.state.pieceIsSelected) {
      const squares = this.state.squares.slice();
      let cardName = this.state.player1Cards[this.state.p1CardIndex];
      let cardArr = this.state.cards[cardName];
      const tempSqr = getValidSquares(this.state.selected[0],this.state.selected[1],cardArr,squares);
      
      await this.setState({validSquares: tempSqr});
    }

  }

  async handleClick(x,y) {
    let isCpuTurn = false;
    const squares = this.state.squares.slice();
    let isValid = false;
    for (let i = 0; i<this.state.validSquares.length; i++) {
      if(x === this.state.validSquares[i][0] && y === this.state.validSquares[i][1]) {
        isValid = true;
      }
    }

    //if is oO & nothing selected set selected, get valid squares
    if(regexO.test(squares[x][y]) && (!this.state.pieceIsSelected || regexO.test(squares[x][y]))) { //clicked your own piece when nothing was clicked before
      await this.setState({selected: [x,y]});
      await this.setState({pieceIsSelected: true});

      if(this.state.p1CardIndex >= 0){
        let cardName = this.state.player1Cards[this.state.p1CardIndex];
        let cardArr = this.state.cards[cardName];
        const tempSqr = getValidSquares(this.state.selected[0],this.state.selected[1],cardArr,squares);
        
        await this.setState({validSquares: tempSqr});
        
      }
      
    } else if (this.state.pieceIsSelected && isValid) { //moving your piece to a valid location
      //TODO: Don't execute CPU turn if player1 won
      isCpuTurn = true;

      if(squares[x][y] === 'x'){
        let newXstate = this.state.cpuState;
        if(this.state.cpuState.x1.position[0] === x && this.state.cpuState.x1.position[1] === y){
          newXstate.x1.isCaptured = true;
          this.setState({cpuState: newXstate});
        } else if (this.state.cpuState.x2.position[0] === x && this.state.cpuState.x2.position[1] === y){
          newXstate.x2.isCaptured = true;
          this.setState({cpuState: newXstate});
        } else if (this.state.cpuState.x3.position[0] === x && this.state.cpuState.x3.position[1] === y){
          newXstate.x3.isCaptured = true;
          this.setState({cpuState: newXstate});
        } else if (this.state.cpuState.x4.position[0] === x && this.state.cpuState.x4.position[1] === y){
          newXstate.x4.isCaptured = true;
          this.setState({cpuState: newXstate});
        }
      }
      let tempDeck;
      //set new position
      let prevX = this.state.selected[0];
      let prevY = this.state.selected[1];
      squares[x][y] = squares[prevX][prevY] === 'O' ? 'O':'o';
      squares[prevX][prevY] = '';
      await this.setState({selected: ''});
      await this.setState({pieceIsSelected: false}); 
      await this.setState({validsquares: ''});
      if(squares[x][y] === 'O'){
        this.setState({positionO: [x,y]});
      }

      //TODO: checkwincondition
      if(false){
        this.setState({squares: squares});
        //endgame
      }

      //if not enough cards shuffle discard into deck;
      if(this.state.deck.length <= 2){
        let tempDiscard = this.state.discard.slice();
        tempDeck = this.state.deck.slice();
        tempDiscard = shuffleDeck(tempDiscard);
        let deckDiscard = tempDeck.concat(tempDiscard);
        await this.setState({deck: deckDiscard});
        await this.setState({discard: []});
      }

      //put used card in discard
      let discard = this.state.player1Cards[this.state.p1CardIndex];
      let tempDiscard = this.state.discard;
      tempDiscard.push(discard);
      await this.setState({discard: tempDiscard});

      //update card used and deck & update next card
      let tempHand = this.state.player1Cards;
      tempHand[this.state.p1CardIndex] = '';
      await this.setState({player1Cards: tempHand});
      tempDeck = this.state.deck.slice();
      let newDeckState = getCard.call(this, "player1Cards", tempDeck);
      if(this.state.p1CardIndex === 0) {
        await this.setState({player1Cards: [newDeckState[1], newDeckState[2]]})
      } else {
        await this.setState({player1Cards: [newDeckState[1], newDeckState[2]]})
      }      
      await this.setState({deck: newDeckState[0]});
      await this.setState({nextCard: newDeckState[0][0]});

      //if selected piece moves to valid square
      //DONE: update positioning
      //        deal next card
      //        move used card to discard pile. 
      //        CHANGE GETCARD TO NOT USE RANDOM
      //        SHUFFLE DECK FIRST
      //        SHUFFLE DISCARD WHEN <= 1;
      //TODO: Check win condition
      //      if (! YouWon) {
      //        run Opponent turn function
      //        check if opponent won
      //        update following: opponent card, last used card, show next card
      //      }

    } else { //not a valid click clears everything
      this.setState({selected: ''});
      this.setState({pieceIsSelected: false});
    }
    this.setState({squares: squares});


    //TODO: opponent state
    
    if(isCpuTurn){
      //TODO: find out why this is creating new pieces with random moves
      let cpu = cpuTurn.call(this, "player2Cards", this.state.deck, this.state.positionO, squares);
      // console.log(cpu);
      //['open', pos, aCard, [tempX,tempY]]
      let xXs = ['X', 'x1', 'x2', 'x3', 'x4'];

      for (let i in xXs) {
        if (this.state.cpuState[xXs[i]].position === cpu[1]){
          let newXstate = this.state.cpuState;
          newXstate[xXs[i]].position = cpu[3];
          this.setState({cpuState: newXstate});
        }
      }

      let deckCopy = this.state.deck.slice();
      //shuffle discard
      if(deckCopy.length <= 2){
        let tempDiscard = this.state.discard.slice();
        let tempDeck = this.state.deck.slice();
        tempDiscard = shuffleDeck(tempDiscard);
        let deckDiscard = tempDeck.concat(tempDiscard);
        await this.setState({deck: deckDiscard});
        await this.setState({discard: []});
      }

      deckCopy = this.state.deck.slice();
      let nextCard = deckCopy.splice(1,1);
      let handCopy = this.state.player2Cards.slice();
      if(handCopy[0] === cpu[2]){
        handCopy[0] = nextCard[0];
      } else {
        handCopy[1] = nextCard[0];
      }

      squares[cpu[3][0]][cpu[3][1]] = squares[cpu[1][0]][cpu[1][1]] === 'X' ? 'X' : 'x';
      squares[cpu[1][0]][cpu[1][1]] = '';

      let usedCard = this.state.discard.slice();
      usedCard.push(cpu[2]);

      this.setState({discard: usedCard});
      this.setState({cpuMoves: [[cpu[3][0], cpu[3][1]], [cpu[1][0], cpu[1][1]]]})
      this.setState({player2Cards: handCopy});
      this.setState({deck: deckCopy});
      this.setState({p2LastUsed: cpu[2]});
      this.setState({squares: squares});
    }
    //check if opponent won;
  }

  renderSquare(x,y) {
    let classSqr = "square";
    
    //If pieceIsSelected, only show valid move options, otherwise pieces are selectable.
    if(this.state.pieceIsSelected){
      for (let i = 0; i<this.state.validSquares.length; i++){
        if(this.state.validSquares[i][0] === x && this.state.validSquares[i][1] === y) {
          classSqr = "square pointer";
        }
      }
    } else {
      if(this.state.squares[x][y] === 'o' || this.state.squares[x][y] === 'O') {
        classSqr = "square pointer";
      }
    }
    //If piece selected, highlight accordingly
    if(this.state.selected[0] === x && this.state.selected[1] === y){
      classSqr = `square active pointer`;
    }

    //TODO: CSS for opponent moves
    if(this.state.cpuMoves.length > 0) {
      if((this.state.cpuMoves[0][0] === x && this.state.cpuMoves[0][1] === y) || (this.state.cpuMoves[1][0] === x && this.state.cpuMoves[1][1] === y)){
        classSqr = `square cpuMove pointer`;
      }
    }
    

    return <Square active={classSqr} value={this.state.squares[x][y]} onClick={() => this.handleClick(x,y)} />;  
  }

  render() {
    let p1c1cardname = findConstCard(this.state.player1Cards[0]);
    let p1c2cardname = findConstCard(this.state.player1Cards[1]);
    let p2c1cardname = findConstCard(this.state.player2Cards[0]);
    let p2c2cardname = findConstCard(this.state.player2Cards[1]);
    let p2lastcard = findConstCard(this.state.p2LastUsed);
    let p1nextcard = findConstCard(this.state.nextCard);

    let lastUsedHeader = this.state.p2LastUsed.length > 0 ? <h2 className="lastUsedHeader">Opponent Last Used: </h2> : null;
    let lastUsed = this.state.p2LastUsed.length > 0 ? <Card className="last-card upside-down" card={this.state.p2LastUsed} src={p2lastcard}/> : null;
    let selectCardPrompt = this.state.p1CardIndex >= 0 ? null : <h2 className="highlight">Please select one of your cards cards below</h2>;

    return (
      <div className="game">
        <div id="TBA">
          <div id="player-box">
            <Card className="card1 upside-down" card={this.state.player2Cards[0]} src={p2c1cardname} />
            <Card className="card2 upside-down" card={this.state.player2Cards[1]} src={p2c2cardname} />
          </div>
          <div id="game-board">
            <div className="status">{status}</div>
            <div className="board-row">
              {this.renderSquare(0,0)}
              {this.renderSquare(0,1)}
              {this.renderSquare(0,2)}
              {this.renderSquare(0,3)}
              {this.renderSquare(0,4)}
            </div>
            <div className="board-row">
              {this.renderSquare(1,0)}
              {this.renderSquare(1,1)}
              {this.renderSquare(1,2)}
              {this.renderSquare(1,3)}
              {this.renderSquare(1,4)}
            </div>
            <div className="board-row">
              {this.renderSquare(2,0)}
              {this.renderSquare(2,1)}
              {this.renderSquare(2,2)}
              {this.renderSquare(2,3)}
              {this.renderSquare(2,4)}
            </div>
            <div className="board-row">
              {this.renderSquare(3,0)}
              {this.renderSquare(3,1)}
              {this.renderSquare(3,2)}
              {this.renderSquare(3,3)}
              {this.renderSquare(3,4)}
            </div>
            <div className="board-row">
              {this.renderSquare(4,0)}
              {this.renderSquare(4,1)}
              {this.renderSquare(4,2)}
              {this.renderSquare(4,3)}
              {this.renderSquare(4,4)}
            </div>
          </div>
          <div id="player-box">
            {selectCardPrompt}
            <SelectableCard className={this.state.cardCss[0]} card={this.state.player1Cards[0]} src={p1c1cardname} onClick={() => this.selectThisCard(true)}/>
            <SelectableCard className={this.state.cardCss[1]} card={this.state.player1Cards[1]} src={p1c2cardname} onClick={() => this.selectThisCard(false)} />
          </div>
        </div>
        <div id="status-cards">
          {lastUsedHeader}
          {lastUsed}
          <Card className="next-card" card={this.state.nextCard} src={p1nextcard}/>
          <h2>Your Next Card</h2>
        </div>
      </div>
    );
  }
}

class Game extends Component {
  constructor() {
    super();
    this.state = {
      history: [],
      playerIsNext: true,
      start: false
    }
  }

  gameStart(){
    this.setState({start: true});
  }

  render() {
    let gameState = this.state.start ? <Board/> : <Start onClick={() => this.gameStart()}/>;

    return (
      <div>
        {gameState}
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game p1Name="player1"/>,
  document.getElementById('container')
);

function calculateWinner(condition) {

  return null;
}

function cpuTurn(hand, deck, posO, sqArr) {
  let winningMoveFound = false;
  let card1 = this.state[hand][0];
  let card2 = this.state[hand][1];
  let card1moves = this.state.cards[this.state[hand][0]];
  let card2moves = this.state.cards[this.state[hand][1]];
  const deckCopy = deck.slice();
  const cardMoves = []; //store best moves here? 
  
  let x1move = [];
  let x2move = [];
  let x3move = [];
  let x4move = [];
  //Need to account for if x1-x4 is captured or not

  //if available: calculateMoves
  let Xmove = calculateMoves(this.state.cpuState.X.position, card1, card1moves, card2, card2moves, true);
  if(Xmove[0] === 'WON' || Xmove[0] === 'O'){
    return Xmove;
  }
  if(!this.state.cpuState.x1.isCaptured){
    x1move = calculateMoves(this.state.cpuState.x1.position, card1, card1moves, card2, card2moves, false);
  }
  if(!this.state.cpuState.x2.isCaptured) {
    x2move = calculateMoves(this.state.cpuState.x2.position, card1, card1moves, card2, card2moves, false);
  }
  if(!this.state.cpuState.x3.isCaptured) {
    x3move = calculateMoves(this.state.cpuState.x3.position, card1, card1moves, card2, card2moves, false);
  }
  if(!this.state.cpuState.x4.isCaptured) {
    x4move = calculateMoves(this.state.cpuState.x4.position, card1, card1moves, card2, card2moves, false);
  }

  if(x1move.length > 0){
    cardMoves.push(x1move);
  }
  if(x2move.length > 0){
    cardMoves.push(x2move);
  }
  if(x3move.length > 0){
    cardMoves.push(x3move);
  }
  if(x4move.length > 0){
    cardMoves.push(x4move);
  }

  //if capturing use immediately
  const oMove = [];
  for(let i in cardMoves){
    if(cardMoves[i][0] === 'O'){
      return cardMoves[i];
    } else if (cardMoves[i][0] === 'o'){
      oMove.push(cardMoves[i]);
    }
  }

  //not capturing O so check for lil o. otherwise perform random if there are other pieces
  if(oMove.length > 0 ){
    return oMove[Math.floor(Math.random() * oMove.length)];
  } else if (cardMoves.length === 0){
    return Xmove;
  } else {
    return cardMoves[Math.floor(Math.random() * cardMoves.length)];
  }


  function calculateMoves(pos, card1, move1, card2, move2, isX) {
    
    let aMove = calcMove(card1, move1);
    let bMove = calcMove(card2, move2);

    if(aMove.length < 2 && bMove.length < 2){
      return [];
    } else if (aMove.length < 2 && bMove.length > 2) {
      return bMove;
    } else if (bMove.length < 2 && aMove.length > 2){
      return aMove;
    } else if(aMove[0] === 'O'){
      return aMove;
    } else if(bMove[0] === 'O'){
      return bMove;
    } else if(aMove[0] === 'o'){
      return aMove;
    } else if(bMove[0] === 'o'){
      return bMove;
    } else {
      return Math.random() > 0.49 ? aMove : bMove;
    }

    function calcMove(aCard, aMove){
      let tempX, tempY;
      const calcMoves = [];

      for (let i in aMove){
        tempX = pos[0] + aMove[i][1]; //
        tempY = pos[1] - aMove[i][0]; //

        //Checks if Master moves to gate.
        if(isX){
          if(tempX === 4 && tempY === 2) {
            return ['WON', aCard, [tempX, tempY]];
          }
        }

        if (tempX > 4 || tempX < 0 || tempY > 4 || tempY < 0){
          continue;
        } else {
          if(!/[xX]/.test(sqArr[tempX][tempY])){            
            if(/O/.test(sqArr[tempX][tempY])){
              return ['O', pos, aCard, [tempX,tempY]];
            } else if (/o/.test(sqArr[tempX][tempY])){
              calcMoves.push(['o', pos, aCard, [tempX,tempY]]);
            } else {
              calcMoves.push(['open', pos, aCard, [tempX,tempY]]);
            }

          }
        }
      }
      for (let i in calcMoves){
        if(calcMoves[i][0] === 'o'){
          return calcMoves[i];
        }
      }
      if(calcMoves.length < 1){
        return [];
      }
      return calcMoves[Math.floor(Math.random()*calcMoves.length)];
    }
  }
}

//Find array of valid moves with given unit & card.
function getValidSquares(x,y,val,sqArr){
  let validSquares = [];
  let tempX, tempY;

  for (let i = 0; i<val.length; i++) {
    tempX = x - val[i][1];
    tempY = y + val[i][0];
    
    if (tempX > 4 || tempX < 0 || tempY > 4 || tempY < 0){
      continue;
    } else {
      if(!regexO.test(sqArr[tempX][tempY])){
        validSquares.push([tempX,tempY]);
      }
    }
  }
  return validSquares;
}

function getCard(hand, deck){
  let pulledCards = [];
  let tempDeck = deck.slice();
  let hand0 = this.state[hand][0];
  let hand1 = this.state[hand][1];

  if(hand0 === '') {
    hand0 = tempDeck.splice(0,1)[0];
  }
  if(hand1 === ''){
    hand1 = tempDeck.splice(0,1)[0];
  }

  return [tempDeck, hand0, hand1];
}

function shuffleDeck(deck) {
  let deckCopy = deck.slice();
  let newDeck = [];
  for (let i in deck) {
    newDeck.push(deckCopy.splice(Math.random() * deckCopy.length, 1)[0]);
  }
  return newDeck;
}

function findConstCard(card) {
  if(card === 'tiger'){
    return tiger;
  } else if (card === 'monkey'){
    return monkey;
  } else if (card === 'crab'){
    return crab;
  } else if (card === 'crane'){
    return crane;
  } else if (card === 'dragon'){
    return dragon;
  } else if (card === 'elephant'){
    return elephant;
  } else if (card === 'mantis'){
    return mantis;
  } else if (card === 'boar'){
    return boar;
  } else if (card === 'frog'){
    return frog;
  } else if (card === 'goose'){
    return goose;
  } else if (card === 'horse'){
    return horse;
  } else if (card === 'eel'){
    return eel;
  } else if (card === 'rabbit'){
    return rabbit;
  } else if (card === 'rooster'){
    return rooster;
  } else if (card === 'ox'){
    return ox;
  } else if (card === 'cobra'){
    return cobra
  }
  return null;
}