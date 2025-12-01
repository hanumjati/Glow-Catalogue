// src/screens/ProfileScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  // contoh data profil; ganti dengan props / state / data dari API sesuai kebutuhan
  const [profile] = useState({
    name: "Hanum Jati Rahmaningrum",
    email: "hanummm@example.com",
    avatar: "https://blog.pengajartekno.co.id/wp-content/uploads/2023/08/Foto-Kucing-Lucu-31.jpg",
    age: 17,
    gender: "Perempuan",
    phone: "+62 812-3456-7890",
    location: "Jakarta, Indonesia",
  });

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Profil</Text>
      </View>

      {/* PROFILE CARD */}
      <View style={styles.card}>
        <Image source={{ uri: profile.avatar }} style={styles.avatar} />

        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.email}>{profile.email}</Text>

        {/* Informasi singkat (umur, gender, telepon) */}
        <View style={styles.infoRow}>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Umur</Text>
            <Text style={styles.infoValue}>{profile.age} th</Text>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Gender</Text>
            <Text style={styles.infoValue}>{profile.gender}</Text>
          </View>
        </View>

        <View style={[styles.infoRow, { marginTop: 8 }]}>
          <View style={[styles.infoBlock, { flex: 1 }]}>
            <Text style={styles.infoLabel}>Telepon</Text>
            <Text style={styles.infoValue}>{profile.phone}</Text>
          </View>

          <View style={[styles.infoBlock, { flex: 1 }]}>
            <Text style={styles.infoLabel}>Lokasi</Text>
            <Text style={styles.infoValue}>{profile.location}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.editBtn}>
          <Ionicons name="create-outline" size={18} color="#fff" />
          <Text style={styles.editText}>Edit Profil</Text>
        </TouchableOpacity>
      </View>

      {/* SETTINGS / ACTIONS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Akun & Lainnya</Text>

        {/* contoh action lain yang tersisa (Logout tetap ada) */}
        <TouchableOpacity style={styles.row}>
          <Ionicons name="shield-checkmark-outline" size={22} color="#ff5f8f" />
          <Text style={styles.rowText}>Keamanan Akun</Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color="#bbb"
            style={{ marginLeft: "auto" }}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <Ionicons name="information-circle-outline" size={22} color="#ff5f8f" />
          <Text style={styles.rowText}>Bantuan & FAQ</Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color="#bbb"
            style={{ marginLeft: "auto" }}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <Ionicons name="log-out-outline" size={22} color="#ff5f8f" />
          <Text style={[styles.rowText, { color: "#ff5f8f" }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    paddingTop: 50,
    paddingBottom: 18,
    alignItems: "center",
    backgroundColor: "#ff8fbf",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  headerText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },

  card: {
    marginTop: -40,
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 20,
    alignItems: "center",

    elevation: 5,
    shadowColor: "#ff8fbf",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  avatar: {
    width: 95,
    height: 95,
    borderRadius: 50,
    marginBottom: 10,
  },

  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ff5f8f",
  },

  email: {
    fontSize: 14,
    color: "#999",
    marginBottom: 10,
  },

  // info area
  infoRow: {
    flexDirection: "row",
    width: "85%",
    justifyContent: "space-between",
    marginTop: 6,
  },

  infoBlock: {
    alignItems: "flex-start",
  },

  infoLabel: {
    fontSize: 12,
    color: "#aaa",
  },

  infoValue: {
    fontSize: 14,
    color: "#444",
    fontWeight: "600",
  },

  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff5f8f",
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
  },

  editText: { marginLeft: 6, color: "#fff", fontWeight: "600" },

  section: {
    marginTop: 25,
    marginHorizontal: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ff5f8f",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  rowText: {
    fontSize: 15,
    marginLeft: 14,
    color: "#444",
  },
});
