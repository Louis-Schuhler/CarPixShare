/**
 * Gère l'appui sur le bouton de connexion.
 */
function handleLogIn() {
    if (firebase.auth().currentUser) {
        // [START signout]
        firebase.auth().signOut();
        console.log("Nous avons été déconnectés :(");
        // [END signout]
    } else {
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        if (email.length < 4) {
            alert('Veuillez saisir une adresse e-mail.');
            return;
        }
        if (password.length < 4) {
            alert('Veuillez saisir un mot de passe.');
            return;
        }
        // Connexion avec l'e-mail et le mot de passe.
        // [START authwithemail]
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
            // Gérer les erreurs ici.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode === 'auth/wrong-password') {
                alert('Mauvais mot de passe.');
            } else {
                alert(errorMessage);
            }
            console.log(error);
            // [END_EXCLUDE]
        });
        // [END authwithemail]
    }
    // Connexion réussie
}

/**
 * Gère l'appui sur le bouton d'inscription.
 */
function handleSignUp() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var myName = document.getElementById('name').value;

    if (myName == "") {
        alert('Veuillez saisir un nom.');
        return;
    }
    if (email.length < 4) {
        alert('Veuillez saisir une adresse e-mail.');
        return;
    }
    if (password.length < 4) {
        alert('Veuillez saisir un mot de passe.');
        return;
    }


    firebase.auth().createUserWithEmailAndPassword(email, password).then(function () {
        user = firebase.auth().currentUser;
        //user.sendEmailVerification();
    }).then(function () {
        user.updateProfile({
            displayName: myName
        })
    }).catch(function (error) {
        // Gérer les erreurs ici.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/weak-password') {
            alert('Le mot de passe est trop faible.');
        } else {
            alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
    });
}


/*
Observer le changement de statut
MISE À JOUR DE L'UTILISATEUR : https://firebase.google.com/docs/reference/js/firebase.User#updateProfile
*/
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // L'utilisateur est connecté.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        window.location.replace("index.html");
        // ...
    } else {
        // L'utilisateur est déconnecté.
    }
});
