//Create user
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

//  Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDHyi8SSmEFUu8GKLp1TfiqR7mSxCnFfXw",
    authDomain: "login-example-c6d26.firebaseapp.com",
    projectId: "login-example-c6d26",
    storageBucket: "login-example-c6d26.appspot.com",
    messagingSenderId: "839963417327",
    appId: "1:839963417327:web:6b16e181863128d891991a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


    const submit = document.getElementById("submit");
    submit.addEventListener("click", function (event) {
        event.preventDefault();
    
        //inputs
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
    
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up 
                const user = userCredential.user;
                alert("Creating account...");
                window.location.href="grand.html";
                
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorMessage);
    
            });
    })