// src/screens/HomeScreen.js
import React, { useEffect, useState, useContext, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FavoritesContext } from "../context/FavoritesContext";
import ProductCard from "../components/ProductCard";
import { api, API_URL } from "../api/api"; // backend axios

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const BANNER_WIDTH = Math.min(340, SCREEN_WIDTH - 40);

const BANNER_IMAGES = [
  "https://static.vecteezy.com/system/resources/previews/009/731/074/non_2x/cosmetics-or-skin-care-product-ads-with-bottle-banner-ad-for-beauty-products-leaf-and-sea-background-glittering-light-effect-design-vector.jpg",
  "https://storage.googleapis.com/rxstorage/Brand/Photos/banner_landing_page_brand_skintifict.jpg",
  "https://tse3.mm.bing.net/th/id/OIP.jO2CTAnv2PnoW5QCiCSC4gHaEK?pid=Api&P=0&h=180",
];

export default function HomeScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [bestProducts, setBestProducts] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  const bannerRef = useRef(null);
  const [activeBanner, setActiveBanner] = useState(0);

  // FAVORITES
  const { favorites, addFavorite, removeFavorite } =
    useContext(FavoritesContext);

  useEffect(() => {
    loadHomeData();
  }, []);

  // ============================================================
  //  LOAD ALL DATA FROM BACKEND
  // ============================================================
  async function loadHomeData() {
    setLoading(true);
    try {
      console.log("[HomeScreen] fetching from:", API_URL);

      const [cat, newest, bestseller, rec] = await Promise.all([
        api.get("/api/categories"),
        api.get("/api/products/new", { params: { limit: 10 } }),
        api.get("/api/products/best", { params: { limit: 10 } }),
        api.get("/api/products/recommended", { params: { limit: 10 } }),
      ]);

      setCategories(cat.data?.data || []);
      setNewProducts(newest.data?.data || []);
      setBestProducts(bestseller.data?.data || []);
      setRecommended(rec.data?.data || []);

      console.log("[HomeScreen] loaded successfully");
    } catch (err) {
      console.log("[ERROR HomeScreen]", err?.response?.data || err.message);

      // Reset data supaya tidak error list kosong
      setCategories([]);
      setNewProducts([]);
      setBestProducts([]);
      setRecommended([]);
    } finally {
      setLoading(false);
    }
  }

  // ============================================================
  // BANNER SCROLL EVENT
  // ============================================================
  function onBannerScrollEnd(e) {
    const offset = e.nativeEvent.contentOffset.x || 0;
    const index = Math.round(offset / (BANNER_WIDTH + 14));
    setActiveBanner(index);
  }

  // ============================================================
  // UI RENDERING
  // ============================================================
  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Hi, Hanum</Text>
          <Text style={styles.subWelcome}>Temukan skincare terbaik hari ini</Text>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("Search")}>
          <Ionicons name="search" size={26} color="#444" />
        </TouchableOpacity>
      </View>

      {/* BANNER */}
      <ScrollView
        ref={bannerRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.bannerWrapper}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        onMomentumScrollEnd={onBannerScrollEnd}
      >
        {BANNER_IMAGES.map((img, i) => (
          <View key={i} style={styles.bannerContainer}>
            <Image source={{ uri: img }} style={styles.banner} />
            <View style={styles.bannerTextWrapper}>
              <Text style={styles.bannerText}>Glow Up With Us</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* DOTS */}
      <View style={styles.dotsRow}>
        {BANNER_IMAGES.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, activeBanner === i ? styles.dotActive : styles.dotInactive]}
          />
        ))}
      </View>

      {/* SEARCH BAR */}
      <TouchableOpacity
        style={styles.searchBar}
        onPress={() => navigation.navigate("Search")}
      >
        <Ionicons name="search" size={18} color="#aaa" />
        <Text style={styles.searchText}>Cari produk skincare...</Text>
      </TouchableOpacity>

      {/* PROMO */}
      <Text style={styles.sectionTitle}>Promo Hari Ini</Text>
      <View style={styles.promoCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.promoTitle}>Diskon 30%</Text>
          <Text style={styles.promoDesc}>Untuk semua toner dan serum</Text>
          <TouchableOpacity
            style={styles.promoBtn}
            onPress={() => navigation.navigate("Katalog")}
          >
            <Text style={styles.promoBtnText}>Lihat Promo</Text>
          </TouchableOpacity>
        </View>

        <Image
          source={{
            uri: "https://i.pinimg.com/564x/73/82/20/738220d1df7d3d8b94d64f9f2fab0d7e.jpg",
          }}
          style={styles.promoImg}
        />
      </View>

      {/* CATEGORY */}
      <Text style={styles.sectionTitle}>Kategori</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.length > 0 ? (
          categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.category}
              onPress={() => navigation.navigate("Katalog", { category: cat })}
            >
              <Ionicons name="sparkles-outline" size={16} color="#ff5f8f" />
              <Text style={styles.catText}>{cat.name}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={{ marginLeft: 16, color: "#aaa" }}>Tidak ada kategori</Text>
        )}
      </ScrollView>

      {/* REKOMENDASI */}
      <Text style={styles.sectionTitle}>Rekomendasi Untukmu</Text>
      <FlatList
        horizontal
        data={recommended}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ProductCard product={item} navigation={navigation} />
        )}
        ListEmptyComponent={<Text style={{ marginLeft: 16, color: "#aaa" }}>Tidak ada data</Text>}
        showsHorizontalScrollIndicator={false}
      />

      {/* PRODUK TERBARU */}
      <Text style={styles.sectionTitle}>Produk Terbaru</Text>
      <FlatList
        horizontal
        data={newProducts}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ProductCard product={item} navigation={navigation} />
        )}
        showsHorizontalScrollIndicator={false}
        ListEmptyComponent={<Text style={{ marginLeft: 16, color: "#aaa" }}>Tidak ada data</Text>}
      />

      {/* TERLARIS */}
      <Text style={styles.sectionTitle}>Produk Terlaris</Text>
      <FlatList
        horizontal
        data={bestProducts}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ProductCard product={item} navigation={navigation} />
        )}
        ListEmptyComponent={<Text style={{ marginLeft: 16, color: "#aaa" }}>Tidak ada data</Text>}
        showsHorizontalScrollIndicator={false}
      />

      {/* TIPS */}
      <Text style={styles.sectionTitle}>Glow Tips</Text>
      {[
        "Gunakan sunscreen setiap hari untuk menjaga skin barrier.",
        "Double cleansing penting untuk mengangkat sunscreen & makeup.",
        "Hidrasi kulit menggunakan toner sebelum serum.",
        "Gunakan moisturizer untuk mengunci seluruh skincare.",
        "Exfoliasi maksimal 2x seminggu agar tidak iritasi.",
      ].map((tip, i) => (
        <View key={i} style={styles.tipsBox}>
          <Ionicons name="leaf-outline" size={18} color="#ff5f8f" />
          <Text style={styles.tipText}>{tip}</Text>
        </View>
      ))}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 18,
    paddingTop: 28,
  },

  welcome: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ff5f8f",
  },

  subWelcome: { fontSize: 13, color: "#666", marginTop: 2 },

  // Banner
  bannerWrapper: { marginTop: 6 },
  bannerContainer: { marginRight: 14, width: BANNER_WIDTH },
  banner: {
    width: BANNER_WIDTH,
    height: Math.round((BANNER_WIDTH * 160) / 330),
    borderRadius: 14,
  },
  bannerTextWrapper: {
    position: "absolute",
    bottom: 12,
    left: 12,
    backgroundColor: "rgba(0,0,0,0.35)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  bannerText: { color: "#fff", fontSize: 13, fontWeight: "700" },

  dotsRow: { flexDirection: "row", justifyContent: "center", marginTop: 8 },
  dot: { width: 8, height: 8, borderRadius: 8, marginHorizontal: 4 },
  dotActive: { backgroundColor: "#ff5f8f" },
  dotInactive: { backgroundColor: "#f0cbd8" },

  // Search
  searchBar: {
    backgroundColor: "#ffe4ef",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 12,
    marginTop: 14,
  },
  searchText: { marginLeft: 10, color: "#888" },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ff5f8f",
    marginLeft: 16,
    marginTop: 22,
    marginBottom: 12,
  },

  // Promo
  promoCard: {
    backgroundColor: "#ffe0ed",
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  promoTitle: { fontSize: 18, fontWeight: "700", color: "#ff5f8f" },
  promoDesc: { marginTop: 6, color: "#666" },
  promoImg: { width: 82, height: 82, borderRadius: 12 },

  promoBtn: {
    marginTop: 10,
    backgroundColor: "#ff5f8f",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  promoBtnText: { color: "#fff", fontWeight: "700" },

  // Category
  category: {
    backgroundColor: "#ffd6e9",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 22,
    marginLeft: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  catText: { color: "#ff5f8f", fontWeight: "700" },

  // Tips
  tipsBox: {
    backgroundColor: "#ffeef6",
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  tipText: { color: "#444", fontSize: 14, lineHeight: 20 },
});
