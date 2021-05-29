import React from 'react';
import { GoogleAPI} from './GoogleAPI.js';
import './App.css';
import {Firebase} from './Firebase.js';

class App extends React.Component{
  
  constructor(props) {
    super(props)
    this.state = {isLoggedIn: false};
    let AUTH_SCOPES = [
      'email',
      'profile',
      'https://www.googleapis.com/auth/calendar.events.readonly'
    ]

    this.firebase = new Firebase();
    this.google = new GoogleAPI(process.env.REACT_APP_CLIENT_ID, AUTH_SCOPES.join(' '), this.firebase, (googleApi)=> {          
      this.setState({
        isSignedIn: googleApi.isSignedIn
      });      
    }, (google)=>{   
      if (google.client && google.client.calendar && google.client.calendar.events) {
        this.checkCalendar(google)
      } else {
        setTimeout(()=>{this.checkCalendar(google)}, 300);
      }
    });    
  }

  componentDidMount() {
  }

  componentDidUpdate() {
    let signin = document.getElementById("signin");
    if (signin) {    
      this.google.signIn(signin)
    }
  }

  checkCalendar(google) {
    google.listCalendars({
      'calendarId': 'primary',
      'timeMin': (new Date()).toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 10,
      'orderBy': 'startTime'
    }, (results) => {
      console.log(results);
    })
  }

  render() {
    console.log("this:", this.state.isSignedIn) 
    return (
      <div className="App">

        {this.state.isSignedIn ? 
            <div key="l1" onClick={() => {
              this.google.signOut();
            }}>loggedIn as {this.google.name}</div> : 
            <div key="l2" id="signin">Sign In</div>
        }        
      </div>
    );
  }
}


export default App;
