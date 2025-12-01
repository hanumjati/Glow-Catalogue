// src/controllers/productController.js
const supabase = require('../config/supabase');

exports.getAllProducts = async (req, res) => {
  try {
    const { q, category, limit = 100, offset = 0 } = req.query;
    let builder = supabase.from('products').select('*');

    if (q) builder = builder.ilike('name', `%${q}%`);
    if (category) builder = builder.eq('category', category);

    const from = Number(offset);
    const to = from + Number(limit) - 1;

    const { data, error } = await builder.range(from, to).order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('products').select('*').eq('id', id).maybeSingle();
    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: 'Product not found' });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
