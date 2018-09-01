import React,{Component} from 'react';
import './css/Sidebar.css';

class Sidebar extends Component{
  constructor(props){
    super(props);
  }
  render(){
    return(
      <div style={{display:this.props.sidebarDis}} className="sidebar">
        {/*Top part of the sidebar */}
        <div className="title is-4 is-spaced userTitle">
          {/* Arrow that opens the sidebar */}
          <a onClick={this.props.openMenu} ><i className="left"></i></a>
          <p className="title is-4 has-text-centered userTitle">ActiveNow</p>
        </div>

        {/* The List of the active users*/}
        <div className="container">
          <ul>
            <li className="title is-4 liDes"  onClick={this.props.resetCurrentUser}><strong>All Chat</strong><br/></li>
            {this.props.activeUsers.map((td) => (
             <li className="title is-4 liDes" onClick={() => this.props.changeCurrentUser(td)} >
                   <strong value={td}>{td}</strong>
                   <br/>
             </li>
              ))
            }
          </ul>
        </div>

        {/* Logout Button*/}
        <div className="container">
            <a className="button is-info is-rounded logoutButton" onClick={this.props.removeUser}>Logout</a>
        </div>

      </div>
    );
  }
}

export default Sidebar;
