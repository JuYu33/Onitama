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
      isCaptured: {O: false, X: false},
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
      p2LastUsed: 'tiger',
      cardCss: ['card1', 'card2'],
      cpuPositions: {
                      x1: [0,0],
                      x2: [0,1],
                      X:  [0,2],
                      x3: [0,3],
                      x4: [0,4]
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
        const squares = this.state.squares.slice();
        let cardName = this.state.player1Cards[this.state.p1CardIndex];
        let cardArr = this.state.cards[cardName];
        const tempSqr = getValidSquares(this.state.selected[0],this.state.selected[1],cardArr,squares);
        
        await this.setState({validSquares: tempSqr});
        
      }
      
    } else if (this.state.pieceIsSelected && isValid) { //moving your piece to a valid location
      
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
    //run opponents turn
    // let newDeckState = opponentTurn.call(this, "player2Cards", tempDeck);
    // ct.call(this,'player2Cards');
    opponentTurn.call(this, "player2Cards", this.state.deck, this.state.positionO, squares);

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

    return <Square active={classSqr} value={this.state.squares[x][y]} onClick={() => this.handleClick(x,y)} />;  
  }

  render() {
    let p1c1cardname = findConstCard(this.state.player1Cards[0]);
    let p1c2cardname = findConstCard(this.state.player1Cards[1]);
    let p2c1cardname = findConstCard(this.state.player2Cards[0]);
    let p2c2cardname = findConstCard(this.state.player2Cards[1]);
    //NOWDO lastcard not updated since card use not implemented.
    let p2lastcard = findConstCard(this.state.p2LastUsed);
    let p1nextcard = findConstCard(this.state.nextCard);
    let selectCardPrompt = this.state.p1CardIndex >= 0 ? null : <h2 className="highlight">Please select one of your cards cards below</h2>

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
          <h2>Opponent Used</h2>
          <Card className="last-card" card={this.state.p2LastUsed} src={p2lastcard}/>
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

function testFct(hand) {
  console.log(this.state[hand][0])
  console.log(this.state.cards[this.state[hand][0]]);
}

function opponentTurn(hand, deck, posO, sqArr) {
  let winningMoveFound = false;
  let card1 = this.state[hand][0];
  let card2 = this.state[hand][1];
  let card1moves = this.state.cards[this.state[hand][0]];
  let card2moves = this.state.cards[this.state[hand][1]];
  let deckCopy = deck.slice();
  
  //example
  //valideMoves.[x,y] = [[cardname, x1], [cardname, x2]];

  let validMoves = {}

  calculateMoves(this.state.cpuPositions.X, card1, card1moves, card2, card2moves, true);

  function calculateMoves(pos, card1, move1, card2, move2, isX) {
    console.log(pos)
    let tempPos = [];
    calcMove(move1);
    calcMove(move2);

    function calcMove(aMove){
      let tempX, tempY;
      for (let i in aMove){
        tempX = pos[0] + aMove[i][1]; //
        tempY = pos[1] - aMove[i][0]; //

        if (tempX > 4 || tempX < 0 || tempY > 4 || tempY < 0){
          continue;
        } else {
          //TODO: adjust to log good moves then pick the right one.
          if(!/[xX]/.test(sqArr[tempX][tempY])){
            tempPos.push([tempX,tempY]);
          }
        }
      }
    }
    console.log(tempPos);
    return null;
  }

  //TODO:
  //for each position get valid spots;
  //if X === [4,2] apply
  //if any contain O. apply
  //else if any contain o. apply
  //else move any x to any position;

  //[x,y] remember to invert y
  //p2: invert x not y

  //get new card
  //return

}

/*
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
*/

function getValidSquares(x,y,val,sqArr){
  let validSquares = [];
  let tempX, tempY;

  for (let i = 0; i<val.length; i++) {
    tempX = x - val[i][1];//actually y-axis
    tempY = y + val[i][0];//actually x-axis
    
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

