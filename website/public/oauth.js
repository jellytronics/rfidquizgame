module.exports = {
  facebook: {
    clientID: 479462062190668,
    clientSecret: "042ba495ae9d1aa42b806573a4571cf6" ,
    callbackURL: "http://localhost:3000/api/auth/facebook/callback"
  },
  google: {
    returnURL: "http://localhost:3000/api/auth/google/callback",
    realm: "http://localhost:3000/"
  }
}


/*

module.exports = {
  facebook: {
    clientID: 479462062190668,
    clientSecret: "042ba495ae9d1aa42b806573a4571cf6" ,
    callbackURL: "http://192.168.2.124:3000/api/auth/facebook/callback"
  },
  google: {
    returnURL: "http://192.168.2.124:3000/api/auth/google/return",
    realm: "http://192.168.2.124:3000/"
  }
}

*/


/*

Authenticating thingy

// VERY NICE!

http://mherman.org/blog/2013/11/10/social-authentication-with-passport-dot-js/#.U98FtoCSzEc

// FACEBOOK

ref: https://developers.facebook.com/docs/facebook-login/login-flow-for-web/v2.0

NFCuiz

App ID

App Secret




// Google

ref: https://developers.google.com/+/api/oauth#apikey

App


*/
