import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system";
import * as Location from "expo-location";
import * as MediaLibrary from "expo-media-library";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase, UsahaFoto } from "../lib/supabase";

const { width, height } = Dimensions.get("window");

interface LocationData {
  latitude: number;
  longitude: number;
}

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(
    null
  );
  const [formData, setFormData] = useState({
    nama_penginput: "",
    nama_usaha: "",
  });

  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === "granted");
    } catch (error) {
      console.error("Error requesting location permission:", error);
    }
  };

  const getCurrentLocation = async (): Promise<LocationData | null> => {
    try {
      if (!locationPermission) {
        Alert.alert("Error", "Izin lokasi diperlukan untuk mengambil foto");
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert("Error", "Gagal mendapatkan lokasi");
      return null;
    }
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      setLoading(true);

      // Ambil foto
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      if (!photo?.uri) {
        Alert.alert("Error", "Gagal mengambil foto");
        return;
      }

      // Ambil lokasi
      const location = await getCurrentLocation();
      if (!location) {
        setLoading(false);
        return;
      }

      setCapturedPhoto(photo.uri);
      setCurrentLocation(location);
      setModalVisible(true);
    } catch (error) {
      console.error("Error taking picture:", error);
      Alert.alert("Error", "Gagal mengambil foto");
    } finally {
      setLoading(false);
    }
  };

  const uploadToSupabase = async () => {
    if (!capturedPhoto || !currentLocation) return;

    try {
      setLoading(true);

      // Validasi form
      if (!formData.nama_penginput.trim() || !formData.nama_usaha.trim()) {
        Alert.alert("Error", "Semua field harus diisi");
        setLoading(false);
        return;
      }

      // Buat nama file unik
      const timestamp = new Date().getTime();
      const fileName = `foto_${timestamp}.jpg`;

      // Upload foto ke Supabase Storage menggunakan FileSystem (lebih reliable untuk Android)
      const base64 = await FileSystem.readAsStringAsync(capturedPhoto, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("fotos")
        .upload(fileName, decode(base64), {
          contentType: "image/jpeg",
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        Alert.alert("Error", "Gagal upload foto ke server");
        setLoading(false);
        return;
      }

      // Dapatkan URL publik foto
      const { data: urlData } = supabase.storage
        .from("fotos")
        .getPublicUrl(fileName);

      // Simpan data ke database
      const usahaData: Omit<UsahaFoto, "id"> = {
        nama_penginput: formData.nama_penginput.trim(),
        nama_usaha: formData.nama_usaha.trim(),
        timestamp: new Date().toISOString(),
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        photo_url: urlData.publicUrl,
      };

      const { error: dbError } = await supabase
        .from("usaha_foto")
        .insert([usahaData]);

      if (dbError) {
        console.error("Database error:", dbError);
        Alert.alert("Error", "Gagal menyimpan data ke database");
        setLoading(false);
        return;
      }

      // Simpan foto ke galeri device
      await MediaLibrary.saveToLibraryAsync(capturedPhoto);

      Alert.alert("Sukses", "Foto dan data berhasil disimpan!");
      resetForm();
    } catch (error) {
      console.error("Error uploading to Supabase:", error);
      Alert.alert("Error", "Terjadi kesalahan saat menyimpan data");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setModalVisible(false);
    setCapturedPhoto(null);
    setCurrentLocation(null);
    setFormData({ nama_penginput: "", nama_usaha: "" });
  };

  // Helper function to decode base64
  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Aplikasi memerlukan izin kamera untuk mengambil foto
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Berikan Izin</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        <View style={styles.cameraControls}>
          <TouchableOpacity
            style={styles.flipButton}
            onPress={() =>
              setFacing((current) => (current === "back" ? "front" : "back"))
            }
          >
            <Text style={styles.buttonText}>Flip</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.captureButton,
              loading && styles.captureButtonDisabled,
            ]}
            onPress={takePicture}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.captureButtonText}>📷</Text>
            )}
          </TouchableOpacity>
        </View>
      </CameraView>

      {/* Modal Form Input */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={resetForm}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Data Usaha</Text>

            <Text style={styles.label}>Nama Penginput:</Text>
            <TextInput
              style={styles.input}
              value={formData.nama_penginput}
              onChangeText={(text) =>
                setFormData({ ...formData, nama_penginput: text })
              }
              placeholder="Masukkan nama penginput"
            />

            <Text style={styles.label}>Nama Usaha:</Text>
            <TextInput
              style={styles.input}
              value={formData.nama_usaha}
              onChangeText={(text) =>
                setFormData({ ...formData, nama_usaha: text })
              }
              placeholder="Masukkan nama usaha"
            />

            {currentLocation && (
              <Text style={styles.locationText}>
                📍 Lokasi: {currentLocation.latitude.toFixed(6)},{" "}
                {currentLocation.longitude.toFixed(6)}
              </Text>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={resetForm}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.saveButton,
                  loading && styles.saveButtonDisabled,
                ]}
                onPress={uploadToSupabase}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.saveButtonText}>Simpan</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  message: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    margin: 20,
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    padding: 20,
  },
  flipButton: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    padding: 15,
    borderRadius: 25,
  },
  captureButton: {
    backgroundColor: "white",
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonDisabled: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  captureButtonText: {
    fontSize: 30,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    margin: 20,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: width * 0.9,
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  locationText: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  cancelButtonText: {
    color: "#333",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#007AFF",
  },
  saveButtonDisabled: {
    backgroundColor: "#ccc",
  },
  saveButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
