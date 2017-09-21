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


/*
================================================================================================
Main Game Component
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
      isCaptured: false,
      cpuMoves: [],
      difficulty: 'easy',
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
                    },
      dangerZone: {}
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
    if(this.state.winner){
      return;
    } else if (type === 'card'){
        if(x){
          await this.setState({cardCss: ["card1 selected-card", "card2"],
                                p1CardIndex: 0
          })
        } else {
          await this.setState({cardCss: ["card1", "card2 selected-card"],
                                p1CardIndex: 1
          })
        }
        if(this.state.pieceIsSelected) {
          const squares = this.state.squares.slice();
          let cardName = this.state.player1Cards[this.state.p1CardIndex];
          let cardArr = this.state.cards[cardName];
          const tempSqr = getValidSquares(this.state.selected[0],this.state.selected[1],cardArr,squares);
          
          await this.setState({validSquares: tempSqr});
        }   
    } else if (type ==='square') {
      let isCpuTurn = false;
      const squares = this.state.squares.slice();
      let isValid = false;

      //check if the clicked square is valid move from selected position
      for (let i = 0; i<this.state.validSquares.length; i++) {
        if(x === this.state.validSquares[i][0] && y === this.state.validSquares[i][1]) {
          isValid = true;
        }
      }
      //if is oO & nothing selected, get valid squares
      if(regexO.test(squares[x][y]) && (!this.state.pieceIsSelected || regexO.test(squares[x][y]))) { //clicked your own piece when nothing was clicked before
        await this.setState({selected: [x,y],
                              pieceIsSelected: true
        });

        if(this.state.p1CardIndex >= 0){
          let cardName = this.state.player1Cards[this.state.p1CardIndex];
          let cardArr = this.state.cards[cardName];
          const tempSqr = getValidSquares(this.state.selected[0],this.state.selected[1],cardArr,squares);
          
          await this.setState({validSquares: tempSqr});  
        }
      } else if (this.state.pieceIsSelected && isValid) { //moving your piece to a valid location
        isCpuTurn = true;
        let newXstate = false;
        if(squares[x][y] === 'x'){
          if(!this.state.xState.x1.isCaptured){
            if(this.state.xState.x1.position[0] === x && this.state.xState.x1.position[1] === y){
              newXstate = Object.assign({}, this.state.xState, {x1: {isCaptured: true}});
            }
          }
          if(!this.state.xState.x2.isCaptured){
            if (this.state.xState.x2.position[0] === x && this.state.xState.x2.position[1] === y){
              newXstate = Object.assign({}, this.state.xState, {x2: {isCaptured: true}});
            }
          }
          if(!this.state.xState.x3.isCaptured){
            if (this.state.xState.x3.position[0] === x && this.state.xState.x3.position[1] === y){
              newXstate = Object.assign({}, this.state.xState, {x3: {isCaptured: true}});
            }
          }
          if (!this.state.xState.x4.isCaptured){
            if (this.state.xState.x4.position[0] === x && this.state.xState.x4.position[1] === y){
              newXstate = Object.assign({}, this.state.xState, {x4: {isCaptured: true}});
            }
          }
        } else if (squares[x][y] === 'X'){
          newXstate = Object.assign({}, this.state.xState, {X: {isCaptured: true}});
          console.log("you won?"); 
          await this.setState({winner: 'player1',
                                validSquares: [x,y],
                                squares: squares,
                                xState: newXstate
          });
        }
        if(newXstate && !this.state.winner){
          await this.setState({xState: newXstate});
        }

        let tempDeck;
        //set new position for display
        let prevX = this.state.selected[0];
        let prevY = this.state.selected[1];
        squares[x][y] = squares[prevX][prevY] === 'O' ? 'O':'o';
        squares[prevX][prevY] = '';
        await this.setState({selected: '',
                              pieceIsSelected: false,
                              validSquares: ''
        });
        if(squares[x][y] === 'O'){
          this.setState({positionO: [x,y]});
        }
        //TODO: checkwincondition position 0,2;
        // if(false){
         
        // }
        //if not enough cards shuffle discard into deck;
        if(!this.state.winner) {
          if(this.state.deck.length <= 2){
            let tempDiscard = this.state.discard.slice();
            tempDeck = this.state.deck.slice();
            tempDiscard = shuffleDeck(tempDiscard);
            let deckDiscard = tempDeck.concat(tempDiscard);
            await this.setState({deck: deckDiscard,
                                  discard: []
            });
          }
          //put used card in discard
          let discard = this.state.player1Cards[this.state.p1CardIndex];
          let tempDiscard = this.state.discard;
          tempDiscard.push(discard);
          tempDeck = this.state.deck.slice();
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
        // this.setState({selected: '',
        //                 pieceIsSelected: false
        // });

      }
      // TODO: UNDO?
      // await this.setState({squares: squares});

      if(isCpuTurn && !this.state.winner){
      //TODO: find out why this is creating new pieces with random moves
        let oppCard1 = this.state.cards[this.state.player1Cards[0]],
            oppCard2 = this.state.cards[this.state.player1Cards[1]];
        const cpu = cpuTurn.call(this, "player2Cards", this.state.positionO, squares, oppCard1, oppCard2, this.state.oState, this.state.difficulty);
        const xXs = ['X', 'x1', 'x2', 'x3', 'x4'];
        const originalPosition = cpu[1],
              cpuCardName = cpu[2],
              newPosition = cpu[3];
        for (let i in xXs) {
          if (this.state.xState[xXs[i]].position === originalPosition){
            const newXstate = Object.assign({}, this.state.xState, {[xXs[i]]: {isCaptured: false, position: newPosition}});
            await this.setState({xState: newXstate});
          }
        }

        let deckCopy = this.state.deck.slice();
        //shuffle discard
        if(deckCopy.length <= 2){
          let tempDiscard = this.state.discard.slice();
          const tempDeck = this.state.deck.slice();
          tempDiscard = shuffleDeck(tempDiscard);
          let deckDiscard = tempDeck.concat(tempDiscard);
          await this.setState({deck: deckDiscard,
                                discard: []
          });
        }

        deckCopy = this.state.deck.slice();
        const nextCard = deckCopy.splice(1,1);
        const handCopy = this.state.player2Cards.slice();
        if(handCopy[0] === cpuCardName){
          handCopy[0] = nextCard[0];
        } else {
          handCopy[1] = nextCard[0];
        }

        squares[newPosition[0]][newPosition[1]] = squares[originalPosition[0]][originalPosition[1]] === 'X' ? 'X' : 'x';
        squares[originalPosition[0]][originalPosition[1]] = '';

        let usedCard = this.state.discard.slice();
        usedCard.push(cpuCardName);

        this.setState({discard: usedCard,
                        cpuMoves: [[newPosition[0], newPosition[1]], [originalPosition[0], originalPosition[1]]],
                        player2Cards: handCopy,
                        deck: deckCopy,
                        p2LastUsed: cpuCardName,
                        squares: squares
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
    let gameState = this.state.start ? <Board theState={this.state} onClick={(type,x,y) => {this.handleClick(type,x,y)}}/> : <Start onClick={() => this.gameStart()}/>;

    return (
      <div>
        {gameState}
      </div>
    );
  }
}

// ==============================================================================================
/*





*/
// ==============================================================================================


