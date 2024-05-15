// Déclarer les variables
var selectedFile;

// Fonction ready pour masquer le bouton Soumettre
$(function () {
	$("#uploadButton").hide();

	var rootRef = firebase.database().ref().child("Posts");

	// Remplir la timeline avec les publications
	rootRef.on("child_added", snap => {
		var caption = snap.child("caption").val();
		var email = snap.child("userEmail").val();
		var myUrl = snap.child("url").val();

		// Préfixer la publication
		$(".timeline").prepend(`<div class="post"> <a target="_blank" href="${myUrl}"> <img src="${myUrl}" width="600"> </a> <h1>${caption}</h1></div>`);
	});
});

// Lorsque l'utilisateur clique sur le bouton, faire défiler jusqu'en haut du document
function topFunction() {
	document.body.scrollTop = 0; // Pour Safari
	document.documentElement.scrollTop = 0; // Pour Chrome, Firefox, IE et Opera
};


// Sélection de l'entrée
$(function () { // Le DOM est prêt
	$("#file").change(function (event) {
		selectedFile = event.target.files[0]; // Pour l'instant, ne sélectionner qu'un seul fichier même si plusieurs sont téléchargés par l'utilisateur
		$("#uploadButton").show();
	});
});


// TÉLÉCHARGEMENT DE FICHIER
// Pour télécharger un fichier sur le stockage Cloud, vous créez d'abord une référence au chemin complet du fichier, y compris le nom du fichier
function uploadFile() {
	// Obtenir le nom de fichier et créer une référence à celui-ci
	var filename = selectedFile.name;
	// Créer une référence principale
	var storageRef = firebase.storage().ref('/carImages/' + filename); // Obtenir le dossier principal de la base de données
	var uploadTask = storageRef.put(selectedFile);

	// Enregistrer trois observateurs :
	// 1. Observateur 'state_changed', appelé chaque fois que l'état change
	// 2. Observateur d'erreur, appelé en cas d'échec
	// 3. Observateur de complétion, appelé en cas de réussite
	uploadTask.on('state_changed', function (snapshot) {
		// Observer les événements de changement d'état tels que la progression, la pause et la reprise
		// Obtenir la progression de la tâche, y compris le nombre d'octets téléchargés et le nombre total d'octets à télécharger
		var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
		console.log('Téléchargement en cours : ' + progress + '%');
		switch (snapshot.state) {
			case firebase.storage.TaskState.PAUSED: // ou 'paused'
				console.log('Téléchargement en pause');
				break;
			case firebase.storage.TaskState.RUNNING: // ou 'running'
				console.log('Téléchargement en cours');
				break;
		}
	}, function (error) {
		// Gérer les téléchargements non réussis
	}, function () {
		// Gérer les téléchargements réussis
		// Par exemple, obtenir l'URL de téléchargement : https://firebasestorage.googleapis.com/...
		var postKey = firebase.database().ref('Posts/').push().key;

		uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
			var updates = {};
			var postData = {
				userName: firebase.auth().currentUser.displayName,
				userEmail: firebase.auth().currentUser.email,
				url: downloadURL,
				caption: $("#imageCaption").val()
			};
			updates['/Posts/' + postKey] = postData;
			firebase.database().ref().update(updates);
			console.log('Fichier disponible à', downloadURL);
		});

		// CRÉER DIV DE PUBLICATION ICI : Inclure la légende
		storageRef.getDownloadURL().then(function (url) {
			var timeline = document.getElementById("timeline");
			var img = document.createElement("IMG");
			img.src = url;

			// Obtenir la légende de la publication
			var myCaption = firebase.database().ref('/Posts/' + postKey + '/caption');
			myCaption.on('value', function (snapshot) {
				//$(".timeline").prepend(`<div class="post"> <a target="_blank" href="${img.src}"> <img src="${img.src}" width="600"> </a> <h1>${snapshot.val()}</h1></div>`);
				// Faire défiler vers le haut après avoir publié une nouvelle image
				topFunction();
				// Masquer le bouton de téléchargement après le téléchargement
				$("#uploadButton").hide();
				// Effacer le champ de légende après le téléchargement
				$("#imageCaption").val("");
			});
		});
	});
};


/** 
 * Gère le processus de déconnexion
 */
function signOut() {
	if (firebase.auth().currentUser) {
		//[Start sign out]
		firebase.auth().signOut();
		//[End sign out]
		document.location.replace("login.html");
	} else {
		window.alert("Vous êtes déjà déconnecté");
		document.location.replace("login.html");
	}
}
