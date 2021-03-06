import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Button } from "antd";
import firebase from "firebase/app";
import "firebase/auth";

class App extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: "206943097080175",
        cookie: true, // enable cookies to allow the server to access
        // the session
        xfbml: true, // parse social plugins on this page
        version: "v6.0" // use version 2.1
      });

      // Now that we've initialized the JavaScript SDK, we call
      // FB.getLoginStatus().  This function gets the state of the
      // person visiting this page and can return one of three states to
      // the callback you provide.  They can be:
      //
      // 1. Logged into your app ('connected')
      // 2. Logged into Facebook, but not your app ('not_authorized')
      // 3. Not logged into Facebook and can't tell if they are logged into
      //    your app or not.
      //
      // These three cases are handled in the callback function.
      window.FB.getLoginStatus(
        function(response) {
          this.statusChangeCallback(response);
        }.bind(this)
      );
    }.bind(this);

    // Load the SDK asynchronously
    (function(d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  testAPI() {
    console.log("Welcome!  Fetching your information.... ");
    window.FB.api("/me", function(response) {
      console.log("Successful login for: " + response.name);
    });
  }

  // This is called with the results from from FB.getLoginStatus().
  statusChangeCallback(response) {
    console.log("statusChangeCallback");
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === "connected") {
      // Logged into your app and Facebook.
      const credential = firebase.auth.FacebookAuthProvider.credential(
        response.authResponse.accessToken
      );
      firebase
        .auth()
        .signInWithCredential(credential)
        .then(response => console.info("firebase response", response))
        .catch(error => {
          if (error.code === "auth/account-exists-with-different-credential")
            this.setState({ isHaveAccount: true });
        });
      this.testAPI();
    } else if (response.status === "not_authorized") {
      // The person is logged into Facebook, but not your app.
      console.log("not authorized");
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      console.info("error", response);
    }
  }

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  checkLoginState() {
    window.FB.getLoginStatus(
      function(response) {
        this.statusChangeCallback(response);
      }.bind(this)
    );
  }

  handleClick() {
    window.FB.login(this.checkLoginState());
  }

  loginFB = () => {
    window.FB.login(
      function(response) {
        if (response.status === "connected") {
          console.log(response);
        } else {
          console.log(response);
          // The person is not logged into your webpage or we are unable to tell.
        }
        // handle the response
      },
      { scope: "public_profile,email" }
    );
    window.FB.getLoginStatus(
      function(response) {
        this.statusChangeCallback(response);
      }.bind(this)
    );
    // window.FB.login(this.checkLoginState());
  };

  logoutFB = () => {
    window.FB.logout(function(response) {
      console.log(response);
    });
  };

  share = () => {
    window.FB.ui(
      {
        method: "share",
        href: "https://www.google.com"
      },
      function(response) {
        console.log(response);
      }
    );
  };

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>
          <Button type="primary" onClick={() => this.loginFB()}>
            Login
          </Button>
          <Button type="primary" onClick={() => this.loginFB()}>
            Logout
          </Button>
          <Button type="primary" onClick={() => this.share()}>
            Share
          </Button>
          {/* <FacebookShareButton
            quote="Share"
            hashtag="#"
            onClick={() => console.log("click")}
          /> */}
          {/* <fb:login-button
            scope="public_profile,email"
            onlogin="checkLoginState();"
          ></fb:login-button> */}
        </div>
        {/* <div id="status"></div> */}
      </div>
    );
  }
}

export default App;
