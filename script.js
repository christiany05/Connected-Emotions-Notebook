// --- CONFIGURATION FIREBASE ---
const firebaseConfig = {
    apiKey: "notebook_christ",
    authDomain: "connected-notebook.firebaseapp.com",
    projectId: "connected-notebook",
    storageBucket: "connected-notebook.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234...xxxx"
};

// Initialisation
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const emotionsCollection = db.collection("emotions");

// Éléments du DOM
const emotionForm = document.getElementById('emotion-form');
const emotionTextInput = document.getElementById('emotion-text');
const emotionsContainer = document.getElementById('emotions-container');

// --- FONCTIONS ---

// Formater une date pour l'affichage
function formatDate(timestamp) {
    if (!timestamp) return '';
    return timestamp.toDate().toLocaleDateString('fr-FR', {
        day: 'numeric', month: 'long', year: 'numeric'
    });
}

// Afficher les émotions
function renderEmotion(doc) {
    const emotion = doc.data();
    const emotionId = doc.id;

    // Création de la carte principale
    const card = document.createElement('div');
    card.className = 'emotion-card';
    card.setAttribute('data-id', emotionId);

    card.innerHTML = `
        <div class="emotion-content">
            <span class="mood mood-${emotion.mood}">${emotion.mood}</span>
            <p>"${emotion.text}"</p>
            <span class="date">${formatDate(emotion.timestamp)}</span>
        </div>
        <div class="comments-section">
            <div class="comments-list"></div>
            <form class="comment-form">
                <input type="text" placeholder="Ajouter un commentaire..." required>
                <button type="submit">Envoyer</button>
            </form>
        </div>
    `;

    emotionsContainer.prepend(card); // prepend pour ajouter au début

    // Charger les commentaires pour cette émotion
    const commentsList = card.querySelector('.comments-list');
    emotionsCollection.doc(emotionId).collection('comments').orderBy('timestamp', 'asc').onSnapshot(snapshot => {
        commentsList.innerHTML = ''; // Vider la liste pour la rafraîchir
        snapshot.forEach(commentDoc => {
            const comment = commentDoc.data();
            const commentEl = document.createElement('div');
            commentEl.className = 'comment';
            commentEl.innerHTML = `<p>${comment.text}</p><span class="comment-date">${formatDate(comment.timestamp)}</span>`;
            commentsList.appendChild(commentEl);
        });
    });
}

// --- ÉVÉNEMENTS ---

// Envoyer une nouvelle émotion
emotionForm.addEventListener('submit', e => {
    e.preventDefault();
    const text = emotionTextInput.value;
    const mood = document.querySelector('input[name="mood"]:checked').value;

    if (text.trim() === '') return;

    emotionsCollection.add({
        text: text,
        mood: mood,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        emotionForm.reset();
    }).catch(err => {
        console.error("Erreur d'ajout de l'émotion: ", err);
    });
});

// Envoyer un nouveau commentaire (utilise la délégation d'événement)
emotionsContainer.addEventListener('submit', e => {
    e.preventDefault();

    // S'assurer que l'événement vient bien d'un formulaire de commentaire
    if (!e.target.classList.contains('comment-form')) return;

    const form = e.target;
    const input = form.querySelector('input');
    const commentText = input.value;
    
    // Trouver l'ID de l'émotion parente
    const emotionCard = form.closest('.emotion-card');
    const emotionId = emotionCard.getAttribute('data-id');

    if (commentText.trim() === '' || !emotionId) return;

    emotionsCollection.doc(emotionId).collection('comments').add({
        text: commentText,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        form.reset();
    }).catch(err => {
        console.error("Erreur d'ajout du commentaire: ", err);
    });
});


// --- CHARGEMENT INITIAL ---

// Écouter les changements dans la collection d'émotions
emotionsCollection.orderBy("timestamp", "desc").onSnapshot(snapshot => {
    emotionsContainer.innerHTML = ''; // Vider le conteneur
    if (snapshot.empty) {
        emotionsContainer.innerHTML = '<p>Aucune émotion partagée. Soyez le premier !</p>';
    } else {
        snapshot.forEach(doc => {
            renderEmotion(doc);
        });
    }
});