// src/screens/FavoritesScreen.js
import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { FavoritesContext } from "../context/FavoritesContext";
import ProductCard from "../components/ProductCard";
import { Ionicons } from "@expo/vector-icons";

export default function FavoritesScreen({ navigation }) {
  const { favorites, loading } = useContext(FavoritesContext);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Favorite Kamu</Text>
        <Ionicons name="heart" size={26} color="#ff5f8f" />
      </View>

      {/* LOADING */}
      {loading ? (
        <Text style={styles.loadingText}>Memuat favorit...</Text>
      ) : favorites.length === 0 ? (
        /* EMPTY STATE */
        <View style={styles.emptyContainer}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/4076/4076500.png",
            }}
            style={styles.emptyImg}
          />
          <Text style={styles.emptyTitle}>Belum Ada Favorite</Text>
          <Text style={styles.emptyText}>
            Produk yang kamu favoritkan akan muncul di sini. 💗
          </Text>

          <TouchableOpacity
            style={styles.browseBtn}
            onPress={() => navigation.navigate("Katalog")}
          >
            <Text style={styles.browseText}>Jelajahi Produk</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* PRODUCT GRID */
        <FlatList
          data={favorites}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10 }}
          columnWrapperStyle={{ justifyContent: "space-between" }}
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

  loadingText: {
    marginTop: 30,
    textAlign: "center",
    color: "#777",
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 40,
    paddingHorizontal: 20,
  },

  emptyImg: {
    width: 140,
    height: 140,
    marginBottom: 10,
    opacity: 0.9,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ff5f8f",
  },

  emptyText: {
    marginTop: 4,
    color: "#777",
    textAlign: "center",
    fontSize: 14,
    width: "80%",
  },

  browseBtn: {
    marginTop: 16,
    backgroundColor: "#ff5f8f",
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 20,
  },

  browseText: {
    color: "#fff",
    fontWeight: "700",
  },
});
