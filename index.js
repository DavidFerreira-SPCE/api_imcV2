const express = require('express');
const app = express();
const pool = require('./config/dB');

app.use(express.json());


app.get('/usuario', async (_, res) => { 
    try { 
        const { usuario } = await pool.query('SELECT * FROM tbimc'); 
        res.status(200).json(usuario.rows); 
    }
    catch (err) {
        console.error('Erro na Pesquisa', err);
        res.status(500).json({ error: 'Falha ao buscar os registros' });
    }
}); // GET OK

app.post('/usuario', async (req, res) => {
    const { id, name, weight, height, results, status } = req.body;
    try {
        const imc = await pool.query(
            'INSERT INTO tbimc (id, name, weight, height, results, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [id, name, weight, height, results, status]);
        res.status(201).json(imc.rows[0]);
    } catch (err) {
        console.error('Falha ao adicionar informações', err);
        res.status(500).json({ error: 'Falta de informações para inserção' });
    }
}); // POST OK

app.put('/usuario/:id', async (req, res) => {
     const { id } = req.params;
     const { name, weight, height, results, status } = req.body;
   
        try {
        const imc = await pool.query(
            'UPDATE tbimc SET name = $1, weight = $2, height = $3, results = $4, status = $5 WHERE id = $6 RETURNING *'
            [name, weight, height, results, status, id]
        );

        if (imc.rowCount === 0) {
            return res.status(404).json({ error: 'Erro na atualização', err });
        }
        res.status(201).json(imc.rows[0]);
    } catch (err) {
        console.error('Falha ao atualizar as informações', err);
        res.status(500).json({ error: 'Erro na alteração dos dados' });
    }
}); // PUT OK

app.delete('/usuario/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const id = await pool.query('DELETE FROM tbimc WHERE id = $1 RETURNING *', [id]);
        if (id.rowCount === 0) {
            return res.status(404).json({ error: 'Registro não encontrado' });
        }
        res.status(200).json({ message: 'Registro excluido com sucesso' });

    } catch (err) {
        console.error('Erro ao deletar registro', err);
        res.status(500).json({ error: 'Falha ao apagar o registro' });
    }
}); // DELETE OK

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor inicializado`);
});