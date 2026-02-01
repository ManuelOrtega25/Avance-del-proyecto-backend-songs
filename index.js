// index.js usando express para crear un servidor con endpoints para manejar canciones
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// arreglo en memoria para almacenar las songs
let songs = [];

// GET listar todas las songs
app.get('/songs', (req, res) => {
    res.status(200).json(songs);
});

// POST crear una o varias songs
app.post('/songs', (req, res) => {
    const body = req.body;

    // permitir recibir una song o varias
    const songsArray = Array.isArray(body) ? body : [body];

    for (const song of songsArray) {
        const { nombre, duracion, url } = song;

        // validar datos obligatorios
        if (!nombre || !duracion || !url) {
            return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
        }

        // guardar song como objeto 
        songs.push({
            nombre,
            duracion,
            url
        });
    }

    // si todo está bien
    res.status(201).json({
        mensaje: "Canción(es) creada(s) correctamente",
        songs
    });
});

// PUT actualizar song por ID
app.put('/songs/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const body = req.body;

    // validar ID numérico
    if (isNaN(id)) {
        return res.status(400).json({ mensaje: "ID inválido" });
    }

    // validar existencia del ID
    if (!songs[id]) {
        return res.status(404).json({ mensaje: "El ID de la song no existe" });
    }

    // validar body vacío
    if (!body || Object.keys(body).length === 0) {
        return res.status(400).json({ mensaje: "Body vacío" });
    }

    const { nombre, duracion, url } = body;

    // validar datos obligatorios
    if (!nombre || !duracion || !url) {
        return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
    }

    // actualizar song
    songs[id] = {
        nombre,
        duracion,
        url
    };

    res.status(200).json(songs[id]);
});

// DELETE 
app.delete('/songs/:id', (req, res) => {
    const id = parseInt(req.params.id);

    // validar ID numérico
    if (isNaN(id)) {
        return res.status(400).json({ mensaje: "ID inválido" });
    }

    // validar existencia del ID
    if (!songs[id]) {
        return res.status(404).json({ mensaje: "El ID de la song no existe" });
    }

    // eliminar song
    songs.splice(id, 1);
    res.status(204).send();
});

// servidor activo
app.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`);

});
