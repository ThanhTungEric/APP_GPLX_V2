import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getCurrentLicenseId } from './database/history';
import { getLicenseById } from './database/licenses';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type License = {
    id: number;
    name: string;
    description: string;
    totalQuestions: number;
    requiredCorrect: number;
    durationMinutes: number;
};

const TestDetailScreen = () => {
    const router = useRouter();
    const { id, title, licenseName } = useLocalSearchParams();
    const [licenseInfo, setLicenseInfo] = useState<License | null>(null);
    useEffect(() => {
        (async () => {
            const licenseId = await getCurrentLicenseId();
            if (licenseId) {
                const numericId = Number(licenseId);
                const data = await getLicenseById(numericId) as License;
                setLicenseInfo(data);
            }
        })();
    }, []);

    console.log(id, title, licenseName)

    const handleStartTest = () => {
        router.push({
            pathname: '/testscreen/exam',
            params: { id, title, licenseName }
        });
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <MaterialCommunityIcons name="arrow-left" size={28} color="#007AFF" />
                </TouchableOpacity>
            </View>

            {/* Nội dung chính */}
            <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>

                {licenseInfo && (
                    <View style={styles.infoBox}>
                        <Text style={styles.infoText}>
                            Đề thi bằng lái hạng <Text style={styles.bold}>{licenseInfo.name}</Text> gồm{' '}
                            <Text style={styles.bold}>{licenseInfo.totalQuestions} câu hỏi</Text>, thời gian làm bài{' '}
                            <Text style={styles.bold}>{licenseInfo.durationMinutes} phút</Text>.
                        </Text>

                        <Text style={[styles.infoText, { marginTop: 10 }]}>
                            Để vượt qua bài thi, bạn cần trả lời đúng{' '}
                            <Text style={styles.bold}>
                                {licenseInfo.requiredCorrect}/{licenseInfo.totalQuestions}
                            </Text>{' '}
                            câu hỏi và không sai câu <Text style={styles.bold}>điểm liệt</Text> nào.
                        </Text>
                    </View>
                )}

                <TouchableOpacity style={styles.startButton} onPress={handleStartTest}>
                    <Text style={styles.startButtonText}>Bắt Đầu Thi</Text>
                </TouchableOpacity>
            </View>
        </View>

    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
        color: '#333',
    },

    content: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        paddingTop: 30,
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 25,
        textAlign: 'center',
    },

    infoBox: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        width: '100%',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },

    infoText: {
        fontSize: 16,
        color: '#333',
        lineHeight: 22,
    },

    bold: {
        fontWeight: 'bold',
        color: '#000',
    },

    startButton: {
        backgroundColor: '#007AFF',
        marginTop: 30,
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
        elevation: 3,
    },

    startButtonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});


export default TestDetailScreen;
