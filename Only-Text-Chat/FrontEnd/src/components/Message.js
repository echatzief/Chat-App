import React,{Component} from 'react';
import './css/Message.css';
import axios from 'axios';

class Message extends Component{
  constructor(props){
    super(props);

    this.state=({
      curMessage:'',
      allMessages:[], /* To save the messages */
    });
  }

  componentDidMount(){

    var url=window.location.href;
    var splitTo=url.split("?");
    var user=splitTo[1].trim();

    /* Receive all messages from other users */
    this.props.socket.on('receiveMessages',message=>{

      /*Get the current user */
      var url=window.location.href;
      var splitTo=url.split("?");
      var whoAmI=splitTo[1].trim();

      /* Notify the user when a message arrives */
      if(message!==whoAmI+" : "+this.state.curMessage){
        var notific=new Audio("/notification");
        notific.play();
      }
      else{
        this.setState({
           curMessage:'',
        });
      }

      var tempArray=new Array();
      tempArray=this.state.allMessages.slice();
      tempArray.push(message);
      this.setState({
        allMessages:tempArray,
      });

    });

    /* Receive private messages from other users */
    this.props.socket.on(user,message=>{

      /*Get the current user */
      var url=window.location.href;
      var splitTo=url.split("?");
      var whoAmI=splitTo[1].trim();

      /* Notify the user when a message arrives */
      if(message!==whoAmI+" : "+this.state.curMessage){

        var notific=new Audio("/notification");
        notific.play();

      }
      else{
        this.setState({
           curMessage:'',
        });
      }

      //Overwrite the array with messages
      var tempArray=new Array();
      tempArray=this.state.allMessages.slice();
      tempArray.push("Private--> "+message);
      this.setState({
        allMessages:tempArray,
      });
    });

  }

  /* Change the current message you sent */
  changeMess = (e) =>{
    this.setState({
      curMessage:e.target.value,
    });
  }

  /* Send the message to all the users or a picked user */
  sendMessage =()=>{

    /*Get the current user */
    var url=window.location.href;
    var splitTo=url.split("?");
    var whoAmI=splitTo[1].trim();

    var toWho=this.props.currentUser;
    var msg=this.state.curMessage;


    /* Send to server the new message to send to the specific target */
    axios.post('/newMessage', {whoAmI,toWho,msg})
     .then(res => {
       console.log("Message have sent.");
     });

     if(toWho!=='All Users'){
       var tempArray=new Array();
       tempArray=this.state.allMessages.slice();
       tempArray.push("Private--> "+msg);
       this.setState({
          allMessages:tempArray,
       });
     }

  }

  render(){
    return(
      <div className="container">
        {/* Message UL List */}
        <div className="container messageSection">
          <ul>
          {this.state.allMessages.map((i) =>
            <li className="specLi">{i}</li>
          )}
          </ul>
        </div>

          {/* Message Input*/}
        <div className="container messDiv  has-text-centered">
          <textarea className="textarea is-medium messageText" placeholder="Write a message" onChange={this.changeMess} value={this.state.curMessage}></textarea>
          <a className="button is-danger is-rounded" onClick={this.sendMessage}>Send</a>
        </div>
      </div>
    );
  }
}
export default Message
