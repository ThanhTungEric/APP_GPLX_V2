import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { License, getAllLicenses } from "../database/licenses"; // Adjust based on your database structure
import { setLicense, getCurrentLicense } from "../database/history"; // Adjust based on your database structure
import { updateDataFromAPI } from "../database/database"; // Adjust based on your database structure
import { getTotalQuestionsByLicense } from "../database/questions"; // Adjust based on your database structure

const SelectGPLXScreen = () => {
  const router = useRouter();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [selectedGPLX, setSelectedGPLX] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // State for loading
  const [error, setError] = useState<string | null>(null); // State for error

  useEffect(() => {
    const loadData = async () => {
      try {
        const allLicenses = await getAllLicenses();
        const validLicenses: License[] = [];
  
        for (const license of allLicenses) {
          const count = await getTotalQuestionsByLicense(license.id);
          if (count > 1) {
            validLicenses.push(license);
          }
        }
  
        setLicenses(validLicenses);
  
        const currentLicense = await getCurrentLicense();
        if (currentLicense) {
          setSelectedGPLX(currentLicense);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
  
    loadData();
  }, []);
  

  const [submitting, setSubmitting] = useState(false);

  const handleSelectGPLX = async (licenseName: string) => {
    setSubmitting(true);
    try {
      setSelectedGPLX(licenseName);
      await setLicense(licenseName);
      await updateDataFromAPI();
      router.replace("/");
    } catch (error) {
      console.error("Lỗi khi chọn GPLX:", error);
    } finally {
      setSubmitting(false);
    }
  };
  
  if (submitting) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Đang tải dữ liệu GPLX...</Text>
      </View>
    );
  }
  

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/settings')}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chọn loại GPLX</Text>
      </View>

      {/* Danh sách GPLX từ SQLite */}
      <FlatList
        data={licenses}
        keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()} // Ensure a valid key
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => handleSelectGPLX(item.name)}  // Gọi hàm khi chọn GPLX
          >
            <View>
              <Text style={styles.optionTitle}>{item.name}</Text>
              <Text style={styles.optionDesc}>{item.description}</Text>
            </View>
            {selectedGPLX === item.name && (
              <MaterialCommunityIcons name="check" size={24} color="green" />
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: "row", alignItems: "center", padding: 15, backgroundColor: "#fff" },
  headerTitle: { flex: 1, textAlign: "center", fontSize: 20, fontWeight: "bold" },
  optionItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 15, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#E5E5E5" },
  optionTitle: { fontSize: 16, fontWeight: "bold" },
  optionDesc: { fontSize: 14, color: "#666" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});

export default SelectGPLXScreen;
