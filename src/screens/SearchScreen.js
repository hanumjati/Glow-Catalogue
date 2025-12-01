// src/screens/SearchScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProductCard from "../components/ProductCard";

// ==============================
// API BACKEND
// GANTI SESUAI IP / DOMAIN KAMU
// ==============================
const API_URL = "http://10.111.34.60:3000/products/search";

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);

  // =================================
  //     LOAD HISTORY
  // =================================
  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    const saved = await AsyncStorage.getItem("search_history");
    if (saved) setHistory(JSON.parse(saved));
  }

  // =================================
  //      SAVE HISTORY
  // =================================
  async function saveHistory(text) {
    if (!text.trim()) return;

    const newHistory = [text, ...history.filter((h) => h !== text)].slice(0, 6);

    setHistory(newHistory);
    await AsyncStorage.setItem(
      "search_history",
      JSON.stringify(newHistory)
    );
  }

  async function clearHistory() {
    setHistory([]);
    await AsyncStorage.removeItem("search_history");
  }

  // ============================================
  //            CALL API BACKEND
  // ============================================
  async function searchProducts(text) {
    setQuery(text);

    if (text.trim() === "") {
      setResults([]);
      return;
    }

    try {
      const response = await fetch(`${API_URL}?q=${encodeURIComponent(text)}`);
      const data = await response.json();

      setResults(data || []);
    } catch (error) {
      console.log("Error fetching products:", error);
    }
  }

  function handleSubmit() {
    if (!query.trim()) return;
    saveHistory(query);
    searchProducts(query);
  }

  // ============================================
  //                 RENDERING
  // ============================================
  return (
    <View style={styles.container}>
      {/* SEARCH BAR */}
      <View style={styles.searchRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#ff5f8f" />
        </TouchableOpacity>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#ff5f8f" />
          <TextInput
            placeholder="Cari skincare..."
            style={styles.input}
            value={query}
            onChangeText={searchProducts}
            onSubmitEditing={handleSubmit}
            returnKeyType="search"
          />
        </View>
      </View>

      {/* HISTORY */}
      {results.length === 0 && query.length === 0 && history.length > 0 && (
        <View>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Pencarian Terakhir</Text>
            <TouchableOpacity onPress={clearHistory}>
              <Text style={styles.clearHistory}>Hapus</Text>
            </TouchableOpacity>
          </View>

          {history.map((h, index) => (
            <TouchableOpacity
              key={index}
              style={styles.historyItem}
              onPress={() => {
                setQuery(h);
                searchProducts(h);
              }}
            >
              <Ionicons name="time" size={18} color="#999" />
              <Text style={styles.historyText}>{h}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* EMPTY STATE */}
      {query !== "" && results.length === 0 && (
        <View style={styles.emptyBox}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/6134/6134065.png",
            }}
            style={styles.emptyImg}
          />
          <Text style={styles.emptyText}>Produk tidak ditemukan</Text>
        </View>
      )}

      {/* RESULT GRID */}
      <FlatList
        data={results}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10 }}
        renderItem={({ item }) => (
          <ProductCard product={item} navigation={navigation} />
        )}
      />
    </View>
  );
}

// =====================================
//               STYLES
// =====================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 30,
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffe8f2",
    marginLeft: 12,
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },

  input: {
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },

  historyHeader: {
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  historyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ff5f8f",
  },

  clearHistory: {
    fontSize: 14,
    color: "#999",
  },

  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },

  historyText: {
    fontSize: 14,
    color: "#444",
    marginLeft: 10,
  },

  emptyBox: {
    alignItems: "center",
    marginTop: 40,
  },

  emptyImg: {
    width: 130,
    height: 130,
    opacity: 0.8,
  },

  emptyText: {
    marginTop: 10,
    color: "#777",
    fontSize: 15,
  },
});
