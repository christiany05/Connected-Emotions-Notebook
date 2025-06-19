// script.js

document.addEventListener('DOMContentLoaded', () => {
    const feed = document.getElementById('emotions-feed');
    const form = document.getElementById('emotion-form');
    const emotionText = document.getElementById('emotion-text');
    const emotionMood = document.getElementById('emotion-mood');

    // Fonction pour afficher les émotions dans le DOM
    const displayEmotions = (emotions) => {
        feed.innerHTML = ''; // Vide le flux avant de le remplir
        if (emotions.length === 0) {
            feed.innerHTML = '<p style="text-align:center;">Aucune émotion partagée pour le moment. Sois le premier !</p>';
            return;
        }

        emotions.forEach(emotion => {
            const card = document.createElement('div');
            card.className = 'emotion-card';

            const text = document.createElement('p');
            text.textContent = emotion.text;

            const footer = document.createElement('div');
            footer.className = 'card-footer';
            
            const mood = document.createElement('span');
            mood.className = 'mood-tag';
            mood.textContent = emotion.mood;

            const metadata = document.createElement('span');
            const date = new Date(emotion.date).toLocaleDateString('en-EN', { day: 'numeric', month: 'long' });
            metadata.textContent = `${emotion.source} • Posted on the ${date}`;

            footer.appendChild(mood);
            footer.appendChild(metadata);
            card.appendChild(text);
            card.appendChild(footer);
            feed.appendChild(card);
        });
    };

    // Fonction pour récupérer les émotions depuis l'API
    const fetchEmotions = () => {
    // On simule les données directement ici, puisqu'on n'a pas de serveur
    const staticEmotions = [
      {
        "id": 1,
        "text": "Today, I found this journal. The idea is poetic. It gives me hope.",
        "mood": "Grateful",
        "source": "📖",
        "date": "2023-10-24T12:00:00.000Z"
      },
      {
        "id": 2,
        "text": "Feeling a bit lonely right now, but reading the other messages feels good. We're all in this together.",
        "mood": "Sad",
        "source": "🌐",
        "date": "2023-10-24T12:05:00.000Z"
      },
      {
        "id": 3,
        "text": "Productive day! I'm proud of what I've accomplished.",
        "mood": "Joyful",
        "source": "🌐",
        "date": "2023-10-23T14:30:00.000Z"
      }
    ];

    displayEmotions(staticEmotions);
};

// Modifiez aussi la gestion du formulaire pour qu'il ne tente pas d'envoyer de données
form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert("On this demo version, new feelings can't be added. This feature will be available soon!");
});

// Chargement initial des émotions
fetchEmotions();
});