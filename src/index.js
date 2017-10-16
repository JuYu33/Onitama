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
const regexO = /[oO]/;
const regexX = /[xX]/;
const xXs = ['X', 'x1', 'x2', 'x3', 'x4'];
const oOs = ['O', 'o1', 'o2', 'o3', 'o4'];


/*
================================================================================================
Main Game Component

TODO: Randomize who goes first.
      Update o state based on what was selected and where it moved

================================================================================================
*/

class Game extends Component {
  constructor() {
    super();
    this.state = {
      start: false,
      winner: false,
      squares: [['x','x','X','x','x'],
                ['','','','',''],
                ['','','','',''],  
                ['','','','',''],
                ['o','o','O','o','o']],
      cards:  {
                Tiger: [[0,2], [0,-1]],
                Crab: [[-2,0], [0,1], [2,0]],
                Monkey: [[-1,1], [1,1], [-1,-1], [1,-1]],
                Crane: [[0,1], [-1,-1], [1,-1]],
                Dragon: [[-2,1],[-1,-1],[1,-1],[2,1]],
                Elephant: [[-1,1],[-1,0],[1,1],[1,0]],
                Mantis: [[-1,1],[0,-1],[1,1]],
                Boar: [[-1,0],[0,1],[1,0]],
                Frog: [[-2,0], [-1,1], [1,-1]],
                Goose: [[-1,1], [-1,0], [1,0], [1,-1]],
                Horse: [[-1,0], [0,1], [0,-1]],
                Eel: [[-1,1], [-1,-1], [1,0]],
                Rabbit: [[-1,-1], [1,1], [2,0]],
                Rooster: [[-1,-1], [-1,0], [1,0], [1,1]],
                Ox: [[0,1], [0,-1], [1,0]],
                Cobra: [[-1,0], [1,1], [1,-1]]
              },
      deck: ['Tiger', 'Crab', 'Monkey', 'Crane', 'Dragon', 'Elephant', 'Mantis', 'Boar', 'Frog', 'Goose', 'Horse', 'Eel', 'Rabbit', 'Rooster', 'Ox', 'Cobra'],
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
      isCaptured: false,
      cpuMoves: [],
      difficulty: 'hard',
      xState: {
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
                },
      oState: {
                o1: {
                      isCaptured: false,
                      position: [4,0]
                    },
                o2: {
                      isCaptured: false,
                      position: [4,1]
                    },
                O:  {
                      isCaptured: false,
                      position: [4,2]
                    },
                o3: {
                      isCaptured: false,
                      position: [4,3]
                    },
                o4: {
                      isCaptured: false,
                      position: [4,4]
                    }
      }
    };
  }

  //From the props set the hands of players and update the deck.
  async componentWillMount() {
    let tempDeck = this.state.deck.slice();
    tempDeck = shuffleDeck(tempDeck);
    let p1newDeckState = getCard.call(this, "player1Cards", tempDeck);
    tempDeck = p1newDeckState[0];
    let p2newDeckState = getCard.call(this, "player2Cards", tempDeck);
    await this.setState({player1Cards: [p1newDeckState[1], p1newDeckState[2]],
                          player2Cards: [p2newDeckState[1], p2newDeckState[2]],
                          deck: p2newDeckState[0],
                          nextCard: p2newDeckState[0][0]
    });
  }

