import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome cho biểu tượng sao
import { useRouter } from 'expo-router';

interface DrivingCenter {
    id: number;
    name: string;
    communeName: string;
    districtName: string;
    provinceName: string;
    rating: number;
}

interface DrivingCentersProps {
    centers: DrivingCenter[];
}

const DrivingCenters: React.FC<DrivingCentersProps> = ({ centers }) => {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Danh Sách Trung Tâm Dạy Lái Xe</Text>
            {centers.length > 0 ? (
                <FlatList
                    data={centers}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.centerItem}>
                            <View>
                                <Text
                                    style={styles.centerName}
                                    onPress={() =>
                                        router.push({
                                            pathname: '/training/CenterDetailScreen',
                                            params: { center: JSON.stringify(item) },
                                        })
                                    }
                                >
                                    {item.name}
                                </Text>
                                <Text style={styles.centerLocation}>
                                    {item.communeName}, {item.districtName}, {item.provinceName}
                                </Text>
                            </View>

                            <View style={styles.ratingContainer}>
                                <FontAwesome name="star" size={16} color="#FFD700" />
                                <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                            </View>
                        </View>
                    )}
                />
            ) : (
                <Text style={styles.noDataText}>Không có trung tâm nào được tìm thấy.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginTop: 20, padding: 15, borderRadius: 8 },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#FF6F00', textAlign: 'center' },
    centerItem: { marginBottom: 10, backgroundColor: '#FFF3E0', padding: 20, borderRadius: 5, flexDirection: 'row', justifyContent: 'space-between' },
    centerName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    centerLocation: { fontSize: 14, color: '#666' },
    ratingContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
    ratingText: { fontSize: 14, color: '#666', marginLeft: 5 },
    noDataText: { fontSize: 14, color: '#999', textAlign: 'center' },
});

export default DrivingCenters;
