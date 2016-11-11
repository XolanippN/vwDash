app.controller('AnalyticsController', function($scope,$firebaseAuth, $firebaseObject, $firebaseArray, $timeout) {

    var whiteList = ["x"];
   
    roomRef = firebase.database().ref().child('rooms');
    db = firebase.database(); 
     var roomOneOnOneMessages = [];
     var roomGroupMessages = [];
     var oneOnOneRooms = [];
     var groupRooms = [];
     var totalORoomsWithMessages = 0;
     var totalGRoomsWithMessages = 0;
     var totalGMessages = 0;
     var totalOMessages = 0;
     var maxGMessages = 0;
     var maxOMessages = 0;
     var totalMessages = 0;
     
    setTimeout(function () {
           x(function(a,b,c,d,e,f,g,h){
              $scope.$apply(function(){
                  var oooo ={}
                $scope.createdOneOnOne=a;
                  $scope.usedOneOnOne = b;
                  $scope.totalOMessages=c;
                  $scope.longestOMessages=d;
                  $scope.createdGroups = e;
                  $scope.usedGroups = f;
                  $scope.totalMesGroup =g;
                  $scope.longestGroupMes = h;
                  
                 
                  
                }); 
           });
    }, 0);
    function x(callback){
        db.ref('/rooms').once("value", function (snapshot, prevChildKey) {
            console.info("***Fetching 'Rooms'***");
            var rooms = snapshot.val();
            for(room in rooms){
                if(oneOnOneOrGroup(rooms[room]) == "one on one"){
                        if((WhitelistTester(whiteList,rooms[room],room)) == false){
                            oneOnOneRooms.push(room);
                        }

                }
                if(oneOnOneOrGroup(rooms[room]) == "group"){
                        if((WhitelistTester(whiteList,rooms[room],room)) == false){
                            groupRooms.push(room);
                        }
                }
                    if(oneOnOneOrGroup(rooms[room]) == "none")
                    {
                        console.log("****Error: room "+room+" has no type of room discription****");
                    }
            }
        
                db.ref('/room_messages').once("value", function (snapshot, prevChildKey) {
                    console.info("***Fetching 'room_messages'***");
                var room_messages = snapshot.val();
                    console.info("***analyzing 'ONE ON ONE' rooms***");
                    for(room in room_messages){
                            for(roomone in oneOnOneRooms){
                                if(room == oneOnOneRooms[roomone]){
                                    
                                    oneOnOneRoomsAnalysis(room,room_messages[room]);
                                }
                            }

                    }
                 //   console.log("*********Total number of created one on one rooms is: "+  oneOnOneRooms.length +" ***");
                   // console.log("*********Total number of used one on one rooms is: "+  totalORoomsWithMessages +" ***");
                   // console.log("*********Total number of one on one messages is: "+totalOMessages+" ***");
                   // console.info("***analyzing 'GROUP' rooms***");
                    groupRooms.length - 1;
                    for(room in room_messages){
                            for(roomone in groupRooms){
                                if(room == groupRooms[roomone]){
                                    var groupRef = roomRef.child(String(room));
                                    var group = $firebaseObject(groupRef);
                                    groupRoomsAnalysis(group.name,room_messages[room]);
                                }
                            }

                    }
                   // console.log("*********Total number of created group rooms is: "+groupRooms.length +" ***");
                  //  console.log("*********Total number of used one on one rooms is: "+  totalGRoomsWithMessages +" ***");
                    //console.log("*********Total number of group messages is: "+totalGMessages+" ***");
                    //totalMessages = totalGMessages+totalOMessages;
                    //console.log("*********Total number of  messages is: "+totalMessages+" ***");
                    //console.log("*********Longest one on one room conversation has: "+maxOMessages+" messages ***");
                    //console.log("*********Longest group room conversation has: "+maxGMessages+" messages ***");
                //    console.log("*********one on one room messages object")
                 //   console.log(roomOneOnOneMessages);
                //     console.log("*********group room messages object")
                    console.log(roomGroupMessages);
                    callback(oneOnOneRooms.length,totalORoomsWithMessages,totalOMessages,maxOMessages ,groupRooms.length,totalGRoomsWithMessages,totalGMessages,maxGMessages)
                });

        });

    }




function getName(x){
    var groupRef = roomRef.child(String(x));
    var group = $firebaseObject(groupRef);
    console.log(group)
    return group.name;
    
}

function oneOnOneRoomsAnalysis(room,messages){
    var i = 0;
    for(messageid in messages){
      i++;
    }
   // console.log("*********In room "+room+" there are: "+i+" messages ***"); 
    roomOneOnOneMessages.push({name : room,total : i});
    totalOMessages = totalOMessages + i;
    if(maxOMessages < i){
      maxOMessages = i; 
     } 
     totalORoomsWithMessages++;
}
function groupRoomsAnalysis(room,messages){
     var i = 0;
    for(messageid in messages){
      i++;
    }
    // console.log("*********In room "+room+" there are: "+i+" messages ***");
    roomGroupMessages.push({name : room,total : i});
    totalGMessages = totalGMessages + i;
    if(maxGMessages < i){
      maxGMessages = i; 
     } 
     totalGRoomsWithMessages++;
}


function oneOnOneOrGroup(room){
    var type = "";
            if( room.type == "one on one"){
                type = "one on one";
            return type;
            }
            else if( room.type == "group")
            {
                type = "group";
            return type;
            }
            else{
                type = "none";
                }
       return type;
}   


function WhitelistTester(whitelist,InRoom,room){
 var hasWatchlistMembersOnly = false;
 var temp = 0;
 var i = 0;
  for(whitelister in whitelist){
           i = 0;
        for(member in InRoom.members){
            if(InRoom.members[member] == whitelist[whitelister]){
                temp++; 
            }
           i++;    
        }
         
     }
    if(i == 0){
    console.log("******Error :room"+ room +" has no members table********");
    }
    if(temp == i){
        hasWatchlistMembersOnly = true;
     }
     else{ 
         hasWatchlistMembersOnly = false
        } 

    return hasWatchlistMembersOnly;
}

});


