import React from 'react';
// import logo from './logo.svg';
import './App.css';
import Canvas from './components/Canvas';

class App extends Component {

  render() {
    return (
      <Fragment>
        <h3 style={{ textAlign: 'center' }}>Dos Paint</h3>
        <div className="main">
          <div className="color-guide">
            <h5>Color Guide</h5>
            <div className="user user">User</div>
            <div className="user guest">Guest</div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default App;