  async handleClick(type,x,y) {
    //TODO: End the game if a winner is found. Currently just ends
    if (this.state.winner) {
      return;
    } else if (type === 'card') { //Highlights the clicked card
        let selectCard = x ? ["card1 selected-card", "card2"] : ["card1", "card2 selected-card"],
            selectIndex = x ? 0 : 1,
            tempSqr = [];

        if(this.state.pieceIsSelected) {
          const squares = this.state.squares.slice();
          let cardName = this.state.player1Cards[selectIndex];
          let cardArr = this.state.cards[cardName];
          tempSqr = getValidSquares(this.state.selected[0],this.state.selected[1],cardArr,squares);
        } 
        await this.setState({validSquares: tempSqr,
                              cardCss: selectCard,
                              p1CardIndex: selectIndex
        });  
    } else if (type ==='square') {
      let isCpuTurn = false,
          isValid = false,
          winner = false,
          squares = this.state.squares.slice();

      //check if the clicked square is valid move from selected position
      for (let i = 0; i<this.state.validSquares.length; i++) {
        if(x === this.state.validSquares[i][0] && y === this.state.validSquares[i][1]) {
          isValid = true;
        }
      }
      //if is oO & nothing selected, get valid squares
      if(regexO.test(squares[x][y])) {
        if(this.state.p1CardIndex >= 0){
          let cardName = this.state.player1Cards[this.state.p1CardIndex],
              cardArr = this.state.cards[cardName];
          const tempSqr = getValidSquares(x,y,cardArr,squares);
          
          await this.setState({validSquares: tempSqr,
                                selected: [x,y],
                                pieceIsSelected: true
          });  
        }
      } else if (this.state.pieceIsSelected && isValid) { //moving your piece to a valid location
        isCpuTurn = true;

        //TODO: x not getting captured
        let newXstate = Object.assign({}, this.state.xState),
            newOstate = Object.assign({}, this.state.oState),
            tempDeck,
            prevX = this.state.selected[0],
            prevY = this.state.selected[1];

        if(regexX.test(squares[x][y])){
          for (let i=0; i<xXs.length; i++){
            if(!this.state.xState[xXs[i]].isCaptured){
              if(this.state.xState[xXs[i]].position[0] === x && this.state.xState[xXs[i]].position[1] === y){
                newXstate[xXs[i]].isCaptured = true;
                if(xXs[i] === 'X'){
                  winner = 'player1';
                }
                break;
              }
            }
          }
        }

        squares[x][y] = squares[prevX][prevY] === 'O' ? 'O':'o';
        squares[prevX][prevY] = '';

        for (let i=0; i<oOs.length; i++){
          if(newOstate[oOs[i]].position[0] === prevX && newOstate[oOs[i]].position[1] === prevY){
            newOstate[oOs[i]].position = [x,y];
          }
        }
        if (newOstate.O.position[0] === 0 && newOstate.O.position[1] === 2) {
          winner = 'player1';
        }

        if (winner) {
          // newXstate.X.isCaptured = true;
          console.log("you won?"); 
          await this.setState({winner: winner,
                                validSquares: [x,y],
                                squares: squares,
                                xState: newXstate,
                                oState: newOstate,
                                selected: '',
                                pieceIsSelected: false
          });
        } else {
          await this.setState({selected: '',
                              pieceIsSelected: false,
                              validSquares: '',
                              xState: newXstate,
                              oState: newOstate
          });
        }

        //TODO: checkwincondition position 0,2;
        // if(false){
         
        // }
        //if not enough cards shuffle discard into deck;
        if(!this.state.winner) {
          let discard;
          let tempDiscard = this.state.discard.slice();
          tempDeck = this.state.deck.slice();
          if(this.state.deck.length <= 2){
            tempDiscard = shuffleDeck(tempDiscard);
            tempDeck = tempDeck.concat(tempDiscard);
            tempDiscard = [];
          }
          //put used card in discard
          discard = this.state.player1Cards[this.state.p1CardIndex];
          tempDiscard.push(discard);
          //update card used and deck & update next card
          //this sets 1 of the 2 cards = ''
          let tempHand = this.state.player1Cards;
          tempHand[this.state.p1CardIndex] = '';
          await this.setState({player1Cards: tempHand});
          let newDeckState = getCard.call(this, "player1Cards", tempDeck);
          await this.setState({deck: newDeckState[0],
                                nextCard: newDeckState[0][0],
                                discard: tempDiscard,
                                player1Cards: [newDeckState[1], newDeckState[2]]
          });
        }
      } else {
        //TODO: Should selected become deselected on other click?
        //      No deselected on right click!!!
        // this.setState({selected: '',
        //                 pieceIsSelected: false
        // });

      }
      // TODO: UNDO?!

      if(isCpuTurn && !this.state.winner){
        const newXstate = Object.assign({}, this.state.xState),
              newOstate = Object.assign({}, this.state.oState),
              cardMoves1 = this.state.cards[this.state.player1Cards[0]],
              cardMoves2 = this.state.cards[this.state.player1Cards[1]];
        let oppCard1 = this.state.cards[this.state.player1Cards[0]],
            oppCard2 = this.state.cards[this.state.player1Cards[1]],
            deckCopy = this.state.deck.slice(),
            tempDiscard = this.state.discard.slice(),
            tempDeck = this.state.deck.slice(),
            dangerZones = {},
            nextCard, handCopy, tempSqr1, tempSqr2;

        //calc threatened positions
        if(this.state.difficulty === 'hard'){
          for(let i=0; i<oOs.length; i++){
            if(!newOstate[oOs[i]].isCaptured){
              tempSqr1 = getValidSquares(newOstate[oOs[i]].position[0], newOstate[oOs[i]].position[1], cardMoves1, squares);
              tempSqr2 = getValidSquares(newOstate[oOs[i]].position[0], newOstate[oOs[i]].position[1], cardMoves2, squares);

              //Dangerzones of current piece 'o' card 1
              tempSqr1.forEach((myArr)=>{
                if(!dangerZones.hasOwnProperty(myArr)){
                  dangerZones[myArr] = [oOs[i]];
                } else if (dangerZones[myArr].indexOf(oOs[i]) < 0) {
                  dangerZones[myArr].push(oOs[i]);
                }
              });
              
              //Dangerzones of current piece 'o' card 2
              tempSqr2.forEach((myArr)=>{
                if(!dangerZones.hasOwnProperty(myArr)){
                  dangerZones[myArr] = [oOs[i]];
                } else if (dangerZones[myArr].indexOf(oOs[i]) < 0) {
                  dangerZones[myArr].push(oOs[i]);
                }
              });
            }
          }
        }

        const cpu = cpuTurn.call(this, "player2Cards", dangerZones, squares, oppCard1, oppCard2, this.state.oState, this.state.difficulty);
        const squareContents = cpu[0],
              originalPosition = cpu[1],
              cpuUsedCard = cpu[2],
              newPosition = cpu[3];
        for (let i in xXs) {
          if (originalPosition === this.state.xState.X.position){
            newXstate.X.position = newPosition;
            break;
          } else if (this.state.xState[xXs[i]].position === originalPosition){
            newXstate[xXs[i]].position = newPosition;
          }
        }

        //if Captured 'o' or 'O' update the params of newOstate
        if(regexO.test(squareContents)){
          for(let i=0; i<oOs.length; i++){
            if(newOstate[oOs[i]].position[0] === newPosition[0] && newOstate[oOs[i]].position[1] === newPosition[1]){
              newOstate[oOs[i]].position = [];
              newOstate[oOs[i]].isCaptured = true;

              if(oOs[i] === 'O'){
                //cpuWon
                winner = 'player2';
              }
              break;
            }
          }
        }

        //shuffle discard
        if(deckCopy.length <= 2){
          tempDiscard = shuffleDeck(tempDiscard);
          deckCopy = tempDeck.concat(tempDiscard);
          tempDiscard = [];
        }

        nextCard = deckCopy.splice(1,1);
        handCopy = this.state.player2Cards.slice();
        if(handCopy[0] === cpuUsedCard){
          handCopy[0] = nextCard[0];
        } else {
          handCopy[1] = nextCard[0];
        }

        squares[newPosition[0]][newPosition[1]] = squares[originalPosition[0]][originalPosition[1]] === 'X' ? 'X' : 'x';
        squares[originalPosition[0]][originalPosition[1]] = '';
        tempDiscard.push(cpuUsedCard);

        this.setState({discard: tempDiscard,
                        cpuMoves: [[newPosition[0], newPosition[1]], [originalPosition[0], originalPosition[1]]],
                        player2Cards: handCopy,
                        deck: deckCopy,
                        p2LastUsed: cpuUsedCard,
                        squares: squares,
                        xState: newXstate,
                        oState: newOstate,
                        winner: winner
        });
      }
    }
    //TODO: opponent state
    
    
    //check if opponent won;    
  }  

