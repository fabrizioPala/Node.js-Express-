const express = require('express');
const multer = require('multer');
const db = require('pg-promise')();

const app = express();
const port = 3000;

const upload = multer({ dest: 'uploads/' });

const connectionString = "postgres://postgres:postgres@localhost:5433/planets";

const setupDb = async () => {
    try {
        await db.none(`
            DROP TABLE IF EXISTS planets;
            CREATE TABLE planets (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                image TEXT
            );
        `);

        await db.none(`INSERT INTO planets(name) VALUES ('Earth')`);
        await db.none(`INSERT INTO planets(name) VALUES ('Mars')`);
    } catch (error) {
        console.error('Error in setupDb:', error);
    }
};

app.post('/planets/:id/image', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const imagePath = req.file.path; 
    try {
        await db.none(`UPDATE planets SET image = $1 WHERE id = $2`, [imagePath, id]);
        res.status(200).json({ message: 'Image uploaded successfully' });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const getAll = async (req, res) => {
    try {
        const planets = await db.many(`SELECT * FROM planets;`);
        res.status(200).json(planets);
    } catch (error) {
        console.error('Error in getAll:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getOneById = async (req, res) => {
    const { id } = req.params;
    try {
        const planet = await db.one(`SELECT * FROM planets WHERE id = $1`, Number(id));
        res.status(200).json(planet);
    } catch (error) {
        console.error('Error in getOneById:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

setupDb();

app.get('/planets', getAll);
app.get('/planets/:id', getOneById);

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
