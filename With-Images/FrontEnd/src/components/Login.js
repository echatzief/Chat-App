import React,{Component} from 'react';
import './css/Login.css';


class Login extends Component{
  render(){
    return(
      <div className="container is-fullhd containerCustom" style={{display:this.props.loginDis}}>

        {/* Username Input*/}
        <div className="field">
          <p className="control has-icons-left has-icons-right">
            <input className="input is-rounded is-medium inputCustom" type="text" onChange={this.props.changeUsername} value={this.props.username} placeholder="Username" required/>
          </p>
        </div>

        {/* Password Input*/}
        <div className="field">
          <p className="control has-icons-left">
            <input className="input is-rounded is-medium inputCustom" type="password" onChange={this.props.changePassword} value={this.props.pwd} placeholder="Password" required/>
          </p>
        </div>

        {/* Login Button*/}
        <div className="field has-text-centered">
          <a className="button is-medium logBut" onClick={this.props.doAction}  >Login</a>
        </div>
      </div>
    );
  }
}

export default Login;
