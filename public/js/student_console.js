

// Get the modal
var modal = document.getElementById("myModal");



// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];


// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}


// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

var stuInfo = null;
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log('User is signed in !');
    console.log(user);
    var userEmail = user.email;
    //GET admin user info
    var ref = firebase.database().ref('StudentRegistrationData');
    ref.orderByChild("email").equalTo(userEmail).once('value', function(snapshot){
      snapshot.forEach(function(snap){
        stuInfo = snap.val();
        // console.log(stuInfo);
        if(stuInfo != null){
          if(stuInfo.name.split(" ").length >= 2){
            document.getElementById('stu_name_show').innerHTML = stuInfo.name.split(' ')[0];
          }else{
            document.getElementById('stu_name_show').innerHTML = stuInfo.name;
          }
          
        }
      });
    });

  } else {
    console.log('NO user is signed in !');
    window.location.href="./student_registration.html";
  }
});

var logoutBtn = document.getElementById('stu_logout');
logoutBtn.addEventListener('click', function(){
  firebase.auth().signOut()
    .then(function(){
      console.log('Logout !');
    })
    .catch(function(err){
      console.log("LOGOUT: error ouccur !");
    });
});

var borrowBtn = document.getElementById('stu_borrow');
borrowBtn.addEventListener('click', function(){
  modal.style.display = "block";
});