import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { License, getAllLicenses } from "./database/licenses";
import { setLicense, getCurrentLicense } from "./database/history";

const SelectGPLXScreen = () => {
  const router = useRouter();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [selectedGPLX, setSelectedGPLX] = useState<string | null>(null);

  // Load all licenses and current selected license
  useEffect(() => {
    (async () => {
      const data = await getAllLicenses();
      setLicenses(data);
      const currentLicense = await getCurrentLicense();
      console.log(currentLicense);
      if (currentLicense) {
        setSelectedGPLX(currentLicense);
      }
    })();
  }, []);

  const handleSelectGPLX = (licenseName: string) => {
    setSelectedGPLX(licenseName);
    setLicense(licenseName);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chọn loại GPLX</Text>
      </View>

      {/* Danh sách GPLX từ SQLite */}
      <FlatList
        data={licenses}
        keyExtractor={(item) => item.id.toString()}
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
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: { flexDirection: "row", alignItems: "center", padding: 15, backgroundColor: "#fff" },
  headerTitle: { flex: 1, textAlign: "center", fontSize: 20, fontWeight: "bold" },
  categoryTitle: { fontSize: 14, fontWeight: "bold", color: "#888", paddingHorizontal: 15, marginTop: 20 },
  optionItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 15, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#E5E5E5" },
  optionTitle: { fontSize: 16, fontWeight: "bold" },
  optionDesc: { fontSize: 14, color: "#666" },
  doneButton: { backgroundColor: "#007AFF", padding: 15, alignItems: "center", margin: 15, borderRadius: 10 },
  doneText: { fontSize: 16, color: "#fff", fontWeight: "bold" },
});

export default SelectGPLXScreen;
