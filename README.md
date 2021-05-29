# GAPI & Firebase login to get Calendar data
* copy the .env.template to .env
* Create a firebase project
* In Sign-in method Enable Google
* Create a Web project so you have all the values in .env.template (except REACT_APP_CLIENT_ID which you get cloud.google.com)
* goto cloud.google.com find your firebase project 
* Goto Credientials and create a  OAuth 2.0 Client IDs
* Add http://localhost:3000 Authorized redirect URIs
* Get the Client ID from the Crediential and add it to REACT_APP_CLIENT_ID in .env
* Goto Google APIs and enable Calendar https://console.cloud.google.com/apis/library/sheets.googleapis.com?id=739c20c5-5641-41e8-a938-e55ddc082ad1&project=webidesa-1569217854481

* run npm install
* run npm start

