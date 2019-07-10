var login = document.getElementById('login_form');
var loginForm = document.getElementById('login_form2');
var loginBtn = document.getElementById('gotoLogin');

var register = document.getElementById('registration_form');
var registerForm = document.getElementById('registration_form2');
var registerBtn = document.getElementById('gotoRegister');

document.getElementById('jumpToRegister').addEventListener('click', function(){
    login.style.display = 'none';
    register.style.display = 'block';
});
document.getElementById('jumpToLogin').addEventListener('click', function(){
    login.style.display = 'block';
    register.style.display = 'none';
});

document.getElementById('jumpToHome').addEventListener('click', function(){
  window.location.href = './index.html';
});

function progressBar(value){
  if(value){
    document.getElementById('loader').style.display = 'block';
    document.getElementById('parent').style.opacity = '0.5';
  }else{
    document.getElementById('loader').style.display = 'none';
    document.getElementById('parent').style.opacity = '1';
  }
}
progressBar(false);
///DATA OBJECT
var registrationDataObj = {};
var isRegistration = false;

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {

    console.log('User is signed in !');
    // console.log(user);
    
    if(isRegistration){
      registrationDataObj.pwd = user.uid;
      registrationDataObj.email = user.email;
      var ref = firebase.database().ref('AdminRegistrationData');
      var key = firebase.database().ref().child('AdminRegistrationData').push().key;
      ref.child(key).set(registrationDataObj, function(err){
        if(err){
          console.log('DATA NOT SAVED !');
          window.alert('There is some problem with this account !');
          progressBar(false);
        }else{
          console.log('DATA SAVED !');
          window.location.href="./admin_console.html";
          progressBar(false);
        }
      });
    }else{
      progressBar(false);
      window.location.href="./admin_console.html";
    }
    
    
  } else {
    console.log('NO user is signed in !');
    progressBar(false);
  }
});

loginBtn.addEventListener('click', function(){


  var email = document.getElementById('admin_login_email').value;
  var pwd = document.getElementById('admin_login_pwd').value;
  var status = document.getElementById('login_status');

  if(email.length===0 || pwd.length===0){
    // window.alert('Please fill all the input fields !');
    status.style.display = "block";
    status.innerHTML = "Please fill all the input fields !";
  }else{
    if(email.match("@gmail.com")===null){
      // window.alert("Please enter email in correct format !");
      status.style.display = "block";
      status.innerHTML = "Please enter email in correct format !";
    }else{
      if(pwd.length < 8){
        // window.alert('Password length should be 8 or more then 8 !');
        status.style.display = "block";
        status.innerHTML = "Password length should be 8 or more then 8 !";
      }else{
        status.style.display = "none";
        status.innerHTML = "";

        ////////
        progressBar(true);
        var auth = firebase.auth();

        auth.signInWithEmailAndPassword(email, pwd).catch(function(err){
          var code = err.code;
          var msg = err.message;
          status.style.display = "block";
          status.innerHTML = msg;
          progressBar(false);
        });
        ////////
      }
    }
  }
});
registerBtn.addEventListener('click', function(){
  var name = document.getElementById('admin_name').value;
  var email = document.getElementById('admin_email').value;
  var mobile = document.getElementById('admin_mobile').value;
  var school = document.getElementById('admin_school').value;
  var schoolId = document.getElementById('admin_school_id').value;
  var pwd = document.getElementById('admin_pwd').value;
  var confPwd = document.getElementById('admin_conf_pwd').value;
  var status = document.getElementById('reg_status');

  if(name.length===0 ||
      email.length===0 ||
      mobile.length===0 ||
      school.length===0 ||
      schoolId.length===0 ||
      pwd.length===0 ||
      confPwd.length===0){
        status.style.display = "block";
        status.innerHTML = "Please fill all the input fields !";
      }else{
        // if(email.match('@gmail.com')===null){
        //   status.style.display = "block";
        //   status.innerHTML = "Please enter email in correct format !";
        // }else{
          if(pwd.length < 8){
            status.style.display = "block";
            status.innerHTML = "Password length should be 8 or more then 8 !";
          }else{
            if(pwd!==confPwd){
              status.style.display = "block";
              status.innerHTML = "Password not matched !";
            }else{
              progressBar(true);
              status.style.display = "none";
              status.innerHTML = "";

              isRegistration = true;
              registrationDataObj.name = name;
              registrationDataObj.email = email;
              registrationDataObj.mobile = mobile;
              registrationDataObj.school = school;
              registrationDataObj.schoolId = schoolId;
              registrationDataObj.pwd = pwd;

              ///////
              firebase.auth().createUserWithEmailAndPassword(email, pwd).catch(function(err){
                var code = err.code;
                var msg = err.message;
                status.style.display = "block";
                status.innerHTML = msg;
                progressBar(false);
                isRegistration = false
              });
              ///////
            }
          }
        // }
      }
});

