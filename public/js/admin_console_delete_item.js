var deleteBtn = document.getElementById('delete_item_btn');
var ref = firebase.database().ref('SmartLabItems');
var modal2 = document.getElementById("myModal2");


function progressBar2(value){
    if(value){
      document.getElementById('loader2').style.display = 'block';
      document.getElementById('modal-content2').style.opacity = '0.5';
    }else{
      document.getElementById('loader2').style.display = 'none';
      document.getElementById('modal-content2').style.opacity = '1';
    }
  }

deleteBtn.addEventListener('click', function(){

    //Check Admin is currently present or not ...
    if(firebase.auth().currentUser){
        console.log('Admin is here ...');
        var user = firebase.auth().currentUser;

        //Get input fields ...
        var itemNumber = document.getElementById('delete_item_number').value;
        
        if(itemNumber.length===0){
            window.alert('Please fill all the input fields ...');
        }else{
            progressBar2(true);
            //Delete Item:
            ref.orderByChild('itemNumber').equalTo(itemNumber).once('value').then(function(snapshot){
                console.log('Snapshot: '+snapshot.val());
                if(snapshot.val()){
                    snapshot.forEach(function(snap){
                        if(snap.val().isBorrowed === true){
                            window.alert('Item is borrowed, so delete after user will return this !');
                            progressBar2(false);
                        }else{
                            var key = snap.key;
                            //First delete files from storage ...
                            var storageRef = firebase.storage().ref('ItemsFile/'+key);
                            storageRef.delete().then(function(){
                                console.log('File deleted ...');

                                //delete from real-time db ...
                                ref.child(key).remove().then(function(){
                                    console.log('DELETE SUCCESSFULLY :)');
                                    progressBar2(false);
                                    window.alert('Delete Successfully :)');
                                    modal2.style.display = "none";
                                }).catch(function(){
                                    progressBar2(false);
                                    window.alert('Some Error occur, files are deleted but not the object, please contact with administrator !');
                                    
                                });
                                
                            }).catch(function(e){
                                progressBar2(false);
                                window.alert('Item Not deleted !');
                                
                            });
                        }
                        
                    });
                }else{
                    progressBar2(false);
                    window.alert('Item not found !');
                    
                }
            });

        }

    }else{
        console.log('Admin is not here ...');
        window.alert('Admin is not here ...');
    }

});