import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {getVersion} from '../database/database';
const InformationScreen = () => {
  const router = useRouter();
  const [appVersion, setAppVersion] = useState<string>('');

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const version = await getVersion();
        setAppVersion(version?.version || '');
      } catch (error) {
        console.error("Error fetching app version:", error);
      }
    };

    fetchVersion();
  }, []);


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="chevron-left" size={30} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông tin</Text>
        <TouchableOpacity>
          <MaterialCommunityIcons name="bell-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* ScrollView cho phép cuộn */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Phiên bản Pro */}
        {/* <View style={styles.proBanner}>
          <Text style={styles.proText}>Phiên bản Pro</Text>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>Giảm 30%</Text>
          </View>
          <Text style={styles.proDescription}>Loại bỏ quảng cáo, hỗ trợ OTOMOTO</Text>
          <TouchableOpacity style={styles.upgradeButton}>
            <Text style={styles.upgradeText}>NÂNG CẤP</Text>
          </TouchableOpacity>
        </View> */}

        {/* Danh sách chức năng */}
        {/* <View style={styles.menuContainer}>
          {[
            { icon: "shield", label: "Tra cứu phạt nguội", subLabel: "Nguồn từ Bộ Công an, Cục CSGT" },
            { icon: "list-ol", label: "3 bước ôn thi hiệu quả", subLabel: "Kinh nghiệm để có kết quả ôn thi tốt" },
            { icon: "question-circle", label: "Vì sao bạn thấy quảng cáo?", subLabel: "" },
            { icon: "paper-plane", label: "Link tải ứng dụng", subLabel: "" },
            { icon: "comment", label: "Báo lỗi, gửi góp ý", subLabel: "" },
            { icon: "facebook", label: "Nhóm hỏi đáp Facebook", subLabel: "" },
            { icon: "envelope", label: "Liên hệ hỗ trợ", subLabel: "" },
            { icon: "file-text", label: "Điều khoản sử dụng", subLabel: "" },
            { icon: "shield", label: "Chính sách riêng tư", subLabel: "" },
            { icon: "user", label: "Đăng nhập", subLabel: "" },
          ].map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <View style={styles.iconContainer}>
                <Icon name={item.icon} size={20} color="#007AFF" />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                {item.subLabel !== "" && <Text style={styles.menuSubLabel}>{item.subLabel}</Text>}
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#C4C4C4" />
            </TouchableOpacity>
          ))}
        </View> */}

        {/* Phiên bản ứng dụng */}
        <Text style={styles.versionText}>PHIÊN BẢN {appVersion || 'Đang tải...'}</Text>
      </ScrollView>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: { flexDirection: "row", alignItems: "center", padding: 15, backgroundColor: "#fff" },
  headerTitle: { fontSize: 18, fontWeight: "bold", flex: 1, textAlign: "center" },
  proBanner: { backgroundColor: "#007AFF", borderRadius: 10, margin: 10, padding: 15, alignItems: "center" },
  proText: { fontSize: 16, fontWeight: "bold", color: "#fff" },
  discountBadge: { backgroundColor: "#FF3D00", borderRadius: 5, paddingHorizontal: 8, paddingVertical: 2, marginTop: 5 },
  discountText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  proDescription: { color: "#fff", marginTop: 5 },
  upgradeButton: { marginTop: 10, backgroundColor: "#fff", paddingVertical: 8, paddingHorizontal: 20, borderRadius: 5 },
  upgradeText: { color: "#007AFF", fontWeight: "bold" },
  menuContainer: { backgroundColor: "#fff", borderRadius: 10, margin: 10, padding: 5 },
  menuItem: { flexDirection: "row", alignItems: "center", padding: 15, borderBottomWidth: 1, borderBottomColor: "#E5E5E5" },
  iconContainer: { width: 30, justifyContent: "center", alignItems: "center" },
  menuTextContainer: { flex: 1 },
  menuLabel: { fontSize: 16, fontWeight: "bold" },
  menuSubLabel: { fontSize: 14, color: "#888" },
  versionText: { textAlign: "center", color: "#888", marginTop: 20, fontSize: 14 },
});

export default InformationScreen;
