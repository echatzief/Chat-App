import React,{Component} from 'react';
import './css/Message.css';
import axios from 'axios';

class Message extends Component{
  constructor(props){
    super(props);

    this.state=({
      curMessage:'',
      allMessages:[], /* To save the messages */
      allImages:[],   /* To save all the images */
      selectedFile:null, /* The file we pick */
      imageUrls:[],
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

    /* We open a socket to receive images */
    this.props.socket.on('receiveImages',message=>{
      console.log("Images: "+message);
      var tempArray=new Array();
      tempArray=this.state.allMessages.slice();
      tempArray.push(message);
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

  renderImageOrText(currentText){
      //For the image
      if(currentText.includes('/saveImages?')){
        return(<img src={currentText} width="200" height="200"/>);
      }
      else{
        return(<li className="specLi">{currentText}</li>)
      }
  }

  /* Change the selected Image */
  fileChangedHandler = (event) => {
    this.setState({selectedFile: event.target.files[0]})
  }
  /* Upload the image to the server */
  uploadFile =()=>{

    console.log(this.state.selectedFile);

    /* Pass the image to formdata */
    var formData=new FormData();
    formData.append('img',this.state.selectedFile);

    axios.post('/uploadImage',formData)
     .then(res => {
       console.log("Image has sent.");
     });
  }

  render(){
    return(
      <div className="container">
        {/* Message UL List */}
        <div className="container messageSection">
          <ul>
            {this.state.allMessages.map(text => this.renderImageOrText(text))}
          </ul>
        </div>


        {/* Message Input*/}
        <div className="container messDiv  has-text-centered">


          {/* Input for Images.Accept only images */}
          <div className="file">
            <label className="file-label">
              <input className="file-input" type="file" name="resume" accept="image/*" onChange={this.fileChangedHandler}/>
              <span className="file-cta">
                <span className="file-icon">
                  <i className="fas fa-upload"></i>
                </span>
              </span>
            </label>
            <a className="button is-danger is-rounded" onClick={this.uploadFile}>Upload</a>
          </div>

          <textarea className="textarea is-medium messageText" placeholder="Write a message" onChange={this.changeMess} value={this.state.curMessage}></textarea>

          <a className="button is-danger is-rounded" onClick={this.sendMessage}>Send</a>
        </div>
      </div>
    );
  }
}
export default Message
