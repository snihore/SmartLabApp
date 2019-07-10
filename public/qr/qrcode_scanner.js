let scanner = new Instascan.Scanner(
    {
        video: document.getElementById('preview')
    }
);
scanner.addListener('scan', function(content) {
    // alert('He scanned the contents: ' + content);
    // window.open(content, "_blank");

    //Get Data From Qr Code ...
    var data = JSON.parse(content).barcodeObj;
    console.log("Scanned Data: "+JSON.stringify(data));
    progressBar(true);

    //Store Data To Borrowed Real-Time Database ...
    var ref = firebase.database().ref('BorrowedItems');
    addItemToDB(ref, data);
    //Remove Data From Items Database ...

    
});
Instascan.Camera.getCameras().then(cameras => 
{
    if(cameras.length > 0){
        scanner.start(cameras[0]);
    } else {
        console.error("There is no camera on the device!");
    }
});

function progressBar(value){
    if(value){
      document.getElementById('loader').style.display = 'block';
      document.getElementById('preview').style.display = 'none';
    }else{
      document.getElementById('loader').style.display = 'none';
      document.getElementById('preview').style.display = 'block';
    }
  }

  function addItemToDB(ref, obj){
    if(firebase.auth().currentUser){
        if(ref){
            var key = firebase.database().ref().child('BorrowedItems').push().key;
            ref.child(key).set(obj, function(err){
                if(err){
                    progressBar(false);
                    window.alert('Items not be saved !');
                    
                    
                }else{
                    
                    // progressBar(false);
                    //Update isBorrowed Flag in a database ....
                    var ref = firebase.database().ref('SmartLabItems');
                    ref.orderByChild('itemNumber').equalTo(obj.itemNum).once('child_added', function(snapshot){
                        snapshot.ref.update({isBorrowed:true});
                        progressBar(false);
                        window.location.href="./admin_console.html";
                    });
                    
                }
            });
            
        }
    }else{
        window.alert("Don't find current admin !");
        window.location.href="./admin_console.html";
    }
  }