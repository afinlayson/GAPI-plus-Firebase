import { gapi, loadAuth2, loadClientAuth2 } from 'gapi-script'

export class GoogleAPI {

    constructor(clientId, scope,  firebase, didSignIn = () => {}, loaded = ()=>{}) {
        this.firebase = firebase;        
        this.setup(clientId, scope);    
        this.clientId = clientId
        this.scope = scope;    
        this.didSignIn = didSignIn;
        this.librariesLoaded = loaded
    }

    setUser(currentUser, name = null, img = null) {

        this.isSignedIn = (name !== null)
        this.currentUser = currentUser;
        this.name = name;
        this.profileImg = img;
        console.log(this);
        if (this.isSignedIn) {
            this.firebase.signinFromGAPI(currentUser);
          }
        this.didSignIn(this);
    }

    setup(clientId, scope) {
 
        loadAuth2(gapi, clientId, scope).then( auth2 => {
            this.auth2 = auth2;
            console.log("did this work");
            if (this.element) {
                this.signIn(this.element);
            }
            this.updateUser(auth2.currentUser.get())
            return gapi;
        }, err => {
            console.log("fail", err);
        })
        .then (x => {
            loadClientAuth2(gapi, this.clientId, this.scope)
            .then (client => {     
                
                if (client === undefined) {
                    client = gapi.client
                }
                this.client = client;           
                return gapi.client.load('calendar', 'v3')            
            }).then((calendar) => {                 
                console.log('gapi: calendar v3 loaded', calendar);
                this.librariesLoaded(this)
            });       
        })
    
    }

    updateUser = (currentUser) => {        
        if (currentUser.isSignedIn()) {
            this.setUser(currentUser, currentUser.getBasicProfile().getName(),
            currentUser.getBasicProfile().getImageUrl());        
        } else {
            this.setUser(currentUser)
        }
        this.client = loadClientAuth2(gapi, this.clientId, this.scope)
                    
    }

    signIn = (element) => {
        if (this.auth2) {
            this.element = undefined
            this.auth2.attachClickHandler(element, {},
                (googleUser) => {
                    
                  this.updateUser(googleUser);
                }, (error) => {
                console.log(JSON.stringify(error))
              });
        } else {
            this.element = element;
        }
        
    }

    signOut = () => {
        const auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(() => {
            this.firebase.signOut();
            this.setUser();
            console.log('User signed out.');
        });
    }

    listCalendars(calendarInfo = {
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
      }, completion = (response) => {}) {
        if (this.isSignedIn) {            
            if (gapi.client && gapi.client.calendar && gapi.client.calendar.events) {
                gapi.client.calendar.events.list(calendarInfo)
                .then((response) => {
                    console.log('Google Calendar request successful!', response)
                    completion(response)
                }, error => {
                    completion(undefined, error);
                    console.log("ERORR", error);            
                })
            } else {
                completion({errorr: "Unable to load gapi.client.calendar.envents",
                    client: gapi.client
                })
            }
            
          } else {
              completion({error: "Not logged in"});
          }
        
    }
}