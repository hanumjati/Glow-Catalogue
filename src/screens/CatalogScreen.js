// src/screens/CatalogScreen.js
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ProductCard from "../components/ProductCard";
import { FavoritesContext } from "../context/FavoritesContext";
import { api, API_URL } from "../api/api"; // gunakan axios api instance

export default function CatalogScreen({ navigation, route }) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // simpan produk mentah untuk filter
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const { favorites } = useContext(FavoritesContext);

  useEffect(() => {
    loadCategories();
    loadProducts();

    if (route.params?.category) {
      const cat = route.params.category;
      setActiveCategory(cat.id);
      // jika route membawa objek category, filter client-side setelah loadProducts selesai
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params]);

  async function loadCategories() {
    try {
      const res = await api.get("/api/categories");
      const data = res.data?.data || [];
      setCategories(data);
      console.log("[Catalog] categories:", data.length);
    } catch (err) {
      console.warn("[Catalog] loadCategories error:", err?.message || err);
      setCategories([]);
    }
  }

  async function loadProducts() {
    setLoading(true);
    try {
      // ambil produk terbaru (backend menyediakan endpoint ini)
      const res = await api.get("/api/products/new", { params: { limit: 100 } });
      const data = res.data?.data || [];
      setAllProducts(data);
      // jika ada kategori aktif, filter
      if (route.params?.category || activeCategory) {
        const catId = route.params?.category?.id || activeCategory;
        const filtered = data.filter((p) => String(p.category_id) === String(catId));
        setProducts(filtered);
      } else {
        setProducts(data);
      }
      console.log("[Catalog] products loaded:", data.length);
    } catch (err) {
      console.warn("[Catalog] loadProducts error:", err?.message || err);
      if (err?.response) {
        console.warn("response:", err.response.status, err.response.data);
      }
      setAllProducts([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  const handleCategoryPress = (id) => {
    if (id === activeCategory) {
      // toggle off
      setActiveCategory(null);
      setProducts(allProducts);
    } else {
      setActiveCategory(id);
      const filtered = allProducts.filter((p) => String(p.category_id) === String(id));
      setProducts(filtered);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Katalog</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Search")}>
          <Ionicons name="search" size={26} color="#444" />
        </TouchableOpacity>
      </View>

      {/* CATEGORY FILTER */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 8 }}
      >
        <TouchableOpacity
          key="all"
          style={[
            styles.categoryButton,
            activeCategory === null && styles.categoryActive,
            { marginLeft: 16 },
          ]}
          onPress={() => {
            setActiveCategory(null);
            setProducts(allProducts);
          }}
        >
          <Text style={[styles.categoryText, activeCategory === null && styles.categoryTextActive]}>
            Semua
          </Text>
        </TouchableOpacity>

        {categories.map((cat) => (
          <TouchableOpacity
            key={String(cat.id)}
            style={[
              styles.categoryButton,
              activeCategory === String(cat.id) || activeCategory === cat.id ? styles.categoryActive : null,
            ]}
            onPress={() => handleCategoryPress(cat.id)}
          >
            <Text
              style={[
                styles.categoryText,
                (activeCategory === String(cat.id) || activeCategory === cat.id) && styles.categoryTextActive,
              ]}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* PRODUCT GRID */}
      {loading ? (
        <View style={{ marginTop: 24 }}>
          <ActivityIndicator size="small" color="#ff5f8f" />
          <Text style={{ textAlign: "center", marginTop: 8 }}>Memuat produk...</Text>
        </View>
      ) : products.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>Tidak ada produk</Text>
      ) : (
        <FlatList
          data={products}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 30 }}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <ProductCard product={item} navigation={navigation} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 18,
    paddingTop: 30,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ff5f8f",
  },

  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#ffe4ef",
    marginRight: 12,
  },

  categoryActive: {
    backgroundColor: "#ff5f8f",
  },

  categoryText: {
    color: "#ff5f8f",
    fontWeight: "600",
  },

  categoryTextActive: {
    color: "#fff",
  },
});