  gameStart(){
    this.setState({start: true});
  }

  render() {
    // let gameState = this.state.start ? <Board theState={this.state} onClick={(type,x,y) => {this.handleClick(type,x,y)}}/> : <Start onClick={() => this.gameStart()}/>;
    let gameState = <Board theState={this.state} onClick={(type,x,y) => {this.handleClick(type,x,y)}}/>

    return (
      <div>
        {gameState}
      </div>
    );
  }
}


/*
================================================================================================
Main Board Component
================================================================================================
*/

class Board extends Component {

  constructor() {
    super();
    this.state = {
      cardCss: ['card1', 'card2'],
      count: 0
    }
  }

  onHover(x,y) {

  }

  renderSquare(x,y) {
    let classSqr = "square";
    
    //If pieceIsSelected, only show valid move options, otherwise pieces are selectable.

    // if(this.props.theState.cpuMoves.length > 0) {
    //   if((this.props.theState.cpuMoves[0][0] === x && this.props.theState.cpuMoves[0][1] === y) || (this.props.theState.cpuMoves[1][0] === x && this.props.theState.cpuMoves[1][1] === y)){
    //     classSqr = `square cpuMove`;
    //   }
    // }

    //TODO: CSS for opponent moves

    if(this.props.theState.pieceIsSelected){
      for (let i = 0; i<this.props.theState.validSquares.length; i++){
        if(this.props.theState.validSquares[i][0] === x && this.props.theState.validSquares[i][1] === y) {
          classSqr = "square pointer";
        }
      }
      if(this.props.theState.squares[x][y] === 'o' || this.props.theState.squares[x][y] === 'O') {
        classSqr = "square pointer";
      }
    }
    //If piece selected, highlight accordingly
    if(this.props.theState.selected[0] === x && this.props.theState.selected[1] === y){
      classSqr = `square active pointer`;
    }
    if(this.props.theState.cpuMoves.length > 0) {
      if((this.props.theState.cpuMoves[0][0] === x && this.props.theState.cpuMoves[0][1] === y) || (this.props.theState.cpuMoves[1][0] === x && this.props.theState.cpuMoves[1][1] === y)){
        classSqr = `square cpuMove`;
      }
      //TODO: add onhover event
    }

    //TODO: If game over display winning move
    /*
    if(this.props.theState.winner){
      console.log(x,y);
      
      if(((x === this.props.theState.validSquares[0]) && (y === this.props.theState.validSquares[1])) || ((x === this.props.theState.selected[0]) && (y === this.props.theState.selected[1]))) {
        classSqr = 'square';
      } else {
        classSqr = 'square';
      }
      
    }
    */
    if(x===0 && y===2){
      classSqr += " redGate";
    } else if(x===4 && y===2) {
      classSqr += ' blueGate';
    }
    return <Square active={classSqr} value={this.props.theState.squares[x][y]} onClick={() => this.props.onClick('square',x,y)} />;  
  }


