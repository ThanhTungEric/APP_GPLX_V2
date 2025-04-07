import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Switch, StyleSheet, ScrollView, Animated } from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { setGradingMode, getGradingMode, getCurrentLicense } from "./database/history";
import { resetDatabase } from "./database/database";
const SettingsScreen = () => {
    const router = useRouter();
    const [isVibrationEnabled, setVibrationEnabled] = useState(true);
    const [selectedMode, setSelectedMode] = useState("after_submit");
    const [selectedTheme, setSelectedTheme] = useState("Tự động");
    const [currentLicenseName, setCurrentLicenseName] = useState<string | null>(null);
    useEffect(() => {
        const fetchCurrentLicense = async () => {
            try {
                const licenseName = await getCurrentLicense();
                setCurrentLicenseName(licenseName)
            } catch (error) {
                console.error("Error fetching current license:", error);
            }
        };

        fetchCurrentLicense();
    }, []);
    const themes = ["Tự động", "Sáng", "Tối"];
    const translateX = useRef(new Animated.Value(0)).current;

    const handleThemeChange = (themeIndex: number) => {
        setSelectedTheme(themes[themeIndex]);

        Animated.timing(translateX, {
            toValue: themeIndex * 100,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    // Save grading mode to database
    setGradingMode(selectedMode);

    // Reset database
    const handleResetDatabase = async () => {
        await resetDatabase();
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push('/')}>
                    <MaterialCommunityIcons name="close" size={30} color="#007AFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Cài đặt</Text>
                <View style={styles.iconPlaceholder} />
            </View>

            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <Text style={styles.sectionTitle}>LOẠI GPLX - BẰNG LÁI</Text>
                    <TouchableOpacity style={styles.settingItem} onPress={() => router.push("/select-gplx")}>
                        <Text>GPLX</Text>
                        <Text style={styles.option}>{currentLicenseName}</Text>
                    </TouchableOpacity>

                    <Text style={styles.sectionTitle}>CHẾ ĐỘ CHẤM ĐIỂM BÀI THI</Text>
                    <View style={styles.radioContainer}>
                        {["Sau khi nộp bài", "Sau mỗi câu hỏi"].map((mode, index) => (
                            <TouchableOpacity
                                key={mode}
                                style={[styles.radioItem, index === 0 && styles.radioItemTop]}
                                onPress={() => setSelectedMode(mode)}
                            >
                                <Text style={styles.radioText}>{mode}</Text>
                                {selectedMode === mode && <MaterialCommunityIcons name="check" size={20} color="#007AFF" />}
                            </TouchableOpacity>
                        ))}
                    </View>


                    {/* Giao diện */}
                    <Text style={styles.sectionTitle}>GIAO DIỆN</Text>
                    <View style={styles.themeSelector}>
                        <Animated.View style={[styles.selectedTheme, { transform: [{ translateX }] }]} />
                        {themes.map((theme, index) => (
                            <TouchableOpacity key={theme} style={styles.themeOption} onPress={() => handleThemeChange(index)}>
                                <Text style={[styles.themeText, selectedTheme === theme && styles.selectedThemeText]}>{theme}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.sectionTitle}>RUNG PHẢN HỒI</Text>
                    <View style={styles.settingItem}>
                        <Text style={styles.versionTest}>Rung phản hồi</Text>
                        <Switch value={isVibrationEnabled} onValueChange={() => setVibrationEnabled(!isVibrationEnabled)} />
                    </View>

                    <Text style={styles.sectionTitle}>DỮ LIỆU</Text>
                    <TouchableOpacity style={styles.deleteButton} onPress={handleResetDatabase}>
                        <Icon name="trash" size={20} color="#fff" />
                        <Text style={styles.deleteText}>Xóa dữ liệu lịch sử</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

// Styles
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F8F9FA" },
    header: { flexDirection: "row", alignItems: "center", padding: 15, backgroundColor: "#fff" },
    iconPlaceholder: { width: 30 },
    headerTitle: { fontSize: 18, fontWeight: "bold", flex: 1, textAlign: "center" },
    scrollContainer: { flex: 1 },
    content: { padding: 15 },
    sectionTitle: { fontSize: 14, fontWeight: "bold", color: "#888", marginTop: 20 },
    versionTest: { fontSize: 16 },
    settingItem: { flexDirection: "row", justifyContent: "space-between", alignItems: 'center', padding: 15, backgroundColor: "#fff", borderRadius: 10, marginTop: 10 },
    option: { color: "#007AFF", fontSize: 15 },
    radioContainer: { backgroundColor: "#fff", borderRadius: 10, marginTop: 10, paddingHorizontal: 5 },
    radioItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 15, paddingHorizontal: 20 },
    radioItemTop: { borderBottomWidth: 1, borderBottomColor: "#E5E5E5" },
    radioText: { fontSize: 16, color: "#000" },
    deleteButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#FF3D00", padding: 15, borderRadius: 10, marginTop: 20, justifyContent: "center" },
    deleteText: { color: "#fff", fontWeight: "bold", marginLeft: 10 },
    themeSelector: { flexDirection: "row", backgroundColor: "#E5E5E5", borderRadius: 10, overflow: "hidden", marginTop: 10, width: 304, height: 40, position: "relative" },
    themeOption: { flex: 1, justifyContent: "center", alignItems: "center", zIndex: 2 },
    selectedTheme: { position: "absolute", width: 100, height: "90%", backgroundColor: "#FFFFFF", borderRadius: 10, margin: 2 },
    themeText: { fontSize: 16, color: "#000" },
    selectedThemeText: { fontWeight: "bold", color: "#000" },
    leftRounded: { borderTopLeftRadius: 10, borderBottomLeftRadius: 10 },
    rightRounded: { borderTopRightRadius: 10, borderBottomRightRadius: 10 }
});

export default SettingsScreen;