class Board extends Component {

  constructor() {
    super();
    this.state = {
      cardCss: ['card1', 'card2'],
      count: 0
    }
  }

  renderSquare(x,y) {
    let classSqr = "square";
    
    //If pieceIsSelected, only show valid move options, otherwise pieces are selectable.

    // if(this.props.theState.cpuMoves.length > 0) {
    //   if((this.props.theState.cpuMoves[0][0] === x && this.props.theState.cpuMoves[0][1] === y) || (this.props.theState.cpuMoves[1][0] === x && this.props.theState.cpuMoves[1][1] === y)){
    //     classSqr = `square cpuMove`;
    //   }
    // }

    if(this.props.theState.pieceIsSelected){
      for (let i = 0; i<this.props.theState.validSquares.length; i++){
        if(this.props.theState.validSquares[i][0] === x && this.props.theState.validSquares[i][1] === y) {
          classSqr = "square pointer";
        }
      }
    } else {
      if(this.props.theState.squares[x][y] === 'o' || this.props.theState.squares[x][y] === 'O') {
        classSqr = "square pointer";
      }
    }
    //If piece selected, highlight accordingly
    if(this.props.theState.selected[0] === x && this.props.theState.selected[1] === y){
      classSqr = `square active pointer`;
    }
    //TODO: CSS for opponent moves
    if(this.props.theState.cpuMoves.length > 0) {
      if((this.props.theState.cpuMoves[0][0] === x && this.props.theState.cpuMoves[0][1] === y) || (this.props.theState.cpuMoves[1][0] === x && this.props.theState.cpuMoves[1][1] === y)){
        classSqr = `square cpuMove`;
      }
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
    return <Square active={classSqr} value={this.props.theState.squares[x][y]} onClick={() => this.props.onClick('square',x,y)} />;  
  }


  render() {
    let p1card1img = findConstCard(this.props.theState.player1Cards[0]);
    let p1card2img = findConstCard(this.props.theState.player1Cards[1]);
    let p2card1img = findConstCard(this.props.theState.player2Cards[0]);
    let p2card2img = findConstCard(this.props.theState.player2Cards[1]);
    let p2lastcard = findConstCard(this.props.theState.p2LastUsed);
    let p1nextcard = findConstCard(this.props.theState.nextCard);

    let lastUsedHeader = this.props.theState.p2LastUsed.length > 0 ? <h2 className="lastUsedHeader">Opponent Last Used: </h2> : null;
    let lastUsed = this.props.theState.p2LastUsed.length > 0 ? <Card className="last-card upside-down" card={this.props.theState.p2LastUsed} src={p2lastcard}/> : null;
    let selectCardPrompt = this.props.theState.p1CardIndex >= 0 ? null : <h2 className="highlight">Please select one of your cards cards below</h2>;
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
          {lastUsedHeader}
          {lastUsed}
          <Card className="next-card" card={this.props.theState.nextCard} src={p1nextcard}/>
          <h2>Your Next Card</h2>
        </div>
      </div>
    );
  }
}


