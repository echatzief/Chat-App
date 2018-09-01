import React,{Component} from 'react';
import './css/Login.css';

class SignUp extends Component{
  render(){
    return(
      <div className="container is-fullhd containerCustom" style={{display:this.props.signUpDis}}>

        {/* Username Input*/}
        <div className="field">
          <p className="control has-icons-left has-icons-right">
            <input className="input is-rounded is-medium inputCustom" type="text" placeholder="Username" onChange={this.props.changeUsername} value={this.props.username}/>
          </p>
        </div>

        {/* Password Input*/}
        <div className="field">
          <p className="control has-icons-left">
            <input className="input is-rounded is-medium inputCustom" type="password" placeholder="Password" onChange={this.props.changePassword} value={this.props.pwd}/>
          </p>
        </div>

        {/* Key to Sign Up Input*/}
        <div className="field">
          <p className="control has-icons-left">
            <input className="input is-rounded is-medium inputCustom" type="password" placeholder="Key To signUp" onChange={this.props.changeKey}  value={this.props.keyToSign}/>
          </p>
        </div>

        {/* Sign Up Button */}
        <div className="field has-text-centered">
          <a className="button is-medium logBut" onClick={this.props.doAction} >Sign Up</a>
        </div>
      </div>
    );
  }
}

export default SignUp;
