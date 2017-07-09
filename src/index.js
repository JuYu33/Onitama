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
      cards: {
        triangle: [[-1,0],[1,-1],[1,1]],
        upDown: [[-1,0],[1,0]],
        backDiag: [[-1,1],[1,-1]],
        forwDiag: [[-1,-1],[1,1]],
        cross: [[-1,0],[0,1],[1,0],[0,-1]]
      }
      //access with cards[names[x]]
    }
  }

  render() {
    console.log(this.state.names.length);


    return (
      <div>
        <div className="player-card"><h1>CARD 1</h1></div>
        <div className="player-card"><h1>CARD 2</h1></div>
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
      cardName: ['triangle', 'upDown', 'backDiag', 'forwDiag', 'cross'],
      selected: '',
      ping: 0
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
    } else if(this.state.squares[x][y] === 'o' || this.state.squares[x][y] === 'O') {
      classSqr = "square pointer";
    }

    return <Square active={classSqr} value={this.state.squares[x][y]} onClick={() => this.handleClick(x,y)} />;  
  }

  //TODO abstact away renderSquares to render only when changed
  render() {
    let x = Math.

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
        <Cards />
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
