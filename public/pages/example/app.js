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
 
 var app = angular.module('app',["firebase"]);

    



    app.controller("MyAuthCtrl", ["$scope", "$firebaseAuth","$timeout",function($scope, $firebaseAuth, $timeout) {
    $scope.authObj = $firebaseAuth();
    
    $scope.logIn = function(){
        $scope.errorBox = false; 
        $scope.loader= true;
        $scope.authObj.$signInWithEmailAndPassword($scope.email, $scope.password).then(function(firebaseUser){
                var userState = false;
                var fireUser = firebaseUser.uid;
                var userRef = firebase.database().ref().child('users');
                var childRef = userRef.child(String(fireUser));
                childRef.on('value', function(snap){
                     userState = snap.child('disable_state').val();
                    if(userState){
                        $scope.authObj.$deleteUser().then(function() {
                            $scope.errorBox = true;
                            $scope.loader = false;
                            $scope.error = "Access Denied"
                        }).catch(function(error) {
                            $scope.errorBox = true;
                            $scope.loader = false;
                            $scope.error = "Error  "+ error;
                        });   
                    }
                    else{
                        window.location = "../../index.html"       
                    }
                });
            }).catch(function(error) {
                $scope.errorBox = true;
                $scope.loader = false;
                $scope.error = "Authentication failed:"+ error
                });
  
            }
   
    }
]);
    