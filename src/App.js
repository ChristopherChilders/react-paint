import React, { Fragment } from 'react';
// import logo from './logo.svg';
import './App.css';
import Canvas from './components/Canvas';

class App extends React.Component {

  render() {
    return (
      <Fragment>
        <h3 style={{ textAlign: 'center' }}>Paint</h3>
        <div className="main">
          <div className="color-guide">
            <h5>Color Guide</h5>
            <div className="user user">User</div>
            {/* <div className="user guest">Guest</div> */}
          </div>
          <Canvas />
        </div>
      </Fragment>
    );
  }
}

export default App;
