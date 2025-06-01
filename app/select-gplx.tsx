import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { License, getAllLicenses } from "../database/licenses";
import { setLicense, getCurrentLicense } from "../database/history";
import { updateDataFromAPI } from "../database/database";
import { getTotalQuestionsByLicense } from "../database/questions";

const SelectGPLXScreen = () => {
  const router = useRouter();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [selectedGPLX, setSelectedGPLX] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState<boolean>(true);

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

        if (validLicenses.length === 0) {
          setError("Không có loại GPLX khả dụng. Vui lòng thử lại sau.");
          return;
        }

        setLicenses(validLicenses);

        const currentLicense = await getCurrentLicense();
        if (currentLicense) {
          setSelectedGPLX(currentLicense);
        }
      } catch (err) {
        console.error(err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setIsBusy(false);
      }
    };

    loadData();
  }, []);

  const handleSelectGPLX = async (licenseName: string) => {
    setIsBusy(true);
    try {
      setSelectedGPLX(licenseName);
      await setLicense(licenseName);
      await updateDataFromAPI();
      router.replace("/");
    } catch (error) {
      console.error("❌ Lỗi khi chọn GPLX:", error);
      setError("Có lỗi xảy ra khi chọn GPLX.");
    } finally {
      setIsBusy(false);
    }
  };

  if (isBusy) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Đang xử lý dữ liệu...</Text>
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/settings")}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chọn loại GPLX</Text>
      </View>

      <FlatList
        data={licenses}
        keyExtractor={(item) => item.id.toString()}
        initialNumToRender={5}
        extraData={selectedGPLX}
        renderItem={({ item }) => {
          const isSelected = selectedGPLX === item.name;
          return (
            <TouchableOpacity
              style={[styles.optionItem, isSelected && styles.optionItemSelected]}
              onPress={() => handleSelectGPLX(item.name)}
            >
              <View>
                <Text style={[styles.optionTitle, isSelected && styles.optionTitleSelected]}>
                  {item.name}
                </Text>
                <Text style={styles.optionDesc}>{item.description}</Text>
              </View>
              {isSelected && (
                <MaterialCommunityIcons name="check" size={24} color="green" />
              )}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  optionItemSelected: {
    backgroundColor: "#E6F0FF",
  },
  optionTitle: { fontSize: 16, fontWeight: "bold", color: "#000" },
  optionTitleSelected: { color: "#007AFF" },
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
    textAlign: "center",
  },
});

export default SelectGPLXScreen;
