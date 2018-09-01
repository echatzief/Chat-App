import React,{Component} from 'react';
import EntranceMenuButtons from './EntranceMenuButtons';
import Overlay from './Overlay';
import './css/Entrance.css';
import Login from './Login';
import SignUp from './SignUp';
import axios from 'axios';


class Entrance extends Component{
  constructor(){
    super();
    this.state=({
      loginBackgroundColor:'#3B404F', /* Background color of the login button */
      loginBorderColor:'#3B404F',     /* Border color of the login button */
      loginFontColor:'#FFF',          /* Font color of the login button */
      signUpBackgroundColor:'#FFF',   /* Background color of the sign up button */
      signUpBorderColor:'#FFF',       /* Border color of the sign up button */
      signUpFontColor:'black',        /* Font color of the sign up button */
      overlayDis:'none',              /* Overlay Display */
      menuDis:'block',                /* Menu Button Display */
      msg:'Message',                  /* Message shown at the overlay */
      loginDis:'block',               /* Login Form Display */
      signUpDis:'none',               /* Sign Up Display */
      username:'',                    /* Username */
      pwd:'',                         /* Password */
      keyToSign:'',                   /* Key to pass the signUp */
    });
  }

  /* Swap the menu to Login */
  changeToLogin =()=>{
    this.setState({
      loginBackgroundColor:'#3B404F',
      loginBorderColor:'#3B404F',
      loginFontColor:'#FFF',
      signUpBackgroundColor:'#FFF',
      signUpBorderColor:'#FFF',
      signUpFontColor:'black',
      loginDis:'block',
      signUpDis:'none',
    });

    /*Clear the fields */
    this.setState({
      username:'',
      pwd:'',
      keyToSign:'',
    });
  }

  /* Swap the menu to SignUp */
  changeToSign = ()=>{
    this.setState({
      loginBackgroundColor:'#FFF',
      loginBorderColor:'#FFF',
      loginFontColor:'black',
      signUpBackgroundColor:'#3B404F',
      signUpBorderColor:'#3B404F',
      signUpFontColor:'#FFF',
      loginDis:'none',
      signUpDis:'block',
    });

    /*Clear the fields */
    this.setState({
      username:'',
      pwd:'',
      keyToSign:'',
    });
  }

  changeOverlay =()=>{

    if(this.state.overlayDis==='block'){
      //Ιf we had chosen the login
      this.setState({
        loginBackgroundColor:'#3B404F',
        loginBorderColor:'#3B404F',
        loginFontColor:'#FFF',
        signUpBackgroundColor:'#FFF',
        signUpBorderColor:'#FFF',
        signUpFontColor:'black',
        loginDis:'block',
        menuDis:'block',
        signUpDis:'none',
        overlayDis:'none',
      });
    }
    else{
      this.setState({
          overlayDis:'block',
          menuDis:'none',
          loginDis:'none',
          signUpDis:'none',
      });
    }
  }

  /* Change the username of the user */
  changeUsername =(e)=>{
    var user=e.target.value;
    this.setState({
      username:user,
    });
  }

  /* Change the password */
  changePassword = (e)=>{
    var pass=e.target.value;
    this.setState({
      pwd:pass,
    });
  }
  /* Change the key to signUp */
  changeKey =(e)=>{
    var key=e.target.value;
    this.setState({
      keyToSign:key,
    });
  }


  /*
    We Login or Sign Up.We use axios post in order to communicate
    with the backend.If we login or sign up we print msg
  */
  doAction =()=>{

    if(this.state.signUpDis==='none'){

      /* Login Part */
      var username=this.state.username;
      var password=this.state.pwd;

      /* Send the data to server with post request to backend server */
      axios.post('/login', { username,password})
       .then(res => {
         console.log(res);
         if(res.status===200){
           this.setState({
             msg:'[Success] You Can Now Enter.',
           });
           /* If the login is successful redirect to main */
           this.props.history.push('/main?'+this.state.username);
         }
         else if(res.status===204){
           this.setState({
             msg:'[Error] User doesnt Exist to Database.',
           });
           this.changeOverlay();

           /* Reset all the fields we need to reuse */
           this.setState({
             username:'',
             pwd:'',
             keyToSign:'',
           });
         }
       });
    }
    else{
        /* Sign Up Part */
        var username=this.state.username;
        var password=this.state.pwd;
        var key=this.state.keyToSign;

        /* Send the data to server with post request to backend server */
        axios.post('/signUp', { username,password,key})
         .then(res => {
           console.log(res);
           /* If the signUp is successful print success message */
           if(res.status===200){
             this.setState({
               msg:'[Success] A new Account Has Been Created.',
             });
             this.changeOverlay();
           }
           else if(res.status===204){
             this.setState({
               msg:'[Error] Cant Sign Up To Database.',
             });
             this.changeOverlay();
           }
         });

         /* Reset all the fields we need to reuse */
         this.setState({
           username:'',
           pwd:'',
           keyToSign:'',
         });
    }
  }

  render(){
    return(
      <div>
        {/* The Title at the top */}
        <p className="title is-1 is-spaced has-text-centered customTitle">Unichat</p>

        {/* Οverlay used to show messages */}
        <Overlay  overlayDis={this.state.overlayDis} closeClick={this.changeOverlay} message={this.state.msg}/>

        {/* The menu buttons that used to swap to login/signup*/}
        <EntranceMenuButtons
          loginBackgroundColor={this.state.loginBackgroundColor} loginBorderColor={this.state.loginBorderColor}
          loginFontColor={this.state.loginFontColor} signUpBackgroundColor={this.state.signUpBackgroundColor}
          signUpBorderColor={this.state.signUpBorderColor} signUpFontColor={this.state.signUpFontColor}
          loginClick={this.changeToLogin} signUpClick={this.changeToSign} menuDis={this.state.menuDis}
        />

        {/* Login Form */}
        <Login
          loginDis={this.state.loginDis}  changeUsername={this.changeUsername}
          changePassword={this.changePassword} username={this.state.username}
          pwd={this.state.pwd} doAction={this.doAction}
        />

        {/* Sign Up Form */}
        <SignUp
          signUpDis={this.state.signUpDis} changeUsername={this.changeUsername}
          username={this.state.username} changePassword={this.changePassword}
          pwd={this.state.pwd} changeKey={this.changeKey} keyToSign={this.state.keyToSign}
          doAction={this.doAction}
        />

      </div>
    );
  }
}

export default Entrance;
