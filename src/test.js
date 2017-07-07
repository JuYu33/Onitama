
var Tags = React.createClass({
  getInitialState: function(){
    return {
      selected:''
    }
  },
  setFilter: function(filter) {
    this.setState({selected  : filter})
    this.props.onChangeFilter(filter);
  },
  isActive:function(value){
    console.log('btn '+((value===this.state.selected) ?'active':'default'));
    return 'btn '+((value===this.state.selected) ?'active':'default');
    
    
  },
  render: function() {
    return <div className="tags">
      <button className={this.isActive('')} onClick={this.setFilter.bind(this, '')}>All</button>
      <button className={this.isActive('male')} onClick={this.setFilter.bind(this, 'male')}>male</button>
      <button className={this.isActive('female')} onClick={this.setFilter.bind(this, 'female')}>female</button>
      <button className={this.isActive('child')} onClick={this.setFilter.bind(this, 'child')}>child</button>
      <button className={this.isActive('blonde')} onClick={this.setFilter.bind(this, 'blonde')}>blonde</button>
     </div>
  }
});

var Kid = React.createClass({
  render: function() {
    return <ul>
      <li>{this.props.name}</li>
      </ul>
  }
});

var List = React.createClass({
  getInitialState: function() {
    return {
      filter: ''
    };
  },
  changeFilter: function(filter) {
    this.setState({
      filter: filter
    });
  },
  render: function() {
    var list = this.props.Data;

    if (this.state.filter !== '') {
      list = list.filter((i)=> i.tags.indexOf(this.state.filter) !== -1);
    } 

    list = list.map(function(Props){
      return <Kid {...Props} />
    });

    return <div>
      <h2>Kids Finder</h2>
      <Tags onChangeFilter={this.changeFilter}/>
      {list}
    </div>
  }
});

var options = {
  Data:  [{
    name: 'Eric Cartman',
    tags: ['male', 'child']
  },{
    name: 'Wendy Testaburger',
    tags: ['female', 'child']
  },{
    name: 'Randy Marsh',
    tags: ['male']
  },{
    name: 'Butters Stotch',
    tags: ['male', 'blonde', 'child']
  },{
    name: 'Bebe Stevens',
    tags: ['female', 'blonde', 'child']
  }]
};

var element = React.createElement(List, options);
React.render(element, document.body);