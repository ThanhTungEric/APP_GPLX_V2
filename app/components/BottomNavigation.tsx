import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter } from "expo-router";
const BottomNavigation = () => {
    const router = useRouter();

    return (
        <View style={styles.bottomNav}>
            <TouchableOpacity style={styles.navButton} onPress={() => router.push("/")}>
                <Icon name="book" size={20} color="#007AFF" />
                <Text style={styles.navText}>Ôn thi GPLX</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={() => router.push("/training/TrainingScreen")}>
                <Icon name="star" size={20} color="#007AFF" />
                <Text style={styles.navText}>Đào tạo lái xe</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={() => router.push("/information")}>
                <Icon name="info-circle" size={20} color="#007AFF" />
                <Text style={styles.navText}>Thông tin</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    bottomNav: { flexDirection: 'row', justifyContent: 'space-around', padding: 15, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#ddd' },
    navButton: { alignItems: 'center' },
    navText: { fontSize: 12, marginTop: 5, color: '#007AFF' },
});
export default BottomNavigation;