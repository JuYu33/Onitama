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

class Cards extends Component {
  constructor() {
    super();
    this.state = {
      //TODO: [x,y] remember to invert y
      //access with cards[names[x]]
    }
  }

  render() {
    //console.log(this.state.names.length);
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
    let deckLen = this.state.deck.length;
    console.log(this.state.player1Cards);
    let p1Hand = this.state.player1Cards;
    //{dealCard(p1Hand)}



    

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
      playerIsNext: true
    }
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
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

function dealCard(player1hand){
  let hand0 = player1hand[0];
  let hand1 = player1hand[1];
  if(hand0 === '') {
    //hand0 = pullCard(this.state.deck);
  }
  if(hand1 === ''){
    //hand1 = pullCard(this.state.deck);
  }
  this.setState({player1Cards: [hand0,hand1]});


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
