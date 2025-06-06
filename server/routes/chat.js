const express = require('express');
const router = express.Router();
const db = require('../db/db');
const { handleChat } = require('../services/openai');
console.log("✅ handleChat imported in chat.js:", typeof handleChat);

// 🔹 GET /api/chat/personas - fetch all available personas
router.get('/personas', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM personas');
    res.json(result.rows);
  } catch (err) {
    console.error('Failed to fetch personas:', err);
    res.status(500).send('Failed to fetch personas');
  }
});

// 🔹 POST /api/chat/session - create new chat session
router.post('/session', async (req, res) => {
  const { persona_id } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO chat_sessions (persona_id) VALUES ($1) RETURNING *',
      [persona_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Failed to create session:', err);
    res.status(500).send('Failed to create session');
  }
});

// 🔹 GET /api/chat/session/:id - get session metadata
router.get('/session/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM chat_sessions WHERE id = $1', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Failed to fetch session metadata:', err);
    res.status(500).send('Failed to fetch session');
  }
});

// 🔹 GET /api/chat/sessions - get all sessions (for sidebar/history)
router.get('/sessions', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT s.*, p.name as persona_name
       FROM chat_sessions s
       JOIN personas p ON s.persona_id = p.id
       ORDER BY s.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Failed to fetch sessions:', err);
    res.status(500).send('Failed to fetch sessions');
  }
});

// 🔹 GET /api/chat/:session_id/history - get message history for a session
router.get('/:session_id/history', async (req, res) => {
  const { session_id } = req.params;
  try {
    const history = await db.query(
      'SELECT sender, message FROM messages WHERE session_id = $1 ORDER BY timestamp ASC',
      [session_id]
    );
    res.json(history.rows);
  } catch (err) {
    console.error('Failed to fetch history:', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// 🔹 POST /api/chat - handle user input and generate reply
router.post('/', async (req, res) => {
  const { session_id, user_input } = req.body;

  try {
    const session = await db.query(
      `SELECT s.id, p.system_prompt 
       FROM chat_sessions s 
       JOIN personas p ON s.persona_id = p.id 
       WHERE s.id = $1`, 
      [session_id]
    );

    if (session.rows.length === 0) {
      return res.status(404).send('Session not found');
    }

    const { system_prompt } = session.rows[0];

    const history = await db.query(
      'SELECT sender, message FROM messages WHERE session_id = $1 ORDER BY timestamp ASC',
      [session_id]
    );

    const messages = [
      { role: 'system', content: system_prompt },
      ...history.rows.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.message
      })),
      { role: 'user', content: user_input }
    ];

    const reply = await handleChat(messages);

    // Store both messages
    await db.query(
      'INSERT INTO messages (session_id, sender, message) VALUES ($1, $2, $3)',
      [session_id, 'user', user_input]
    );

    await db.query(
      'INSERT INTO messages (session_id, sender, message) VALUES ($1, $2, $3)',
      [session_id, 'agent', reply]
    );

    res.json({ reply });

  } catch (err) {
    console.error('💥 Chat error:', err);
    res.status(500).json({ error: 'Chat failed', details: err.message });
  }
});

module.exports = router;
