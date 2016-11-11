app.controller('UserController', function($scope,$firebaseAuth, $firebaseObject, $firebaseArray, $timeout) {
    
    //hidden html elements 
    $scope.confirm = false;
    $scope.errorBox = false;
    $scope.success = false;
    $scope.loader = false;
    
    //auth object
    $scope.authObj = $firebaseAuth();
    
    //all users
    var userRef = firebase.database().ref().child('users');
    var notDisuser =userRef.orderByChild('disable_state').equalTo(false);
    $scope.users = $firebaseArray(notDisuser);
    
    
    //sorting filter
    $scope.sort = function(keyname){
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }
 
    //adding a new user 
    $scope.addUser = function(){
        
        $scope.loader = true;
        $scope.errorBox = false;
        if ($scope.userForm.$valid) {
            var name = $scope.name;
            var last_name = $scope.last_name;
            var email = $scope.email; 
            var telNo = $scope.telNo;  
            if(telNo.substring(0,3) == "+27" && telNo.length == 12){
                var telNo = $scope.telNo;
                
                var admin = $scope.data.singleSelected;
                //check if user exist already in realtime DB
                userRef.once('value',function(snap){
                    var exist = false;
                    snap.forEach(function(childSnap){
                        if(email === childSnap.val().email){
                            exist = true;
                        }    
                    })
                    if(!exist){
                        secondaryApp.auth().createUserWithEmailAndPassword(email, name).then(function(firebaseUser){
                            var uid = firebaseUser.uid;
                            secondaryApp.auth().signOut();
                            if(admin == "admin"){
                                userRef.child(String(uid)).set({
                                    admin: true,
                                    disable_state: false,
                                    deviceToken:"",
                                    email: email,
                                    infoSet: false,
                                    last_name: last_name,
                                    name: name,
                                    ppURL:"",
                                    pushType: "FCM",
                                    tel: telNo,
                                    title: ""
                                });
                                $scope.successBox = true;
                                $scope.success = "User Created";
                                $scope.loader = false;
                                var notDisuser =userRef.orderByChild('disable_state').equalTo(false);
                                $scope.users = $firebaseArray(notDisuser);
                            }
                            else{
                                userRef.child(uid).set({
                                    deviceToken:"",
                                    email: email,
                                    infoSet: false,
                                    disable_state: false,
                                    last_name: last_name,
                                    name: name,
                                    ppURL:"",
                                    pushType: "FCM",
                                    tel: telNo,
                                    title: ""
                                });
                                $scope.successBox = true;
                                $scope.success = "User Created";
                                $scope.loader = false;
                                
                                var notDisuser =userRef.orderByChild('disable_state').equalTo(false);
                                $scope.users = $firebaseArray(notDisuser);
                            }
                        }).catch(function(error) {
                            $scope.errorBox = true;
                            $scope.error = "The following user exist already!";
                            $scope.loader = false;
                        });            
                    }
                    else{
                        $scope.errorBox = true;
                        $scope.error = "The following user exist already!";
                        $scope.loader = false;
                    }
                });
                
            }else{
                $scope.errorBox = true;
                $scope.error = "Please enter number in international format: example - +27769589105";
                $scope.loader = false;
            
            }
            
        }
        else{
            $scope.errorBox = true;
            $scope.error = "Please Complete form";
            $scope.loader = false;
        }
       
       
    }
    $scope.show =false;
    
    $scope.removeUser = function(x){
                $scope.confirm =false;
                userRef.child(String(x)).update({
                    "disable_state" : true
                });
               var disabled_users = userRef.orderByChild('disable_state').equalTo(false);
                $scope.users = $firebaseArray(disabled_users);  
        
        }
        
        
    
    
    
});