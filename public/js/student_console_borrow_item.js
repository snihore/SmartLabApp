var borrowItemBtn = document.getElementById('borrowItemBtn');

borrowItemBtn.addEventListener('click', function(){
    var itemNum = document.getElementById('br_item_number').value;
    var returnDate = document.getElementById('return_date_input').value;

    if(itemNum.length===0 ||
        returnDate.length===0){
            window.alert('Please fill all the input fields !');
        }else{
            ///get item's information from database
            var ref = firebase.database().ref('SmartLabItems');
            ref.orderByChild("itemNumber").equalTo(itemNum).once('value', function(snapshot){
                if(!snapshot.val()){
                    window.alert('Item not found !');
                }else{
                    snapshot.forEach(function(snap){
                        itemInfo = snap.val();
                        if(itemInfo.isBorrowed === true){
                            window.alert('Item not found !');
                        }else{
                            var itemName = itemInfo.itemName;
                            var userEmail = firebase.auth().currentUser.email;
                            /**
                             * Item Number
                             * Item Name
                             * User Email
                             * Return Date
                             */
                            var barcodeObj = {
                                itemName,
                                itemNum,
                                returnDate,
                                userEmail
                            }
                            console.log(barcodeObj);
                            //Generate QR code
                            document.getElementById("qrcode").innerHTML = "";
                            new QRCode(document.getElementById("qrcode"), JSON.stringify({barcodeObj}));
                            modal.style.display = "none";
                        }
                       
                        
                    });
                }
                               
            });
        }

});