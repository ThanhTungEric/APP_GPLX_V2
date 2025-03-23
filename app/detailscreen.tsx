import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';

const DetailScreen = () => {
    const router = useRouter();
    const { id, image, text, title } = useLocalSearchParams();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Icon name="arrow-left" size={22} color="#007AFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Biển Báo</Text>
            </View>

            {/* Scrollable Content */}
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {typeof image === 'string' && <Image source={{ uri: image }} style={styles.image} />}
                <Text style={styles.title}>{id}</Text>
                <Text style={styles.title}>{title}</Text>

                <Text style={styles.description}>{text}</Text>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#fff' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
    scrollContent: { padding: 20, alignItems: 'center' }, // Đảm bảo căn giữa nhưng vẫn có thể cuộn
    image: { width: 200, height: 200, borderRadius: 8, marginBottom: 20 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
    description: { fontSize: 16, color: '#333', textAlign: 'center' }
});

export default DetailScreen;
