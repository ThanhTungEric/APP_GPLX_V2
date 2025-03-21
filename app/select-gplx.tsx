import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const gplxOptions = [
    { category: "MÔ TÔ (2025)", options: [{ name: "A1", desc: "Mô tô 2 bánh dung tích xi-lanh từ 50 - 125 cm3" }, { name: "A", desc: "Mô tô 2 bánh dung tích xi-lanh trên 125 cm3" }, { name: "B1", desc: "Mô tô ba bánh, xe lam, xích lô máy" }] },
    { category: "Ô TÔ (2025)", options: [{ name: "B", desc: "Ô tô chở người đến 8 chỗ ngồi (không kể chỗ tài xế)" }, { name: "C1", desc: "Ô tô tải có khối lượng toàn bộ trên 3.500kg đến 7.500kg" }, { name: "C", desc: "Ô tô tải có khối lượng toàn bộ trên 7.500kg" }] },
    { category: "Ô TÔ KHÁCH VÀ RƠ-MÓOC (2025)", options: [{ name: "D1", desc: "Ô tô chở người trên 8 đến 16 chỗ (không kể chỗ tài xế)" }, { name: "D2", desc: "Ô tô chở người trên 16 đến 29 chỗ (không kể chỗ tài xế)" }, { name: "D", desc: "Ô tô chở người trên 29 chỗ (không kể chỗ tài xế)" }, { name: "Rơ Moóc", desc: "Các loại GPLX: BE, C1E, CE, D1E, D2E, DE" }] },
];

const SelectGPLXScreen = () => {
    const router = useRouter();
    const [selectedGPLX, setSelectedGPLX] = useState("C1");

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#007AFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chọn loại GPLX</Text>
            </View>

            {/* Danh sách GPLX */}
            <FlatList
                data={gplxOptions}
                keyExtractor={(item) => item.category}
                renderItem={({ item }) => (
                    <View>
                        <Text style={styles.categoryTitle}>{item.category}</Text>
                        {item.options.map((option) => (
                            <TouchableOpacity
                                key={option.name}
                                style={styles.optionItem}
                                onPress={() => setSelectedGPLX(option.name)}
                            >
                                <View>
                                    <Text style={styles.optionTitle}>{option.name}</Text>
                                    <Text style={styles.optionDesc}>{option.desc}</Text>
                                </View>
                                {selectedGPLX === option.name && (
                                    <MaterialCommunityIcons name="check" size={24} color="green" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            />

            {/* Nút hoàn tất */}
            <TouchableOpacity style={styles.doneButton} onPress={() => router.back()}>
                <Text style={styles.doneText}>HOÀN TẤT</Text>
            </TouchableOpacity>
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
