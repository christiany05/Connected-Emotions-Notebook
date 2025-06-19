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
    const fetchEmotions = async () => {
        try {
            const response = await fetch('/api/emotions');
            if (!response.ok) throw new Error('Erreur réseau');
            const emotions = await response.json();
            displayEmotions(emotions);
        } catch (error) {
            console.error('Impossible de charger les émotions:', error);
            feed.innerHTML = '<p style="text-align:center; color:red;">Impossible de se connecter au serveur des émotions.</p>';
        }
    };

    // Gérer la soumission du formulaire
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const newEmotion = {
            text: emotionText.value.trim(),
            mood: emotionMood.value
        };

        if (!newEmotion.text || !newEmotion.mood) {
            alert('Veuillez remplir tous les champs.');
            return;
        }

        try {
            const response = await fetch('/api/emotions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newEmotion)
            });

            if (!response.ok) throw new Error('Erreur lors de l\'envoi');

            // Réinitialiser le formulaire et rafraîchir la liste
            emotionText.value = '';
            emotionMood.value = '';
            fetchEmotions();

        } catch (error) {
            console.error('Erreur lors du partage de l\'émotion:', error);
            alert('Une erreur est survenue. Veuillez réessayer.');
        }
    });

    // Chargement initial des émotions
    fetchEmotions();
});