  render() {
    let p1card1img = findConstCard(this.props.theState.player1Cards[0]);
    let p1card2img = findConstCard(this.props.theState.player1Cards[1]);
    let p2card1img = findConstCard(this.props.theState.player2Cards[0]);
    let p2card2img = findConstCard(this.props.theState.player2Cards[1]);
    let p2lastcard = findConstCard(this.props.theState.p2LastUsed);
    let p1nextcard = findConstCard(this.props.theState.nextCard);

    let lastUsedHeader = this.props.theState.p2LastUsed.length > 0 ? <h2 className="lastUsedHeader">Opponent Last Used </h2> : null;
    let lastUsed = this.props.theState.p2LastUsed.length > 0 ? <Card className="last-card upside-down" card={this.props.theState.p2LastUsed} src={p2lastcard}/> : null;
    let selectCardPrompt = this.props.theState.p1CardIndex >= 0 ? null : <h2 className="highlight">Please select one of your cards cards below to BEGIN!</h2>;
    if(this.props.theState.winner){
      selectCardPrompt = <h1>{this.props.theState.winner} has won!!</h1>
    }
    return (
      <div className="game">
        <div id="TBA">
          <div id="player-box">
            <Card className="card1 upside-down" card={this.props.theState.player2Cards[0]} src={p2card1img} />
            <Card className="card2 upside-down" card={this.props.theState.player2Cards[1]} src={p2card2img} />
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
            <SelectableCard className={this.props.theState.cardCss[0]} card={this.props.theState.player1Cards[0]} src={p1card1img} onClick={() => this.props.onClick('card', true)}/>
            <SelectableCard className={this.props.theState.cardCss[1]} card={this.props.theState.player1Cards[1]} src={p1card2img} onClick={() => this.props.onClick('card', false)} />
          </div>
        </div>
        <div id="status-cards">
          <div id="last-card">
            {lastUsedHeader}
            {lastUsed}
          </div>
          <div id="next-card">
            <h2 className="nextHeader">Your Next Card</h2>
            <Card className="next-card" card={this.props.theState.nextCard} src={p1nextcard}/>
          </div>
        </div>
      </div>
    );
  }
}


/*
================================================================================================
Stateless Components
================================================================================================
*/

const Square = (props) => (
  <button className={props.active} onClick={props.onClick}>
    {props.value}
  </button>
)

const Start = (props) => (
  <button onClick={() => props.onClick()}>
    Game Start
  </button>
)

const Card = (props) => (
  <div className={props.className}>
    <h1 className="card-name">{props.card}</h1>
    <div className="lineup">
      <img alt="card" src={props.src}/> 
    </div>
  </div>
)

