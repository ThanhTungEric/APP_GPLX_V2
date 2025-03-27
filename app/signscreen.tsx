import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter } from "expo-router";

const SignScreen = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(0);

    const tabs = [
        "Biển Báo Cấm",
        "Biển Báo Nguy Hiểm",
        "Biển Báo Hiệu Lệnh",
        "Biển Báo Chỉ Dẫn",
        "Biển Báo Phụ",
        "Vạch Kẻ Đường",
        "Biển Báo Tốc Độ"
    ];

    const tabContent = [
        [
            {
                id: 1,
                title: "Cấm đi ngược chiều",
                image: "https://png.pngtree.com/png-clipart/20240105/original/pngtree-traffic-stop-sign-symbol-photo-png-image_14019657.png",
                text: "Biển báo cấm các phương tiện đi vào theo hướng ngược chiều, thường đặt ở đầu đường một chiều."
            },
            { id: 2, title: "Biển báo cấm 2", image: "https://png.pngtree.com/png-clipart/20240105/original/pngtree-traffic-stop-sign-symbol-photo-png-image_14019657.png", text: "Biển báo cấm 2" },
            { id: 3, title: "Biển báo cấm 2", image: "https://png.pngtree.com/png-clipart/20240105/original/pngtree-traffic-stop-sign-symbol-photo-png-image_14019657.png", text: "Biển báo cấm 2" },
            { id: 4, title: "Biển báo cấm 2", image: "https://png.pngtree.com/png-clipart/20240105/original/pngtree-traffic-stop-sign-symbol-photo-png-image_14019657.png", text: "Biển báo cấm 2" },
            { id: 5, title: "Biển báo cấm 2", image: "https://png.pngtree.com/png-clipart/20240105/original/pngtree-traffic-stop-sign-symbol-photo-png-image_14019657.png", text: "Biển báo cấm 2" },
            { id: 6, title: "Biển báo cấm 2", image: "https://png.pngtree.com/png-clipart/20240105/original/pngtree-traffic-stop-sign-symbol-photo-png-image_14019657.png", text: "Biển báo cấm 2" },
            { id: 7, title: "Biển báo cấm 2", image: "https://png.pngtree.com/png-clipart/20240105/original/pngtree-traffic-stop-sign-symbol-photo-png-image_14019657.png", text: "Biển báo cấm 2" },
            { id: 8, title: "Biển báo cấm 2", image: "https://png.pngtree.com/png-clipart/20240105/original/pngtree-traffic-stop-sign-symbol-photo-png-image_14019657.png", text: "Biển báo cấm 2" },
            { id: 9, title: "Biển báo cấm 2", image: "https://png.pngtree.com/png-clipart/20240105/original/pngtree-traffic-stop-sign-symbol-photo-png-image_14019657.png", text: "Biển báo cấm 2" },

        ],
        [
            {
                id: 1,
                title: "Cấm đi ngược chiều",
                image: "https://png.pngtree.com/png-clipart/20240105/original/pngtree-traffic-stop-sign-symbol-photo-png-image_14019657.png",
                text: "Biển báo cấm các phương tiện đi vào theo hướng ngược chiều, thường đặt ở đầu đường một chiều."
            },
            { id: 2, title: "Biển báo cấm 2", image: "https://png.pngtree.com/png-clipart/20240105/original/pngtree-traffic-stop-sign-symbol-photo-png-image_14019657.png", text: "Biển báo cấm 2" }
        ],

        [], // Placeholder for "Biển Báo Hiệu Lệnh"
        [], // Placeholder for "Biển Báo Chỉ Dẫn"
        [], // Placeholder for "Biển Báo Phụ"
        [], // Placeholder for "Vạch Kẻ Đường"
        [], // Placeholder for "Biển Báo Tốc Độ"
    ];

    const handleCardPress = (item: { id: number; image: string; text: string, title: string }) => {
        router.push({
            pathname: '/detailscreen',
            params: { id: item.id, image: item.image, text: item.text, title: item.title }
        });
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <Header router={router} />

            {/* Tabs */}
            <ScrollView showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabContainer}>
                {tabs.map((tab, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.tabButton, activeTab === index && styles.activeTabButton]}
                        onPress={() => setActiveTab(index)}
                    >
                        <Text style={[styles.tabText, activeTab === index && styles.activeTabText]}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Tab Content */}
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {tabContent[activeTab]?.map((item, index) => (
                    <TouchableOpacity key={index} style={styles.card} onPress={() => handleCardPress(item)}>
                        <View>
                            <Image source={{ uri: item.image }} style={styles.cardImage} />
                        </View>
                        <View>
                            <Text style={styles.cardId}>{item.id}</Text>
                            <Text style={styles.cardTitle}>{item.title}</Text>
                            <Text style={styles.cardText}>
                                {item.title ? (item.text.length > 25 ? item.text.substring(0, 25) + "..." : item.text) : "Không có tiêu đề"}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
                {tabContent[activeTab]?.length === 0 && (
                    <Text style={styles.emptyMessage}>Không có nội dung cho tab này.</Text>
                )}
            </ScrollView>
        </View>
    );
};

// Header Component
const Header = ({ router }: { router: ReturnType<typeof useRouter> }) => (
    <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/')}>
            <Icon name="arrow-left" size={22} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Biển Báo Giao Thông</Text>
    </View>
);

// Styles
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#fff' },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    tabContainer: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#fff', paddingVertical: 10 },
    tabButton: { padding: 10, borderBottomWidth: 2, borderBottomColor: 'transparent' },
    activeTabButton: { borderBottomColor: '#007AFF' },
    tabText: { fontSize: 14, color: '#000' },
    activeTabText: { fontWeight: 'bold', color: '#007AFF' },
    scrollContainer: { flexGrow: 1, padding: 15 },
    tabContent: { fontSize: 16, color: '#333', textAlign: 'center' },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        flexDirection: 'row',
        alignItems: 'center',
        display: 'flex'
    },
    cardImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginRight: 10,
        resizeMode: 'cover'
    },
    cardId: {
        fontSize: 14,
        color: '#333',
        textAlign: 'left'
    },
    cardText: {
        fontSize: 14,
        color: '#333',
        textAlign: 'left'
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'left'
    },
    cardContent: {
        fontSize: 14,
        color: '#333',
        textAlign: 'left'
    },
    emptyMessage: { textAlign: 'center', color: '#666', marginTop: 20 }
});

export default SignScreen;
