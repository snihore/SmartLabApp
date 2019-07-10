var ref = firebase.database().ref('SmartLabItems');

var addItemBtn = document.getElementById('add_item_btn');

function progressBar(value){
    if(value){
      document.getElementById('loader').style.display = 'block';
      document.getElementById('modal-content').style.opacity = '0.5';
    }else{
      document.getElementById('loader').style.display = 'none';
      document.getElementById('modal-content').style.opacity = '1';
    }
  }
 
var uploadedFile = null;
addItemBtn.addEventListener('click', function(){
    var itemName = document.getElementById('item_name').value;
    var itemNum = document.getElementById('item_number').value;
    var itemDesc = document.getElementById('item_description').value;

    if(itemName.length===0 ||
        itemNum.length===0 ||
        itemDesc.length===0){
            window.alert('Please fill all the input fields');
        }else{
            progressBar(true);
            addToDB(itemName, itemNum, itemDesc)
        }
    
    
});

document.getElementById('close_add_item_panel').onclick = function(){
    var itemName = document.getElementById('item_name').value;
    var itemNum = document.getElementById('item_number').value;
    var itemDesc = document.getElementById('item_description').value;
    document.getElementById('item_name').value = "";
    document.getElementById('item_number').value = "";
    document.getElementById('item_description').value = "";
    modal.style.display = "none";
}


function addToDB(name, num, desc){
    
    if(firebase.auth().currentUser){
        if(ref){

            ref.orderByChild("itemNumber").equalTo(num).once('value', function(snapshot){
                if(snapshot.val()){
                    // console.log('Exist');
                    window.alert("This item already exist, please check item's number !");
                    progressBar(false);
                }else{
                    var key = firebase.database().ref().child('SmartLabItems').push().key;
                    if(uploadedFile != null){
                        var storageRef = firebase.storage().ref('ItemsFile/'+key);

                        var task = storageRef.put(uploadedFile);
                        task.on('state_changed',
                            function progress(snapshot){
                                var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                console.log(percentage);
                            },
                            function error(err){
                                progressBar(false);
                                window.alert('Again upload a file !');
                            },
                            function complete(){
                                console.log('Complete');
                                var admin = firebase.auth().currentUser.email;
                                var obj = {itemName:name, itemNumber:num, itemDescription:desc, addBy:admin, isBorrowed:false};
                                ref.child(key).set(obj, function(err){
                                    if(err){
                                        progressBar(false);
                                        window.alert('Items not be saved !');
                                        
                                    }else{
                                        
                                        document.getElementById('item_name').value = "";
                                        document.getElementById('item_number').value = "";
                                        document.getElementById('item_description').value = "";
                                        modal.style.display = "none";
                                        progressBar(false);
                                        window.alert('Item Saved !');
                                        
                                    }
                                });
                            }
                        );
                    }else{
                        window.alert('Reselect a file !');
                        progressBar(false);
                    }
                    
                }
              });
            
        }
    }else{
        window.alert("Don't find current admin !");
    }
    
}

var fileUploadBtn = document.getElementById('add_item_files');
fileUploadBtn.addEventListener('change', function(e){
    // console.log('yeah!');
    uploadedFile = e.target.files[0];
});