const SelectableCard = (props) => (
  <div className={props.className}  onClick={() => props.onClick()}>
    <h1 className="card-name">{props.card}</h1>
    <div className="lineup">
      <img alt="card" src={props.src}/> 
    </div>
  </div>
)

ReactDOM.render(
  <Game p1Name="player1"/>,
  document.getElementById('container')
);


/*
==============================================================================================

Functions

TODO: Currenty X doesn't move unless in danger, not even to captuer a 'o'. 
      Update which card is the new card / what card did cpu just draw
TOFIX:
      'X' Runs rather than prioritizes capturing threat
      'X' causes errors if only piece left and unwilling to put self in danger

==============================================================================================
*/

function cpuTurn(hand, dangerZones, sqArr, oppCard1, oppCard2, oState, difficulty) {
  let card1 = this.state[hand][0],
      card2 = this.state[hand][1],
      card1moves = this.state.cards[this.state[hand][0]],
      card2moves = this.state.cards[this.state[hand][1]],
      xMoves = [],
      priority = false,
      isX = false;
  const arrayOfAvailableMoves = [],
        moveType = {},
        oCaptureMove = [],
        currentOState = Object.assign({}, oState);

  for (let i=0; i<xXs.length; i++) {
    if(!this.state.xState[xXs[i]].isCaptured) {
      isX = xXs[i] === 'X';
      xMoves = calculateMoves(this.state.xState[xXs[i]].position, card1, card1moves, card2, card2moves, isX);
      if (xMoves[0] === 'WON') {
        return xMoves;
      } else if (xMoves.length > 0) {
        arrayOfAvailableMoves.push(xMoves);
      }
    }
  }

  for (let i in arrayOfAvailableMoves) {
    if (arrayOfAvailableMoves[i][0] === 'o') {
      oCaptureMove.push(arrayOfAvailableMoves[i]);
    } else if (arrayOfAvailableMoves[i][0] === 'DANGER' || arrayOfAvailableMoves[i][0] === 'priority') {
      return arrayOfAvailableMoves[i];
    }
  }

  if (oCaptureMove.length > 0) {
    return oCaptureMove[Math.floor(Math.random() * oCaptureMove.length)];
  } else {
    return arrayOfAvailableMoves[Math.floor(Math.random() * arrayOfAvailableMoves.length)];
  }

  function calculateMoves(pos, card1, move1, card2, move2, isX) {
    let currentPositionX = [pos[0],pos[1]];
    if (isX && dangerZones.hasOwnProperty([pos[0],pos[1]]) && !priority && dangerZones[currentPositionX].length === 1) {
      priority = oState[dangerZones[currentPositionX][0]].position; //coordinate of threat target
    }

    let aMove = calcMove(card1, move1);
    let bMove = calcMove(card2, move2);

    if(aMove.length === 0) {
      return bMove;
    } else if(bMove.length === 0){
      return aMove;
    } else if (bMove[0] === 'WON' || bMove[0] === 'DANGER') { //win or imminent danger, move to safety
      return bMove;
    } else if (aMove[0] === 'WON' || aMove[0] === 'DANGER'){
      return aMove;
    } else if (aMove === 'priority' || aMove === 'safeo') { //attack the imminent threat to remove danger
      return aMove;
    } else if (bMove === 'priority' || bMove === 'safeo') {
      return bMove;
    } else if (bMove[0] === 'safe') {
      return bMove;
    } else if (aMove[0] === 'safe'){
      return aMove;
    } else if (bMove[0] === 'o') {
      return bMove;
    } else if (aMove[0] === 'o'){
      return aMove;
    } else if(aMove.length < 2 && bMove.length < 2) {
      return [];
    } else {
      return Math.random() > 0.49999 ? aMove : bMove;
    }

    function calcMove(aCard, aMove) {
      let tempX, tempY, nextPositionX;
      const calcMoves = [];
      const dangerous = [];

      for (let i = 0; i < aMove.length; i++) {
        tempX = pos[0] + aMove[i][1]; //
        tempY = pos[1] - aMove[i][0]; //
        nextPositionX = [tempX, tempY];

        if (tempX > 4 || tempX < 0 || tempY > 4 || tempY < 0 || regexX.test(sqArr[tempX][tempY])) {
          continue;
        } else if ((isX && tempX === 4 && tempY === 2) || sqArr[tempX][tempY] === 'O') { 
          return ['WON', pos, aCard, [tempX, tempY]];
        } else if (isX && difficulty === "hard") {

          if (dangerZones.hasOwnProperty([nextPositionX])) { //next spot is threatened
            console.log("I'm in danger and can go to : ", tempX,',',tempY);
            dangerous.push(['dangerous', pos, aCard, [tempX,tempY]]);
            continue;
          } else {
            
            if (dangerZones[currentPositionX]) {

              if (!priority) {
                return ['DANGER', pos, aCard, [tempX,tempY]]; //move bitch get out da way   
              } else if (priority[0] === tempX && priority[1] === tempY) {
                return ['priority', pos, aCard, [tempX,tempY]];
              } else if (sqArr[tempX][tempY] === 'o') {
                return ['safeo', pos, aCard, [tempX,tempY]];
              } else { //not 2 threats, can't capture the threat, but the next position is safe
                calcMoves.push(['safe', pos, aCard, [tempX,tempY]]);
              }
            } else { //current position is safe and next position is safe
              if (sqArr[tempX][tempY] === 'o') {
                calcMoves.push(['o', pos, aCard, [tempX,tempY]]);
              } else {
                calcMoves.push(['empty', pos, aCard, [tempX,tempY]]);
              }
            } 
          }
          // if()
        } else if (difficulty === 'hard' && priority){
          if (priority[0] === tempX && priority[1] === tempY) {
            return ['priority', pos, aCard, [tempX, tempY]];
          } else if (sqArr[tempX][tempY] === 'o') {
            calcMoves.push(['o', pos, aCard, [tempX,tempY]]);
          } else {
            calcMoves.push(['empty', pos, aCard, [tempX,tempY]]);
          }
        } else {
          if (sqArr[tempX][tempY] === 'o') {
            calcMoves.push(['o', pos, aCard, [tempX,tempY]]);
          } else {
            calcMoves.push(['empty', pos, aCard, [tempX,tempY]]);
          }  
        }
      }

      //this added step for capturing 'o' comes after checking to see if capturing 'O' is possible
      for (let i = 0; i < calcMoves.length; i++) {
        if (calcMoves[i][0] === 'o') {
          return calcMoves[i];
        }
      }
      //If not moves, return no moves. Else return random move.
      if (isX && calcMoves.length === 0) {
        return dangerous[Math.floor(Math.random()*dangerous.length)];  
      } else if (calcMoves.length < 1) {
        return [];
      } else {
        return calcMoves[Math.floor(Math.random()*calcMoves.length)];  
      }
    }

  }
}

