import React, {Component} from 'react';
import ReactDOM from 'react-dom';
//import App from './App';
//import ReactFancybox from 'react-fancybox';
import './index.css';


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

const Card = (props) => (
  <div className={props.className} onClick={() => props.onClick()}>
    <h1>{props.card}</h1>
    <img src={props.src} alt={props.card} height="250px" width="250px"/>
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
      //TODO: [x,y] remember to invert y
      //p2: invert x not y
      isCaptured: {O: false, X: false},
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
      deck: ['tiger', 'crab', 'monkey', 'crane', 'dragon', 'elephant', 'mantis', 'boar', 'frog', 'goose', 'horse', 'eel', 'rabbit', 'rooster', 'ox', 'cobra'],
      discard: [],
      selected: '',
      isSelected: false,
      nextCard: [],
      player1Cards: ['',''],
      player2Cards: ['',''],
      validSquares: [],
      p1CardIndex: 0,
      p2LastUsed: '',
      cardCss: ['card1 selected-card', 'card2']
    };
  }

  //From the props set the hands of players and update the deck.
  async componentWillMount() {

    let tempDeck = this.state.deck.slice();
    let newDeckState = getCard.call(this, "player1Cards", tempDeck);
    tempDeck = newDeckState[0];
    await this.setState({player1Cards: [newDeckState[1][0], newDeckState[2][0]]})
    newDeckState = getCard.call(this, "player2Cards", tempDeck);
    await this.setState({player2Cards: [newDeckState[1][0], newDeckState[2][0]]})
    await this.setState({deck: newDeckState[0]});

    let nextCard = new Array(newDeckState[0][0]);
    await this.setState({nextCard: nextCard});
  }

  selectThisCard(isCard1){
    if(isCard1){
      this.setState({cardCss: ["card1 selected-card", "card2"]})
      this.setState({p1CardIndex: 0})
    } else {
      this.setState({cardCss: ["card1", "card2 selected-card"]})
      this.setState({p1CardIndex: 1})
    }

    if(this.state.isSelected) {
      this.setState({isSelected: false});
      this.setState({selected: ''});
    }
  }

  async handleClick(x,y) {
    const squares = this.state.squares.slice();
    let regexO = /[oO]/
    let isValid = false;
    for (let i = 0; i<this.state.validSquares.length; i++) {
      if(x === this.state.validSquares[i][0] && y === this.state.validSquares[i][1]) {
        isValid = true;
      }
    }

    //if is oO & nothing selected set selected, get valid squares
    if(regexO.test(squares[x][y]) && !this.state.isSelected) {
      await this.setState({selected: [x,y]});
      await this.setState({isSelected: true});

      let cardName = this.state.player1Cards[this.state.p1CardIndex];
      let cardArr = this.state.cards[cardName];
      let tempSqr = getValidSquares(x,y,cardArr);
      let sqrL = tempSqr.length;

      //Prevent capturing your own pieces
      for (let i = sqrL-1; i>=0; i--) {
        if (regexO.test(squares[tempSqr[i][0]][tempSqr[i][1]])) {
          tempSqr.splice(i,1);
        }
      }
      await this.setState({validSquares: tempSqr});

      //if selected piece moves to valid square
      //DONE: update positioning
      //TODO: Check win condition
      //      if (! YouWon) {
      //        move used card to discard pile. 
      //        update and clear CSS
      //        deal next card
      //        run Opponent turn function
      //        check if opponent won
      //        update following: opponent card, last used card, show next card
      //      }
      //      repeat
      
    } else if (this.state.isSelected && isValid) { 
      let prevX = this.state.selected[0];
      let prevY = this.state.selected[1];
      squares[x][y] = squares[prevX][prevY] === 'O' ? 'O':'o';
      squares[prevX][prevY] = '';
      this.setState({selected: ''});
      this.setState({isSelected: false}); 
    } else {
      this.setState({selected: ''});
      this.setState({isSelected: false});
    }
    this.setState({squares: squares});
  }

  renderSquare(x,y) {
    let classSqr = "square";
    
    //If a piece is selected, only show valid move options, otherwise pieces are selectable.
    if(this.state.isSelected){
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
    let p2src = `/image/${this.state.player2Cards[0]}.png`;
    console.log(p2src);
    return (
      <div className="game">
        <div id="game-board">
          <div id="player-box">
            <Card className="card1" card={this.state.player2Cards[0]} src={p2src}/>
            <Card className="card2" card={this.state.player2Cards[1]}/>
          </div>
          <div>
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
            <Card className={this.state.cardCss[0]} card={this.state.player1Cards[0]} onClick={() => this.selectThisCard(true)}/>
            <Card className={this.state.cardCss[1]} card={this.state.player1Cards[1]} onClick={() => this.selectThisCard(false)} />
          </div>
        </div>
        <div id="status-cards">

          
          <h1>Your Next Card: </h1>
          <Card className="next-card" card={this.state.nextCard}/>

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

function getValidSquares(x,y,val){
  let validSquares = [];
  let tempX, tempY;

  for (let i = 0; i<val.length; i++) {
    tempY = y + val[i][0];
    tempX = x - val[i][1];
    
    if (tempX > 4 || tempX < 0 || tempY > 4 || tempY < 0){
      continue;
    } else {
      validSquares.push([tempX,tempY]);
    }
  }
  validSquares.push([x,y]);

  return validSquares;
}

function getCard(hand, deck){
  let pulledCards = [];
  let tempDeck = deck.slice();
  let hand0 = this.state[hand][0];
  let hand1 = this.state[hand][1];
  let randomIndex = null;

  if(hand0 === '') {
    randomIndex = Math.floor(Math.random() * tempDeck.length);
    hand0 = tempDeck.splice(randomIndex,1);
  }
  if(hand1 === ''){
    randomIndex = Math.floor(Math.random() * tempDeck.length);
    hand1 = tempDeck.splice(randomIndex,1);
  }

  return [tempDeck, hand0, hand1];
}



function shuffleDiscard(){
  return null;
}
