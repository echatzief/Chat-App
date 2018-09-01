import React,{Component} from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import $ from 'jquery';
import './css/MainFrame.css';
import './css/Sidebar.css';
import Sidebar from './Sidebar';
import Message from './Message';

class MainFrame extends Component{
  constructor(props){
    super(props);
    this.state=({
      currPickedUser:'All Users',      /* The User we pick to chat with */
      sidebarDis:'none',               /* Hide or show the sidebar */
      activeUsers:[],                  /* Array with the active users */
      username:'',                     /* Username of Current User */
    });

    /* We open the socket for the communication*/
    this.socket = io();
  }

  /* Hide or show the sidebar by changing the state */
  openMenu =()=>{
    if(this.state.sidebarDis==='none'){
      this.setState({
        sidebarDis:'block',
      });
    }
    else{
      this.setState({
        sidebarDis:'none',
      });
    }
  }

  /* Change the username of the current user */
  changeUsername(newName){
    this.setState({
      username:newName,
    });
  }

  /* Remove User from Active */
  removeUser =() =>{
    var username=this.state.username;
    axios.post('/removeActive', {username})
     .then(res => {
       console.log(res);
     });

     /* After removing user then redirect to login/SignUp */
     this.props.history.push('/');
  }

  componentDidMount(){

    /* Get the username of the current user from the URL */
    var url=window.location.href;
    var splitTo=url.split("?");
    var username=splitTo[1].trim();
    this.changeUsername(username);


    /* Send to server the new active member */
    axios.post('/newActive', {username})
     .then(res => {
       console.log("User Added to Active.");
     });

     /* Receive all the active user */
     this.socket.on('receiveNewUsers',message=>{
       var userArr=new Array();
       for(var i=0;i<message.length;i++){
         /* Push to temp array */
         if(message[i].username!==this.state.username){
           userArr.push(message[i].username);
         }
         console.log("User: "+message[i].username);
         console.log("Main: "+this.socket.id);
       }

       /* Refresh the array */
       this.setState({
         activeUsers:userArr,
       })
       console.log(this.state.activeUsers);
       this.forceUpdate();
     });

  }

  /* Reset the current user to All */
  resetCurrentUser = ()=>{
    this.setState({
      currPickedUser:'All Users',
    });
  }

  /* We change the current user we pick */
  changeCurrentUser = (item)=>{

    this.setState({
      currPickedUser:item,
    });
  }

  render(){
    return(
      <div>
        {/* The title with the current selected user*/}
        <div className="title is-4 is-spaced userTitle">
          {/* Arrow that opens the sidebar */}
          <a onClick={this.openMenu} ><i className="right"></i></a>
          <p className="title is-4 has-text-centered userTitle">{this.state.currPickedUser}</p>
        </div>

        {/* Sidebar that hides */}
        <Sidebar
          sidebarDis={this.state.sidebarDis} openMenu={this.openMenu}
          resetCurrentUser={this.resetCurrentUser} activeUsers={this.state.activeUsers}
          changeCurrentUser={this.changeCurrentUser} removeUser={this.removeUser}
        />

        {/* The section where we send the message */}
        <Message socket={this.socket} currentUser={this.state.currPickedUser} />
      </div>
    );
  }
}

export default MainFrame;
