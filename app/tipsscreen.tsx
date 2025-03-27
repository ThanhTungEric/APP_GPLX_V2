import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter } from 'expo-router';

const TipsScreen = () => {
    const router = useRouter();

    const tips = [
        { title: "Đọc kỹ câu hỏi", content: "Đọc kỹ câu hỏi trước khi trả lời." },
        { title: "Chú ý từ khóa", content: "Chú ý các từ khóa như 'không', 'luôn luôn', 'không bao giờ'." },
        { title: "Ưu tiên an toàn", content: "Ưu tiên các quy tắc an toàn khi lái xe." },
        { title: "Học biển báo", content: "Học thuộc các biển báo giao thông quan trọng." },
        { title: "Thực hành thi thử", content: "Thực hành các bài thi thử để làm quen với cấu trúc đề thi." },
    ];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Icon name="arrow-left" size={22} color="#007AFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mẹo Lý Thuyết</Text>
                <View style={{ width: 22 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {tips.map((tip, index) => (
                    <View key={index} style={styles.tipContainer}>
                        <Text style={styles.tipTitle}>{`${index + 1}. ${tip.title}`}</Text>
                        <View style={styles.tipCard}>
                            <Text style={styles.tipContent}>{tip.content}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA', padding: 15 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, marginBottom: 10 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    scrollContainer: { paddingBottom: 20 },
    tipContainer: { marginBottom: 20 },
    tipTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#007AFF' },
    tipCard: { backgroundColor: '#fff', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#007AFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 1 },
    tipContent: { fontSize: 16, color: '#333' },
});

export default TipsScreen;
