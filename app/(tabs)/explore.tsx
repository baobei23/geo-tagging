import { supabase, UsahaFoto } from "@/lib/supabase";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Linking,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ExploreScreen() {
  const [data, setData] = useState<UsahaFoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: photos, error } = await supabase
        .from("usaha_foto")
        .select("*")
        .order("timestamp", { ascending: false });

      if (error) {
        console.error("Error fetching data:", error);
        Alert.alert("Error", "Gagal memuat data foto");
        return;
      }

      setData(photos || []);
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Terjadi kesalahan saat memuat data");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const openMap = (latitude: number, longitude: number) => {
    const url = `https://maps.google.com/maps?q=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  const renderItem = ({ item }: { item: UsahaFoto }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.photo_url }} style={styles.photo} />

      <View style={styles.cardContent}>
        <Text style={styles.businessName}>{item.nama_usaha}</Text>
        <Text style={styles.inputterName}>Oleh: {item.nama_penginput}</Text>

        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>

        <TouchableOpacity
          style={styles.locationButton}
          onPress={() => openMap(item.latitude, item.longitude)}
        >
          <Text style={styles.locationText}>
            📍 {item.latitude.toFixed(6)}, {item.longitude.toFixed(6)}
          </Text>
          <Text style={styles.mapLink}>Buka di Maps</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Memuat data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📸 Daftar Foto Usaha</Text>

      {data.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Belum ada foto yang diupload</Text>
          <Text style={styles.emptySubtext}>
            Gunakan tab Kamera untuk mengambil foto pertama
          </Text>
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id || ""}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  listContainer: {
    padding: 15,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  photo: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: "#e0e0e0",
  },
  cardContent: {
    padding: 15,
  },
  businessName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  inputterName: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
    marginBottom: 10,
  },
  locationButton: {
    backgroundColor: "#f0f9ff",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0f2fe",
  },
  locationText: {
    fontSize: 12,
    color: "#0369a1",
    marginBottom: 2,
  },
  mapLink: {
    fontSize: 14,
    color: "#0284c7",
    fontWeight: "600",
  },
});
