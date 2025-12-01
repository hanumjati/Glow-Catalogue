// backend/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(express.json());

// Development: izinkan semua origin. Untuk produksi batasi origin.
app.use(cors({
  origin: true,
}));

const PORT = process.env.PORT || 3000;

// NOTE: gunakan SUPABASE_KEY (server key / service role key) di .env
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// health
app.get("/", (req, res) => res.send("Glow backend is running"));

// categories
app.get("/api/categories", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    res.json({ data });
  } catch (err) {
    console.error("/api/categories error:", err);
    res.status(500).json({ error: err.message || String(err) });
  }
});

// newest products
app.get("/api/products/new", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || "10", 10);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    res.json({ data });
  } catch (err) {
    console.error("/api/products/new error:", err);
    res.status(500).json({ error: err.message || String(err) });
  }
});

// best products
app.get("/api/products/best", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || "10", 10);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("rating", { ascending: false })
      .limit(limit);

    if (error) throw error;
    res.json({ data });
  } catch (err) {
    console.error("/api/products/best error:", err);
    res.status(500).json({ error: err.message || String(err) });
  }
});

// recommended products
app.get("/api/products/recommended", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || "10", 10);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: true })
      .limit(limit);

    if (error) throw error;
    res.json({ data });
  } catch (err) {
    console.error("/api/products/recommended error:", err);
    res.status(500).json({ error: err.message || String(err) });
  }
});

// product detail
app.get("/api/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    res.json({ data });
  } catch (err) {
    console.error("/api/products/:id error:", err);
    res.status(500).json({ error: err.message || String(err) });
  }
});

// SEARCH PRODUCTS (ilike name)
app.get("/api/products/search", async (req, res) => {
  try {
    const q = req.query.q || "";
    const limit = parseInt(req.query.limit || "50", 10);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .ilike("name", `%${q}%`)
      .limit(limit);

    if (error) throw error;
    res.json({ data });
  } catch (err) {
    console.error("/api/products/search error:", err);
    res.status(500).json({ error: err.message || String(err) });
  }
});

// REVIEWS: get & post
app.get("/api/reviews", async (req, res) => {
  try {
    const product_id = req.query.product_id;
    let query = supabase.from("reviews").select("*").order("created_at", { ascending: false });

    if (product_id) {
      query = query.eq("product_id", product_id);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json({ data });
  } catch (err) {
    console.error("/api/reviews GET error:", err);
    res.status(500).json({ error: err.message || String(err) });
  }
});

app.post("/api/reviews", async (req, res) => {
  try {
    const { product_id, rating, review } = req.body;
    if (!product_id || !rating || !review) {
      return res.status(400).json({ error: "product_id, rating and review are required" });
    }

    const { data, error } = await supabase
      .from("reviews")
      .insert([{ product_id, rating, review }]);

    if (error) throw error;
    res.json({ data });
  } catch (err) {
    console.error("/api/reviews POST error:", err);
    res.status(500).json({ error: err.message || String(err) });
  }
});

// start
app.listen(PORT, () => {
  console.log(`Glow backend listening on port ${PORT}`);
});
