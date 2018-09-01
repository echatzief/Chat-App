import React,{Component} from 'react';
import './css/overlay.css';

class Overlay extends Component{
  render(){
    return(
      <div className="tile is-parent messageDiv" style={{display:this.props.overlayDis}}>
        <div className="notification has-text-centered">
          <div className="container">
            {this.props.message}
          </div>
          <div className="container">
            <a className="button is-medium overlayClose" onClick={this.props.closeClick}>Close</a>
          </div>
        </div>
      </div>
    );
  }
}

export default Overlay;
