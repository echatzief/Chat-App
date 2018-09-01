import React,{Component} from 'react';
import './css/Entrance.css';

class EntranceMenuButtons extends Component{
  render(){
    return(
      <div className="container" style={{display:this.props.menuDis}}>
        <div className="field has-text-centered">
          <a className="button is-medium butsCustom" style={{background:this.props.loginBackgroundColor,borderColor:this.props.loginBorderColor,color:this.props.loginFontColor}} onClick={this.props.loginClick}>Login</a>
          <a className="button is-medium butsCustom" style={{background:this.props.signUpBackgroundColor,borderColor:this.props.signUpBorderColor,color:this.props.signUpFontColor}} onClick={this.props.signUpClick}>SignUp</a>
        </div>
      </div>
    );
  }
}

export default EntranceMenuButtons;
