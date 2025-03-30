import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';

const TestDetailScreen = () => {
    const router = useRouter();
    const { id, title, description } = useLocalSearchParams();
    console.log(id, title, description)

    const handleStartTest = () => {
        router.push({
            pathname: '/testscreen/exam',
            params: { id, title }
        });
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Icon name="arrow-left" size={22} color="#007AFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chi Tiết Bộ Đề</Text>
            </View>

            {/* Content */}
            <View style={styles.content}>
                <Text style={styles.title}>Bộ Đề: {title}</Text>
                <Text style={styles.description}>{description}</Text>
                <TouchableOpacity style={styles.startButton} onPress={handleStartTest}>
                    <Text style={styles.startButtonText}>Bắt Đầu Thi</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#fff' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
    content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
    description: { fontSize: 16, color: '#333', textAlign: 'center', marginBottom: 20 },
    startButton: { backgroundColor: '#007AFF', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, },
    startButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default TestDetailScreen;
