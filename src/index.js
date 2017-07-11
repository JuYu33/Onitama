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

class Cards extends Component {
  constructor() {
    super();
    this.state = {

      //access with cards[names[x]]
    }
  }

  render() {
    return (
      <div>
        <div>
          <div className="player-card"><h1>{this.props.nameOfCard1}</h1></div>
          <div className="player-card"><h1>{this.props.nameOfCard2}</h1></div>
        </div>
      </div>
    )
  }
}

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
      cards:  {
                triangle: [[0,1],[1,-1],[-1,1]],
                invTri: [[0,-1],[-1,1],[1,1]],
                upDown: [[0,-1],[0,1]],
                backDiag: [[1,1],[-1,-1]],
                forwDiag: [[-1,1],[1,-1]],
                cross: [[-1,0],[0,1],[1,0],[0,-1]],
                front: [[-1,1],[0,1],[1,1]]
              },
      deck: ['triangle', 'invTri', 'upDown', 'backDiag', 'forwDiag', 'cross', 'front'],
      selected: '',
      ping: 0,
      player1Cards: ['',''],
      player2Cards: ['',''],
      p1CardSelectIndex: 0,
      flag: true
    };
  }

  handleClick(x,y) {
    const squares = this.state.squares.slice();
    let regexO = /[oO]/

    if(regexO.test(squares[x][y]) && this.state.selected === '') {
      this.setState({selected: [x,y]});
      this.setState({ping: 1});

    } else if (this.state.selected.length !== '' && this.state.ping === 1) {
      let selectX = this.state.selected[0];
      let selectY = this.state.selected[1];

      squares[x][y] = squares[selectX][selectY] === 'O' ? 'O':'o';
      squares[selectX][selectY] = '';

      this.setState({selected: ''});
      this.setState({ping: 0});
    }
    this.setState({squares: squares});
  }

  renderSquare(x,y) {

    let classSqr = "square";
    if(this.state.selected[0] === x && this.state.selected[1] === y){
      classSqr = `square active pointer`;
    } else if(this.state.squares[x][y] === 'o' || this.state.squares[x][y] === 'O' || this.state.selected !== '') {
      classSqr = "square pointer";
    }

    return <Square active={classSqr} value={this.state.squares[x][y]} onClick={() => this.handleClick(x,y)} />;  
  }

  //TODO abstract away renderSquares to render only when changed
  render() {
    /*
    let deckLen = this.state.deck.length;
    let p1Hand = this.state.player1Cards;
    if(this.state.flag) {
      dealCard.call(this, p1Hand);
      this.setState({flag: false});
    }
    */

    //if card slot empty, call pullCard();
      //use set.State({})
      //this.state.player1Cards[0] = pullCard();
      //this.state.player1Cards[1] = pullCard();

// Math.floor(Math.rand(this.state.deck.length));

    return (
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
        <Cards nameOfCard1={this.state.player1Cards[0]} nameOfCard2={this.state.player1Cards[1]}/>
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
      deck: ['triangle', 'invTri', 'upDown', 'backDiag', 'forwDiag', 'cross', 'front'],
      p1Hand: ["initial","second"],
      p2Hand: ["",""]
    }
  }

  async gameStart(){
    await dealCard.call(this, "p1Hand");

    //console.log("Game starting");
    console.log("Player1 hand: ", this.state.p1Hand);
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Start onClick={() => this.gameStart()}/>
          <Board p1={this.state.p1Hand} p2={this.state.p2Hand}/>
          
        </div>
        <div className="game-info">
          <div>{/* status */}This is Onitama</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('container')
);

function calculateWinner(condition) {

  return null;
}


function dealCard(hand){
  console.log("Dealing cards");
  
  let hand0 = this.state[hand][0];
  let hand1 = this.state[hand][1];

  //console.log(hand0);

  if(hand0 === '') {
    //hand0 = pullCard(this.state.deck);
  }
  if(hand1 === ''){
    //hand1 = pullCard(this.state.deck);
  }
  hand0 = "card1";
  //console.log(hand0);
  hand1 = "Card 2";
  this.setState({[hand]: [hand0,hand1]});//TODO not player1hand

  //console.log("cards are now: ", this.state[hand]);
  //return null;
  
}

function pullCard(theDeck) {
  let tempDeck = this.state.deck.slice();
  let randomIndex = null;
  if(theDeck > 2){
    randomIndex = Math.floor(Math.rand() * theDeck);
  } else {
    shuffleDiscard(); // need to replenish deck
    randomIndex = Math.floor(Math.rand() * theDeck);
  }

  let returnCard = tempDeck.splice(randomIndex,1);
  this.setState({deck: tempDeck});
  console.log(this.state.deck);
  return returnCard;
}



function shuffleDiscard(){

}
