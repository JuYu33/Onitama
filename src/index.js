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
    }
  }

  //TODO: add card images
  render() {
    return (
      <div>
        <div id="player1-box">
          <div className="player-card">
            <h1>{this.props.nameOfCard1}</h1>

          </div>
          <div className="player-card">
            <h1>{this.props.nameOfCard2}</h1>

          </div>
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
      //p2: invert x not y
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
      validOptions: [],
      p1CardSelectIndex: 0,
      flag: true
    };
  }

  handleCardChoice(x){
    let select = x;

    this.setState({p1CardSelectIndex: select});
  }

  handleClick(x,y) {
    const squares = this.state.squares.slice();
    let regexO = /[oO]/

    if(regexO.test(squares[x][y]) && this.state.selected === '') {
      this.setState({selected: [x,y]});
      this.setState({ping: 1});

      //Calculate valid Squares;
      let cardName = this.state.player1Cards[this.state.p1CardSelectIndex];
      let cardArr = this.state.cards[cardName];

      for (let i = 0; i<cardArr.length; i++) {
        let tempX = x + cardArr[i][0];
        let tempY = y - cardArr[i][1];

        if (tempX > 4 || tmepX < 0 || tempY > 4 || tempY < 0){
          continue;
        }

        let tempArr = this.state.validOptions;
        tempArr.push([tempX,tempY]);
        this.setState({validOptions: tempArr});
      }
      //End Calculating valid Squares
      


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
      //TODO: Show valid Squares
      classSqr = `square active pointer`;
    } else if(this.state.squares[x][y] === 'o' || this.state.squares[x][y] === 'O' || this.state.selected !== '') {
      classSqr = "square pointer";
    }

    return <Square active={classSqr} value={this.state.squares[x][y]} onClick={() => this.handleClick(x,y)} />;  
  }

  //TODO abstract away renderSquares to render only when changed
  render() {
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
        <Cards nameOfCard1={this.props.p1[0]} nameOfCard2={this.props.p1[1]}/>
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
      discard: [],
      p1Hand: ["",""],
      p2Hand: ["",""],
      start: false
    }
  }

  //deal cards to players and load board
  async gameStart(){
    let tempDeck = this.state.deck.slice();
    let newDeckState = dealCard.call(this, "p1Hand", tempDeck);
    tempDeck = newDeckState[0];
    await this.setState({p1Hand: [newDeckState[1][0], newDeckState[2][0]]})
    newDeckState = dealCard.call(this, "p2Hand", tempDeck);
    await this.setState({p2Hand: [newDeckState[1][0], newDeckState[2][0]]})
    await this.setState({deck: newDeckState[0]});

    this.setState({start: true});
  }

  render() {
    let gameState = this.state.start ? <Board p1={this.state.p1Hand} p2={this.state.p2Hand}/> : <Start onClick={() => this.gameStart()}/>;

    return (
      <div className="game">
        <div className="game-board">

          {gameState}

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
  <Game p1Name="player1"/>,
  document.getElementById('container')
);

function calculateWinner(condition) {

  return null;
}


function dealCard(hand, deck){
  let pulledCards = [];
  let tempDeck = deck.slice();
  let hand0 = this.state[hand][0];
  let hand1 = this.state[hand][1];

  if(hand0 === '') {
    let randomIndex = Math.floor(Math.random() * tempDeck);
    hand0 = tempDeck.splice(randomIndex,1);
  }
  if(hand1 === ''){
    let randomIndex = Math.floor(Math.random() * tempDeck);
    hand1 = tempDeck.splice(randomIndex,1);
  }

  return [tempDeck, hand0, hand1];
}



function shuffleDiscard(){
  return null;
}
