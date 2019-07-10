
var ref = firebase.database().ref('SmartLabItems');
var ref_borrow = firebase.database().ref('BorrowedItems');
var itemsContainer = document.getElementById('items_container2');
var itemsContainer_borrow = document.getElementById('items_container_borrowed_items');

ref.orderByChild("isBorrowed").equalTo(false).on('value', function(snapshot){
    
    itemsContainer.innerHTML = "";
    document.getElementById("qrcode").innerHTML = "";
    snapshot.forEach(function(snap){
        
        console.log(snap.val());
        var name = snap.val().itemName;
        var num = snap.val().itemNumber;
        var desc = snap.val().itemDescription;
        var addBy = snap.val().addBy;
        console.log(`${name}, ${num}, ${addBy}`);
        var query = `<div class="item_show" id="item_show">
                <p><span class="item_name_show">${name}</span> <span class="item_num_show">${num}</span></p>
                <p class="item_desc_show">${desc}</p>
            </div>`;

        itemsContainer.insertAdjacentHTML('beforeend', query);
    });
});

firebase.auth().onAuthStateChanged(function(user){
    if(user){
        ref_borrow.orderByChild("userEmail").equalTo(user.email).on('value', function(snapshot){
            itemsContainer_borrow.innerHTML = "";
            snapshot.forEach(function(snap){
                console.log(snap.val());
                var name = snap.val().itemName;
                var num = snap.val().itemNum;
                var date = snap.val().returnDate;
                var email = snap.val().userEmail;
                
                var query = `<div class="item_show">
                <p><span class="item_name_show">${name}</span> <span class="item_num_show">${num}</span></p>
                <p class="item_common">Borrowed By: <div class="item_common_div">${email}</div></p>
                <p class="item_common">Return Date: <div class="item_common_div">${date}</div></p>
            </div>`;
        
                itemsContainer_borrow.insertAdjacentHTML('beforeend', query);
            });
        });
    }
});

