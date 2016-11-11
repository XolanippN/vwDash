(function() {
  
    
    var userRef = firebase.database().ref().child('users');
    var groupRef = firebase.database().ref().child('rooms');
    
    groupRef.orderByChild('type').equalTo('group').on('child_added', function(snap){
                var groupName = snap.child('name').val();
                var countMemb = 0;
                var groupId = snap.key;
                //console.log(groupid);
             
  
           
   var adminName = findUserName(snap.child('created_by').val(), function(x){
         adminName = x;
        var tableId = 'table_body_'+groupId;
       
       
     snap.child('members').forEach(function(data){
                    countMemb++;  
                });
    
       //output
    $('#rowGroups').append("<div class='box box-success collapsed-box'>"+
                           "<div class='box-header with-border'>"+
                           "<h3 id='groupName' class='box-title'>"+groupName+"</h3>"+
                           "<div class='box-tools pull-right'>"+
                                "<button class='btn btn-box-tool' data-widget='collapse'>"+
                                "<i class='fa fa-plus'></i></button>"+
                           "</div><!-- /.box-tools -->"+
                           "</div><!-- /.box-header -->"+
                           "<div class='box-body'>"+
                            "<h4>Group Admin: "+ adminName +"</h4>"+
                           "<h4>Total Members: "+ countMemb +"</h4>"+
                           //datatable list of users
                           
                           "<table class='table table-bordered'>"+
                            "<thead><tr>"+          
                                "<th>Name</th>"+
                                "<th style='width: 40px'>Delete</th>"+
                            "</tr></thead>"+
                                "<tbody id='"+tableId +"'>"+
                                "<tr>"+
                                "</tr>"+
                           "</tbody>"+
                          
                            "</table>"+
                            "</div><!-- /.box-body -->"+
                           "</div><!-- /.box -->");
       
       snap.child('members').forEach(function(data){
            var membName = findUserName(data.val(),function(x){
                        membName = x;
                        var membId = data.val();
                        var gid = String(groupId) +" "+membId; 
                       var appendTo = '#table_body_'+groupId;
                        
                        $(appendTo).append("<tr><td>"+membName+"</td><td><button type='button' id='"+ membId +"' class='btn btn-block btn-danger'>remove</button></td></tr>");
                    });
       });
                           
    
        
    }); 
       
    
    
    });
    

    
//name
  function findUserName(x, cb){
    
    var userRef = firebase.database().ref().child('users');
    var user = userRef.child(x);
     user.on('value', function(snap){
        var name = snap.child('name').val();
        var surname = snap.child('last_name').val();
        cb(name+" "+surname)
        //console.log(name);
        return name+" "+surname;
    });
    
 }
}());