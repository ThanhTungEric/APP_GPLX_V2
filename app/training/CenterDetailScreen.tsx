import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Linking, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

const CenterDetailScreen: React.FC = () => {
    const params = useLocalSearchParams();
    const center = JSON.parse(params.center as string);
    console.log('avt', center)

    const handleOpenWebsite = () => {
        if (center.website) {
            Linking.openURL(center.website).catch((err) =>
                console.error('Failed to open URL:', err)
            );
        }
    };

    return (
        <ScrollView style={styles.container}>
            {/* Hiển thị hình ảnh nếu URL tồn tại */}
            {center.avt ? (
                <View style={styles.imageContainer}>
                    <Image source={{ uri: center.avt }} style={styles.cardImage} />
                </View>
            ) : (
                <Text style={styles.noImageText}>Không có hình ảnh</Text>
            )}

            {/* Tên trung tâm và lượt đánh giá */}
            <View style={styles.nameAndReviews}>
                <Text style={styles.title}>{center.name}</Text>
                <View style={styles.reviewsContainer}>
                    <Text style={styles.reviewsText}>- {center.reviews} đánh giá</Text>
                </View>
            </View>

            {/* Địa chỉ */}
            <View style={styles.row}>
                <MaterialIcons name="location-on" size={16} color="#007AFF" />
                <Text style={styles.rowText}>
                    {center.communeName} - {center.districtName} - {center.provinceName}
                </Text>
            </View>

            {/* Điện thoại */}
            <View style={styles.row}>
                <FontAwesome name="phone" size={16} color="#007AFF" />
                <Text style={styles.rowText}>{center.phone}</Text>
            </View>

            {/* Trang web */}
            <TouchableOpacity style={styles.row} onPress={handleOpenWebsite}>
                <FontAwesome name="globe" size={16} color="#007AFF" />
                <Text style={[styles.rowText, styles.linkText]}>{center.website}</Text>
            </TouchableOpacity>

            {/* Địa chỉ cụ thể */}
            <View style={styles.row}>
                <MaterialIcons name="home" size={16} color="#007AFF" />
                <Text style={styles.rowText}>{center.detailedAddress}</Text>
            </View>

            {/* Giới thiệu */}
            <View style={styles.row}>
                <MaterialIcons name="info" size={16} color="#007AFF" />
                <Text style={styles.rowText}>{center.description}</Text>
            </View>

            {/* Đánh giá của người dùng */}
            <Text style={styles.subtitle}>Đánh giá của người dùng:</Text>
            {center.userReviews.map((review: any, index: number) => (
                <View key={index} style={styles.reviewContainer}>
                    <Text style={styles.reviewUser}>{review.user}</Text>
                    <Text style={styles.reviewComment}>{review.comment}</Text>
                    <View style={styles.row}>
                        <FontAwesome name="star" size={16} color="#FFD700" />
                        <Text style={styles.reviewRating}>{review.rating} sao</Text>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#F8F9FA' },
    imageContainer: { alignItems: 'center', marginBottom: 20 },
    nameAndReviews: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#007AFF' },
    reviewsContainer: { flexDirection: 'row', alignItems: 'center' },
    reviewsText: { fontSize: 14, color: '#333', marginLeft: 5 },
    row: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
    rowText: { fontSize: 14, color: '#333', marginLeft: 10 },
    linkText: { color: 'black', textDecorationLine: 'none', },
    subtitle: { fontSize: 16, fontWeight: 'bold', marginTop: 20, color: '#333' },
    reviewContainer: { marginTop: 10, padding: 10, backgroundColor: '#FFF3E0', borderRadius: 5 },
    reviewUser: { fontSize: 14, fontWeight: 'bold', color: '#333' },
    reviewComment: { fontSize: 14, color: '#666', marginTop: 5 },
    reviewRating: { fontSize: 14, color: '#FFD700', marginLeft: 5 },
    cardImage: { width: 200, height: 200, borderRadius: 8, resizeMode: 'cover' },
    noImageText: { fontSize: 14, color: '#999', textAlign: 'center', marginBottom: 10 },
});

export default CenterDetailScreen;
