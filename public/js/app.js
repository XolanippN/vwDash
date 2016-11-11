       // Initialize Firebase
   // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBlrdmKpn8623KMjwuhbp2jraffuY7yv6w",
    authDomain: "main-db-9a011.firebaseapp.com",
    databaseURL: "https://main-db-9a011.firebaseio.com",
    storageBucket: "main-db-9a011.appspot.com",
    messagingSenderId: "542462487775"
  };
  firebase.initializeApp(config);
    var secondaryApp = firebase.initializeApp(config, "Secondary");

var app = angular.module('groupApp',["firebase"]);
     app.controller("MyAuthCtrl", ["$scope", "$firebaseAuth", "$firebaseObject",function($scope, $firebaseAuth, $firebaseObject) {
         $scope.loader = true;
        $scope.authObj = $firebaseAuth();
        //refrencing user object
         var userRef = firebase.database().ref().child('users');
    
         
        $scope.authObj.$onAuthStateChanged(function(firebaseUser) {
        if (firebaseUser) {
            $scope.user = $firebaseObject(userRef.child(String(firebaseUser.uid)));
            
        } else {
            window.location = "pages/example/login.html"
        }
});
     }]);
    
    
