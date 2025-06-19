// --- CONFIGURATION FIREBASE ---
const firebaseConfig = {
    apiKey: "AIza...xxxxxxxxxxx",
    authDomain: "connected-notebook.firebaseapp.com",
    projectId: "connected-notebook",
    storageBucket: "connected-notebook.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234...xxxx"
};

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// --- GESTION DE LA PAGE ---

const form = document.getElementById('emotion-form');
const emotionTextInput = document.getElementById('emotion-text');
const emotionsContainer = document.getElementById('emotions-container');

// Fonction pour sauvegarder une émotion dans la base de données
const saveEmotion = (text, mood) => {
    db.collection("emotions").add({
        text: text,
        mood: mood,
        timestamp: firebase.firestore.FieldValue.serverTimestamp() // Ajoute la date actuelle
    })
    .then((docRef) => {
        console.log("Émotion sauvegardée avec l'ID: ", docRef.id);
        form.reset(); // Vide le formulaire après envoi
    })
    .catch((error) => {
        console.error("Erreur lors de l'ajout: ", error);
        alert("Une erreur est survenue. Veuillez réessayer.");
    });
};

// Écouteur d'événement pour l'envoi du formulaire
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Empêche la page de se recharger
    
    const emotionText = emotionTextInput.value;
    const selectedMood = document.querySelector('input[name="mood"]:checked').value;
    
    if (emotionText.trim() === '') {
        alert("Veuillez écrire quelque chose !");
        return;
    }
    
    saveEmotion(emotionText, selectedMood);
});

// Fonction pour afficher les émotions depuis la base de données
const displayEmotions = (emotions) => {
    emotionsContainer.innerHTML = ''; // Vide le conteneur avant d'ajouter les nouvelles cartes

    if (emotions.length === 0) {
        emotionsContainer.innerHTML = "<p>Aucune émotion partagée pour le moment. Soyez le premier !</p>";
        return;
    }

    emotions.forEach(emotion => {
        const data = emotion.data();
        const card = document.createElement('div');
        card.className = 'emotion-card';
        
        // Formater la date
        const date = data.timestamp ? data.timestamp.toDate().toLocaleDateString('fr-FR') : 'Date inconnue';

        card.innerHTML = `
            <span class="mood mood-${data.mood}">${data.mood}</span>
            <p>"${data.text}"</p>
            <span class="date">${date}</span>
        `;
        emotionsContainer.appendChild(card);
    });
};

// Écouter les changements dans la collection "emotions" en temps réel
db.collection("emotions")
  .orderBy("timestamp", "desc") // Trie par date, la plus récente en premier
  .onSnapshot((querySnapshot) => {
    const emotions = [];
    querySnapshot.forEach((doc) => {
        emotions.push(doc);
    });
    displayEmotions(emotions);
  });