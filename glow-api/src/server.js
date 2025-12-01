// glow-api/src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// Optional: setup supabase (only if you filled .env with SUPABASE_URL and SUPABASE_KEY)
let supabase;
if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
}

app.get('/', (req, res) => res.json({ ok: true, message: 'glow-api running' }));

// example products endpoint: try supabase first, fallback to static
app.get('/products', async (req, res) => {
  try {
    if (supabase) {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false }).limit(100);
      if (error) {
        console.warn('Supabase error:', error);
      } else {
        return res.json(data);
      }
    }
  } catch (e) {
    console.warn('Error fetching from supabase', e);
  }

  // fallback sample data if supabase not configured / empty
  return res.json([
    { id: 'mock-1', name: 'AHA BHA PHA Exfoliating Pads', price: 135000, image_url: '', short_desc: 'Eksfoliasi lembut', category_name: 'Cleanser' },
    { id: 'mock-2', name: '10% Vitamin C Serum', price: 135000, image_url: '', short_desc: 'Mencerahkan', category_name: 'Serum' }
  ]);
});

app.get('/products/:id', async (req, res) => {
  const id = req.params.id;
  if (supabase) {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).limit(1);
    if (error) return res.status(500).json({ error });
    return res.json(data?.[0] ?? null);
  }
  // fallback
  return res.json({ id, name: 'Mock product', price: 100000 });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`glow-api listening on 0.0.0.0:${PORT}`);
});
