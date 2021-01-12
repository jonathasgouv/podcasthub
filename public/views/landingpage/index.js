const stateObj = { view: "home" };
history.replaceState(stateObj, "home", "/");

function statusChangeCallback(response) {
  console.log('statusChangeCallback');
  console.log(response);
  // The response object is returned with a status field that lets the
  // app know the current login status of the person.
  // Full docs on the response object can be found in the documentation
  // for FB.getLoginStatus().
  if (response.status === 'connected') {
    location.replace('/')
    // Logged into your app and Facebook.
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', {fields: 'name,picture,email'}, function (response) {
      console.log(response)
      console.log('Successful login for: ' + response.name);
    });
  }
};




FB.getLoginStatus(function(response) {
  statusChangeCallback(response);
});