//Find array of valid moves with given unit & card.
function getValidSquares(x,y,val,sqArr) {
  const validSquares = [];
  let tempX, tempY;

  for (let i = 0; i<val.length; i++) {
    tempX = x - val[i][1];
    tempY = y + val[i][0];
    
    if (tempX > 4 || tempX < 0 || tempY > 4 || tempY < 0 ){
      continue;
    } else {
      if ((sqArr[tempX][tempY]) !== sqArr[x][y]) {
      // if(!regexO.test(sqArr[tempX][tempY])){
        validSquares.push([tempX,tempY]);
      }
    }
  }
  return validSquares;
}

function getCard(hand, deck){
  const tempDeck = deck.slice();
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
  const deckCopy = deck.slice();
  const newDeck = [];
  for (let i=0; i<deck.length; i++) {
    newDeck.push(deckCopy.splice(Math.random() * deckCopy.length, 1)[0]);
  }
  return newDeck;
}

function findConstCard(card) {
  if(card === 'Tiger'){
    return tiger;
  } else if (card === 'Monkey'){
    return monkey;
  } else if (card === 'Crab'){
    return crab;
  } else if (card === 'Crane'){
    return crane;
  } else if (card === 'Dragon'){
    return dragon;
  } else if (card === 'Elephant'){
    return elephant;
  } else if (card === 'Mantis'){
    return mantis;
  } else if (card === 'Boar'){
    return boar;
  } else if (card === 'Frog'){
    return frog;
  } else if (card === 'Goose'){
    return goose;
  } else if (card === 'Horse'){
    return horse;
  } else if (card === 'Eel'){
    return eel;
  } else if (card === 'Rabbit'){
    return rabbit;
  } else if (card === 'Rooster'){
    return rooster;
  } else if (card === 'Ox'){
    return ox;
  } else if (card === 'Cobra'){
    return cobra;
  }
  return null;
}