// ==============================================================================================
/*





*/
// ==============================================================================================


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


// ==============================================================================================
/*
TODO: Currenty X doesn't move unless in danger, not even to captuer a 'o'. 

Check if X is in danger.
If in danger move X.
  Check if new position is in danger.
  if new position in danger, repeat until new move is found
    if no good moves found. randomize move of X

X is not capturing. I think should be fine.

Can push Xmove to random moves as long as no danger is present. 
so check for danger. within the move options.

x
not capturing properly



*/
// ==============================================================================================


function cpuTurn(hand, posO, sqArr, oppCard1, oppCard2, oState, difficulty) {
  let winningMoveFound = false,
      card1 = this.state[hand][0],
      card2 = this.state[hand][1],
      card1moves = this.state.cards[this.state[hand][0]],
      card2moves = this.state.cards[this.state[hand][1]],
      x1move = [],
      x2move = [],
      x3move = [],
      x4move = [];
  const arrayOfAvailableMoves = [];

  //Calcuate array of danger moves here with getValidSquares
  
  

  //if available: calculateMoves
  //TODO: concat this all into one loop for all 4;
  let Xmove = calculateMoves(this.state.xState.X.position, card1, card1moves, card2, card2moves, true);
  if(Xmove[0] === ('WON' || 'DANGER' || 'O')){
    return Xmove;
  }
  if(!this.state.xState.x1.isCaptured){
    x1move = calculateMoves(this.state.xState.x1.position, card1, card1moves, card2, card2moves, false);
    if(x1move[0] === ('O')){
      return x1move;
    } else {
      arrayOfAvailableMoves.push(x1move);      
    }
  }
  if(!this.state.xState.x2.isCaptured) {
    x2move = calculateMoves(this.state.xState.x2.position, card1, card1moves, card2, card2moves, false);
    if(x2move[0] === ('O')){
      return x2move;
    } else {
      arrayOfAvailableMoves.push(x2move);
    }
  }
  if(!this.state.xState.x3.isCaptured) {
    x3move = calculateMoves(this.state.xState.x3.position, card1, card1moves, card2, card2moves, false);
    if(x3move[0] === ('O')){
      return x3move;
    } else {
      arrayOfAvailableMoves.push(x3move);
    }
  }
  if(!this.state.xState.x4.isCaptured) {
    x4move = calculateMoves(this.state.xState.x4.position, card1, card1moves, card2, card2moves, false);
    if(x4move[0] === ('O')){
      return x4move;
    } else {
      arrayOfAvailableMoves.push(x4move);
    }
  }

  //create array of capturing moves;
  const oCaptureMove = [];
  for(let i in arrayOfAvailableMoves){
    if (arrayOfAvailableMoves[i][0] === 'o'){
      oCaptureMove.push(arrayOfAvailableMoves[i]);
    }
  }

  //not capturing 'O' so check for 'o'. Else perform random move
  if(oCaptureMove.length > 0 ){
    return oCaptureMove[Math.floor(Math.random() * oCaptureMove.length)];
  } else if (arrayOfAvailableMoves.length === 0){
    return Xmove;
  } else {
    return arrayOfAvailableMoves[Math.floor(Math.random() * arrayOfAvailableMoves.length)];
  }

  function calculateMoves(pos, card1, move1, card2, move2, isX) {

    let aMove = calcMove(card1, move1);
    let bMove = calcMove(card2, move2);

    if ((aMove.length < 2 && bMove.length > 2) || bMove[0] === ('O' || 'o' || 'WON')) {
      return bMove;
    } else if ((bMove.length < 2 && aMove.length > 2) || aMove[0] === ('O' || 'o' || 'WON')){
      return aMove;
    } else if(aMove.length < 2 && bMove.length < 2) {
      return [];
    } else {
      return Math.random() > 0.49 ? aMove : bMove;
    }

    function calcMove(aCard, aMove){
      let tempX, tempY, oDangerX, oDangerY;
      const calcMoves = [];
      for (let i in aMove){
        tempX = pos[0] + aMove[i][1]; //
        tempY = pos[1] - aMove[i][0]; //

        //Checks if Master moves to gate.

        /*
        elephant: [[-1,1],[-1,0],[1,1],[1,0]],
        frog: [[-2,0], [-1,1], [1,-1]],
        */
        if (isX) {
          if (tempX === 4 && tempY === 2) {
            return ['WON', pos, aCard, [tempX, tempY]];
          } else {

            //Abstact to another function?
            //Find array of danger zones first
            oDangerX = pos[0] + aMove[i][1];// actually Y-axis
            oDangerY = pos[1] - aMove[i][0];// actually X-axis

            if (sqArr[oDangerX][oDangerY] === ('o' || 'O')) {
              //Danger found calculate move here:
            }

          }
        }

        if (tempX > 4 || tempX < 0 || tempY > 4 || tempY < 0) {
          continue;
        } else {
          if (!/[xX]/.test(sqArr[tempX][tempY])) {            
            if (/O/.test(sqArr[tempX][tempY])) {
              return ['O', pos, aCard, [tempX,tempY]];
            } else if (/o/.test(sqArr[tempX][tempY])) {
              calcMoves.push(['o', pos, aCard, [tempX,tempY]]);
            } else {
              calcMoves.push(['empty', pos, aCard, [tempX,tempY]]);
            }
          }
        }
      }
      //this added step for capturing 'o' comes after checking to see if capturing 'O' is possible
      for (let i in calcMoves) {
        if (calcMoves[i][0] === 'o') {
          return calcMoves[i];
        }
      }
      if (calcMoves.length < 1) {
        return [];
      } else {
        return calcMoves[Math.floor(Math.random()*calcMoves.length)];  
      }
      return [];//just in case but not really needed..
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