import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
//<button className="square" onClick={() => props.onClick()}> //line7
const Square = (props) => (
  <button className={props.active} onClick={() => props.onClick()}>
    {props.value}
  </button>
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
      selected: '',
      ping: 0,
      activity: 'active'
    };

    //Added testClick
    //this.handleClick = this.handleClick.bind(this);
  }

  handleClick(x,y) {
    const squares = this.state.squares.slice();
    let regexO = /[oO]/
    let regexX = /[xX]/

    //test

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

  isActive(){
    return null;
  }

  renderSquare(x,y) {
    let blah = "square";
    //console.log("selected is here: ", this.state.selected, [x,y]);
    if(this.state.selected[0] === x && this.state.selected[1] === y){
      blah = `square ${this.state.activity}`;
      //console.log(`{this.state.activity}`);
    }

    return <Square active={blah} value={this.state.squares[x][y]} onClick={() => this.handleClick(x,y)} />;
    //testClick
    //return <Square value={this.state.squares[i]} onClick={this.handleClick(i)} />;
  
}
  render() {
    const status = 'Next player: 1';
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
