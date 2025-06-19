const express = require('express');
const fs = require('fs').promises; // On utilise la version "promise" du module fs
const path = require('path');

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, 'db.json');

// Middlewares
app.use(express.static('public')); // Sert les fichiers statiques (HTML, CSS, JS)
app.use(express.json()); // Permet de parser les requêtes JSON

// Fonction pour lire la base de données
const readDb = async () => {
    try {
        const data = await fs.readFile(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // Si le fichier n'existe pas ou est vide, on retourne un tableau vide
        if (error.code === 'ENOENT') return [];
        throw error;
    }
};

// Fonction pour écrire dans la base de données
const writeDb = async (data) => {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
};

// --- API ROUTES ---

// GET /api/emotions - Récupérer toutes les émotions
app.get('/api/emotions', async (req, res) => {
    const emotions = await readDb();
    res.json(emotions);
});

// POST /api/emotions - Poster une nouvelle émotion
app.post('/api/emotions', async (req, res) => {
    const { text, mood } = req.body;

    if (!text || !mood) {
        return res.status(400).json({ message: 'Le texte et l\'humeur sont requis.' });
    }

    const newEmotion = {
        id: Date.now(), // ID unique basé sur le temps
        text: text,
        mood: mood,
        source: '🌐', // Provient du web par défaut
        date: new Date().toISOString()
    };

    const emotions = await readDb();
    emotions.unshift(newEmotion); // Ajoute la nouvelle émotion au début du tableau
    await writeDb(emotions);

    res.status(201).json(newEmotion);
});

// Lancement du serveur
app.listen(PORT, () => {
    console.log(`Le serveur du Carnet des Émotions écoute sur http://localhost:${PORT}`);
});