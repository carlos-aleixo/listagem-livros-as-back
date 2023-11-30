const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const porta = 3030;

const db = new sqlite3.Database('./banco.db');

db.run(`
  CREATE TABLE IF NOT EXISTS livros (
    id INTEGER PRIMARY KEY, 
    titulo TEXT, 
    autor TEXT,
    editora TEXT,
    ano TEXT,
    concluida INTEGER
  )
`);

app.use(express.json());
app.use(cors());

app.get('/api/livros', (req, res) => {
  db.all('SELECT * FROM livros', (erro, registros) => {
    if (erro) {
      return res.status(500).json({ erro: erro.message });
    }
    res.json(registros);
  });
});

app.post('/api/livros', (req, res) => {
  const { titulo } = req.body;
  const { autor } = req.body;
  const { editora } = req.body;
  const { ano } = req.body;
  const concluida = 0;

  db.run('INSERT INTO livros (titulo, autor, editora, ano, concluida) VALUES (?, ?, ?, ?, ?)', [titulo, autor, editora, ano, concluida], function (erro) {
    if (erro) {
      return res.status(500).json({ erro: erro.message });
    }
    res.status(201).json({ mensagem: 'Livro adicionado com sucesso', id: this.lastID });
  });
});

app.patch('/api/livros/:id', (req, res) => {
  const { id } = req.params;
  const { concluida } = req.body;

  db.run('UPDATE livros SET concluida = ? WHERE id = ?', concluida, id, function (erro) {
    if (erro) {
      return res.status(500).json({ erro: erro.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ mensagem: 'Livro não encontrado' });
    }
    res.json({ mensagem: 'Livro marcado como concluído' });
  });
});

app.delete('/api/livros/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM livros WHERE id = ?', id, function (erro) {
    if (erro) {
      return res.status(500).json({ erro: erro.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ mensagem: 'Livro não encontrada' });
    }
    res.json({ mensagem: 'Livro excluído com sucesso' });
  });
});

app.listen(porta, () => {
  console.log(`Servidor rodando em localhost:${porta}`);
});