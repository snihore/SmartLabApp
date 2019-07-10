// Get the modal
var modal = document.getElementById("myModal");
var modal2 = document.getElementById("myModal2");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");
var removeBtn = document.getElementById("removeBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[1];
var add_item_btn = document.getElementById('add_item_btn');

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}
removeBtn.onclick = function() {
  modal2.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal2.style.display = "none";
}

// add_item_btn.onclick = function() {
    
// }

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
  if (event.target == modal2) {
    modal2.style.display = "none";
  }
}


var adminInfo = null;
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log('User is signed in !');
    console.log(user);
    var userEmail = user.email;
    //GET admin user info
    var ref = firebase.database().ref('AdminRegistrationData');
    ref.orderByChild("email").equalTo(userEmail).once('value', function(snapshot){
      snapshot.forEach(function(snap){
        adminInfo = snap.val();
        // console.log(adminInfo);
        if(adminInfo != null){
          if(adminInfo.name.split(" ").length >= 2){
            document.getElementById('admin_name_show').innerHTML = adminInfo.name.split(' ')[0];
          }else{
            document.getElementById('admin_name_show').innerHTML = adminInfo.name;
          }
          
        }
      });
    });

  } else {
    console.log('NO user is signed in !');
    window.location.href="./admin_registration.html";
  }
});

var logoutBtn = document.getElementById('admin_logout');
logoutBtn.addEventListener('click', function(){
  firebase.auth().signOut()
    .then(function(){
      console.log('Logout !');
    })
    .catch(function(err){
      console.log("LOGOUT: error ouccur !");
    });
});