app.controller('GroupController', function($scope, $firebaseObject, $firebaseArray, $timeout) {
  
    $scope.memb = "";
    //All Groups
    //all group Objects
    var groupRef = firebase.database().ref().child("rooms");
   //query
    var allGroups = groupRef.orderByChild('type').equalTo('group');
    //all users
    var userRef = firebase.database().ref().child('users');
    //user rooms
    var user_room_ref = firebase.database().ref().child('user_rooms');
    //recent rooms 
    var recent_room_ref = firebase.database().ref().child('recent_rooms');
    


    //function for creating groups
    function createGroup(userId, adminName, newMemb, groupName) {
        groupRef.child(userId).set({
            active_time : null,
            created_by : adminName,
            last_message : "",
            last_message_id:"",
            mebers_last_read: null,
            members: newMemb,
            name: groupName,
            sent_by: "",
            type: "group"
        });
    }

    
    function create_user_rooms(x){
        var refGroup = groupRef.child(String(x));
        refGroup.once('value', function(snap){
            $timeout(function(){
                var members = snap.child('members').val();
                var groupName = snap.child('name').val();
                for(var i =0 ; i < members.length; i++){
                    var ref = user_room_ref.child(String(members[i]));
                    user_room_ref.child(String(members[i])).update({  
                    });
                    ref.push({
                        hasWritePermission: true,
                        last_read: "",
                        room_id: x,
                        name: groupName,
                        type: 'group'
                    });
                } 
            });
        });    
    }
    function remove_user_rooms(x){
        var refGroup = groupRef.child(String(x));
        refGroup.once('value', function(snap){
            $timeout(function(){
                var members = snap.child('members').val();
                var groupName = snap.child('name').val();
                for(var i =0 ; i < members.length; i++){
                    var ref = user_room_ref.child(String(members[i]));
                    console.log(members[i]);
                    ref.once('value',function(snap){
                        var pushidLocation = "";
                        snap.forEach(function(childSnap){
                            if(String(x) === childSnap.val().room_id){
                                var rootKey = snap.key;
                                var childkey = childSnap.key;
                                var user_room_ref = firebase.database().ref('user_rooms/'+rootKey+"/"+childkey);
                                user_room_ref.remove();
                            }    
                        })
                    });
                } 
            });
        });  
    }
    function remove_recent_rooms(x){
        var refGroup = groupRef.child(String(x));
        refGroup.once('value', function(snap){
            $timeout(function(){
                var members = snap.child('members').val();
                var groupName = snap.child('name').val();
                for(var i =0 ; i < members.length; i++){
                    var ref = recent_room_ref.child(String(members[i]));
                    console.log(members[i]);
                    ref.once('value',function(snap){
                        var pushidLocation = "";
                        snap.forEach(function(childSnap){
                            if(String(x) === childSnap.val().room_id){
                                var rootKey = snap.key;
                                var childkey = childSnap.key;
                                var user_room_ref = firebase.database().ref('recent_rooms/'+rootKey+"/"+childkey);
                                user_room_ref.remove();
                            }    
                        })
                    });
                } 
            });
        });  
    }
    
    function create_recent_rooms(x){
        var refGroup = groupRef.child(String(x));
        refGroup.once('value', function(snap){
            $timeout(function(){
                var members = snap.child('members').val();
                var groupName = snap.child('name').val();
                for(var i =0 ; i < members.length; i++){
                    var ref = recent_room_ref.child(String(members[i]));
                    recent_room_ref.child(String(members[i])).update({  
                    });
                    ref.push({ 
                        room_id: String(x),
                        room_type: 'group'
                    });
                } 
            });
        });    
    }
    
   
    $scope.show = true;
    //firebase array of users
    $scope.users = $firebaseArray(userRef);
    update();
    $scope.groups = [];
    
    function update(){
    allGroups.on('child_added', function(snap){
    $timeout(function(){  
        
        //find import information of groups
        var name = snap.child('name').val();
        var created_by = snap.child('created_by').val();
        var members = snap.child('members').val();
        var groupID = snap.key;
        //var disable_state = snap.child('disable_state').val();
       
        $scope.groups.push({
            gid :groupID,
            name: name,
            created_by: created_by,
            members: members,
            
        });
        //get name of admin
        $scope.createdBy = function(id){
            var userRet = userRef.child(id);
            var user = $firebaseObject(userRet);
            return user;
        }
        //get members name 
        $scope.name = function(id){
            var userRet = userRef.child(id);
            var user = $firebaseObject(userRet);
            return user;
        }
        
        $scope.show = false; 
    });
    });
    }
    
    //function removing user from user_rooms
    function removeUser_user_rooms(x,gid){
        var refUser = user_room_ref.child(String(x));
        refUser.once('value',function(snap){
            snap.forEach(function(snapChild){
               if(String(gid) === snapChild.val().room_id){
                    var rootKey = snap.key;
                    var childkey = snapChild.key;
                    var user_room_ref = firebase.database().ref('user_rooms/'+rootKey+"/"+childkey);
                    user_room_ref.remove();
                }
            });
        });
    }
    function removeUser_recent_rooms(x,gid){
        var refUser = recent_room_ref.child(String(x));
        refUser.once('value',function(snap){
            snap.forEach(function(snapChild){
                if(String(gid) === snapChild.val().room_id){
                    var rootKey = snap.key;
                    var childkey = snapChild.key;
                    var recent_room_ref = firebase.database().ref('recent_rooms/'+rootKey+"/"+childkey);
                    recent_room_ref.remove();
                }
            });
        });
    }
        $scope.remove = function(id, gkey){
            var groupRef = firebase.database().ref().child('rooms');
            var refSpecGroup = groupRef.child(String(gkey)); 
            var membersRef = refSpecGroup.child('members');
            membersRef.on('value', function(snap){
              var membId = snap.child(String(id)).val(); 
                removeUser_user_rooms(membId,gkey);
                removeUser_recent_rooms(membId,gkey)
            });
            var members = {};
            membersRef.on('value', function(snap){
                members =  snap.val()
            });
            members.splice(id,1);
            refSpecGroup.update({
                members: members 
            });
            $scope.groups = [];
            update();
        }
        
        
        function addUser_user_rooms(uid,gid){
            var refGroup = groupRef.child(String(gid));
            var ref = user_room_ref.child(String(uid));
            refGroup.once('value', function(snap){
                $timeout(function(){
                    var groupName = snap.child('name').val();
                    user_room_ref.child(String(uid)).update({ });
                    ref.push({
                        hasWritePermission: true,
                        last_read: "",
                        room_id: gid,
                        name: groupName,
                        type: 'group'
                });
                });
            });
            
        }
    function addUser_recent_rooms(uid,gid){
        var refGroup = groupRef.child(String(gid));
        var ref = recent_room_ref.child(String(uid));
        refGroup.once('value', function(snap){
            $timeout(function(){
                var groupName = snap.child('name').val();
                recent_room_ref.child(String(uid)).update({ });
                ref.push({
                    room_id: gid,
                    type: 'group'
                });
            });
        });

    }
        //add user to group
        $scope.addToGroup = function(p,x){
            var newmember = p['$id'];
            var groupRef = firebase.database().ref().child('rooms');
            var refSpecGroup = groupRef.child(String(x)); 
            var membersRef = refSpecGroup.child('members');
            addUser_user_rooms(newmember,x);
            addUser_recent_rooms(newmember,x);  
            
            var members = {};
            membersRef.on('value', function(snap){
                members =  snap.val()
            });
            members[members.length] = newmember;
            refSpecGroup.update({
                members: members 
            });
            $scope.groups = [];
            update();
        }
        
    //creating a new group    
    $scope.getNewGroup = function(){
        var groupName = $scope.groupName;
        var adminName = $scope.member.name['$id']; 
        var members = $scope.members.name;
        var newMemb = {};
        var memblen = $scope.members.name.length;
        for (var i =0; i < memblen; i++){
           newMemb[i] = members[i]['$id'];
        }
        var groupId = groupRef.push().key;   
        createGroup(groupId,adminName, newMemb,groupName);
        create_user_rooms(groupId);
        create_recent_rooms(groupId);
    }
    

        
      
    //remove group
    $scope.removeGroup = function(id){
        remove_recent_rooms(id);
        remove_user_rooms(id);
        groupRef.child(id).remove();
        $scope.groups = [];
        update();
    }
    
    
});