// src/components/ProductCard.js
import React, { useContext } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FavoritesContext } from "../context/FavoritesContext";

export default function ProductCard({ product, navigation }) {
  const { favorites, addFavorite, removeFavorite } =
    useContext(FavoritesContext);

  const isFavorite = favorites.some((fav) => fav.id === product.id);

  const toggleFavorite = () => {
    if (isFavorite) removeFavorite(product.id);
    else addFavorite(product);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => navigation.navigate("ProductDetail", { product })}
    >
      {/* Heart Icon */}
      <TouchableOpacity style={styles.heartButton} onPress={toggleFavorite}>
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={20}
          color={isFavorite ? "#ff4d79" : "#999"}
        />
      </TouchableOpacity>

      {/* Product Image */}
      <Image source={{ uri: product.image_url }} style={styles.image} />

      {/* Content */}
      <View style={styles.infoBox}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>

        <Text style={styles.price}>Rp {product.price.toLocaleString()}</Text>

        {/* Rating */}
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={14} color="#ffb703" />
          <Text style={styles.ratingText}>{product.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingBottom: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#ff8fbf",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    marginBottom: 18,
  },

  heartButton: {
    position: "absolute",
    zIndex: 10,
    right: 10,
    top: 10,
    backgroundColor: "#fff",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  image: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: "#ffeef5",
  },

  infoBox: {
    paddingHorizontal: 10,
    paddingTop: 8,
  },

  name: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    height: 36,
  },

  price: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ff5f8f",
    marginTop: 4,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  ratingText: {
    marginLeft: 4,
    fontSize: 13,
    fontWeight: "500",
    color: "#444",
  },
});
