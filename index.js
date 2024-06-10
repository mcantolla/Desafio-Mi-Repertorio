const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3001;
const filePath = './repertorio.json';

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

app.post('/canciones', (req, res) => {
    const nuevaCancion = req.body;
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error leyendo el archivo.');
        }
        const repertorio = JSON.parse(data);
        repertorio.push(nuevaCancion);
        fs.writeFile(filePath, JSON.stringify(repertorio), (err) => {
            if (err) {
                return res.status(500).send('Error guardando la canción.');
            }
            res.status(201).send('Canción agregada.');
        });
    });
});

app.get('/canciones', (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error leyendo el archivo.');
        }
        res.json(JSON.parse(data));
    });
});

app.put('/canciones/:id', (req, res) => {
    const id = req.params.id;
    const cancionActualizada = req.body;
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error leyendo el archivo.');
        }
        let repertorio = JSON.parse(data);
        repertorio = repertorio.map(cancion => (cancion.id === id ? cancionActualizada : cancion));
        fs.writeFile(filePath, JSON.stringify(repertorio), (err) => {
            if (err) {
                return res.status(500).send('Error actualizando la canción.');
            }
            res.send('Canción actualizada.');
        });
    });
});

app.delete('/canciones/:id', (req, res) => {
    const id = req.params.id;
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error leyendo el archivo.');
        }
        let repertorio = JSON.parse(data);
        repertorio = repertorio.filter(cancion => cancion.id !== id);
        fs.writeFile(filePath, JSON.stringify(repertorio), (err) => {
            if (err) {
                return res.status(500).send('Error eliminando la canción.');
            }
            res.send('Canción eliminada.');
        });
    });
});
