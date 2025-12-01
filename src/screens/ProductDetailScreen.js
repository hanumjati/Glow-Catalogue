import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FavoritesContext } from "../context/FavoritesContext";
import { api } from "../api/api";

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const { favorites, addFavorite, removeFavorite } =
    useContext(FavoritesContext);

  const isFavorite = favorites.some((fav) => fav.id === product.id);

  const toggleFavorite = () => {
    if (isFavorite) removeFavorite(product.id);
    else addFavorite(product);
  };

  // --------------------------------------------
  //            STATE REVIEW
  // --------------------------------------------
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  // --------------------------------------------
  //        FETCH REVIEW DARI BACKEND
  // --------------------------------------------
  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    try {
      const res = await api.get("/reviews", {
        params: { product_id: product.id },
      });

      setReviews(res.data?.data || []);
    } catch (err) {
      console.log("Load reviews error:", err);
      setReviews([]);
    }
  }

  // --------------------------------------------
  //        SUBMIT REVIEW KE BACKEND
  // --------------------------------------------
  async function submitReview() {
    if (rating === 0 || !reviewText.trim()) return;

    try {
      await api.post("/reviews", {
        product_id: product.id,
        rating,
        review: reviewText,
      });

      setReviewText("");
      setRating(0);
      setModalVisible(false);

      loadReviews(); // refresh
    } catch (err) {
      console.log("Submit review error:", err);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView>
        {/* IMAGE */}
        <Image source={{ uri: product.image_url }} style={styles.image} />

        {/* Favorite Button */}
        <TouchableOpacity style={styles.heartBtn} onPress={toggleFavorite}>
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={28}
            color={isFavorite ? "#ff4d79" : "#333"}
          />
        </TouchableOpacity>

        {/* CONTENT */}
        <View style={styles.content}>
          {/* NAME */}
          <Text style={styles.name}>{product.name}</Text>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={18} color="#ffb703" />
            <Text style={styles.ratingText}>
              {product.rating ? product.rating : "-"}
            </Text>
          </View>

          {/* PRICE */}
          <Text style={styles.price}>
            Rp {Number(product.price).toLocaleString()}
          </Text>

          {/* DESCRIPTION */}
          <Text style={styles.sectionTitle}>Deskripsi</Text>
          <Text style={styles.desc}>
            {product.description || "Tidak ada deskripsi."}
          </Text>

          {/* INGREDIENTS */}
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <View style={styles.tagContainer}>
            {product.ingredients?.length ? (
              product.ingredients.map((ing, i) => (
                <View key={i} style={styles.tag}>
                  <Text style={styles.tagText}>{ing}</Text>
                </View>
              ))
            ) : (
              <Text style={{ color: "#777" }}>Tidak ada data.</Text>
            )}
          </View>

          {/* REVIEWS */}
          <View style={styles.reviewHeader}>
            <Text style={styles.sectionTitle}>Ulasan Pengguna</Text>

            <TouchableOpacity
              style={styles.addReviewBtn}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="add-circle" size={22} color="#fff" />
              <Text style={styles.addReviewText}>Tambah Review</Text>
            </TouchableOpacity>
          </View>

          {/* LIST REVIEW */}
          {reviews.length === 0 ? (
            <Text style={{ color: "#777", marginTop: 6 }}>
              Belum ada ulasan.
            </Text>
          ) : (
            reviews.map((r, idx) => (
              <View key={idx} style={styles.reviewItem}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name="person-circle" size={32} color="#aaa" />
                  <View>
                    <View style={{ flexDirection: "row" }}>
                      {Array.from({ length: r.rating || 0 }).map((_, i) => (
                        <Ionicons
                          key={i}
                          name="star"
                          size={16}
                          color="#ffb703"
                        />
                      ))}
                    </View>
                    <Text style={styles.reviewText}>{r.review}</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* ADD REVIEW MODAL */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Beri Rating & Review</Text>

            {/* PICK STAR */}
            <View style={{ flexDirection: "row", marginBottom: 10 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <TouchableOpacity key={i} onPress={() => setRating(i + 1)}>
                  <Ionicons
                    name="star"
                    size={30}
                    color={i < rating ? "#ffb703" : "#ccc"}
                    style={{ marginRight: 6 }}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* INPUT */}
            <TextInput
              style={styles.input}
              placeholder="Tulis ulasanmu..."
              multiline
              value={reviewText}
              onChangeText={setReviewText}
            />

            {/* BUTTONS */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveBtn} onPress={submitReview}>
                <Text style={styles.saveText}>Kirim</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 330,
    backgroundColor: "#ffe8f2",
  },

  heartBtn: {
    position: "absolute",
    right: 20,
    top: 40,
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 8,
    elevation: 6,
  },

  content: {
    padding: 18,
  },

  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ff5f8f",
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  ratingText: {
    marginLeft: 6,
    fontSize: 15,
    color: "#444",
  },

  price: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 8,
    color: "#ff4081",
  },

  sectionTitle: {
    fontWeight: "700",
    fontSize: 16,
    marginTop: 18,
    marginBottom: 6,
    color: "#ff5f8f",
  },

  desc: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },

  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },

  tag: {
    backgroundColor: "#ffe4ef",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 14,
    marginRight: 6,
    marginBottom: 6,
  },

  tagText: {
    fontSize: 13,
    color: "#ff4d79",
  },

  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  addReviewBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff5f8f",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  addReviewText: { color: "#fff", marginLeft: 4, fontWeight: "600" },

  reviewItem: {
    backgroundColor: "#fff0f6",
    padding: 10,
    borderRadius: 12,
    marginTop: 10,
  },

  reviewText: {
    fontSize: 14,
    color: "#444",
    marginTop: 2,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },

  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ff5f8f",
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    height: 90,
    textAlignVertical: "top",
  },

  modalButtons: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cancelBtn: {
    padding: 10,
  },

  cancelText: {
    fontSize: 15,
    color: "#888",
  },

  saveBtn: {
    backgroundColor: "#ff5f8f",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },

  saveText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
