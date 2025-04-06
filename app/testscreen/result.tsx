import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { saveQuizHistory } from '../database/quizesshistory';
import { getLicenseById } from '../database/licenses';
import { getCurrentLicenseId } from '../database/history';

type License = {
    id: number;
    name: string;
    description: string;
    totalQuestions: number;
    requiredCorrect: number;
    durationMinutes: number;
};

const ResultScreen = () => {
    const router = useRouter();
    const { rawData, totalQuestions: totalQuestionsRaw, testName, id: quizIdRaw, licenseName } = useLocalSearchParams();
    const totalQuestions = Number(totalQuestionsRaw) || 0;
    const quizId = Number(quizIdRaw);
    const [licenseInfo, setLicenseInfo] = useState<License | null>(null);

    // Lấy thông tin license
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

    // Xử lý dữ liệu quiz
    const rawDataString = Array.isArray(rawData) ? rawData[0] : rawData || '[]';
    const parsedRawData: {
        id: number;
        content: string;
        options: string;
        selectedAnswerIndex?: number;
        correctAnswerIndex: number;
        isCritical?: boolean;
    }[] = JSON.parse(rawDataString);

    const results = parsedRawData.map((item) => {
        const options = JSON.parse(item.options);
        return {
            id: item.id,
            question: item.content,
            selectedAnswer: item.selectedAnswerIndex !== undefined ? options[item.selectedAnswerIndex] : undefined,
            correctAnswer: options[item.correctAnswerIndex],
            isCorrect: item.selectedAnswerIndex === item.correctAnswerIndex,
            isCritical: item.isCritical,
        };
    });

    const correctAnswers = results.filter((item) => item.isCorrect).length;
    const incorrectAnswers = Math.max(0, totalQuestions - correctAnswers);
    const hasCriticalError = results.some((item) => item.isCritical && !item.isCorrect);

    // ✅ Tính passed chỉ khi licenseInfo có
    const passed = licenseInfo
        ? !hasCriticalError && correctAnswers >= licenseInfo.requiredCorrect
        : false;

    // ✅ Lưu kết quả sau khi licenseInfo đã có
    useEffect(() => {
        if (!licenseInfo) return;

        const saveResult = async () => {
            if (!isNaN(quizId)) {
                await saveQuizHistory(quizId, correctAnswers, incorrectAnswers, passed);
            } else {
                console.warn('⚠️ Quiz ID is invalid. Cannot save result.');
            }
        };
        saveResult();
    }, [licenseInfo, quizId, correctAnswers, incorrectAnswers, passed]);

    return (
        <View style={styles.container}>
            <View>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>KẾT QUẢ BÀI THI</Text>
                </View>
                <View style={styles.divider} />
            </View>

            <View style={styles.summaryContainer}>
                {hasCriticalError && (
                    <Text style={styles.failText}>Bạn đã bị đánh rớt do sai câu hỏi điểm liệt!</Text>
                )}

                {licenseInfo && !passed && !hasCriticalError && (
                    <Text style={styles.failText}>
                        Bạn đã bị đánh rớt do không đạt số câu đúng tối thiểu ({licenseInfo.requiredCorrect}).
                    </Text>
                )}

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                    <Text style={styles.summaryCorrect}>Đúng: {correctAnswers}</Text>
                    <Text style={styles.summaryWrong}>Sai: {incorrectAnswers}</Text>
                </View>
            </View>

            <FlatList
                data={results}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.resultItem}
                        onPress={() =>
                            router.push({
                                pathname: '/testscreen/questiondetails',
                                params: {
                                    id: item.id,
                                    question: item.question,
                                    selectedAnswer: item.selectedAnswer,
                                    correctAnswer: item.correctAnswer,
                                    isCorrect: String(item.isCorrect),
                                },
                            })
                        }
                    >
                        <Text style={styles.resultQuestion}>
                            {item.id}. {item.question}
                        </Text>
                        <Text style={item.isCorrect ? styles.correctAnswer : styles.incorrectAnswer}>
                            {item.isCorrect ? 'Đúng' : 'Sai'}
                        </Text>
                        <Text style={styles.resultAnswer}>
                            Đáp án của bạn: {item.selectedAnswer || 'Chưa chọn'}
                        </Text>
                        <Text style={styles.resultAnswer}>Đáp án đúng: {item.correctAnswer}</Text>
                        {item.isCritical && <Text style={styles.criticalQuestion}>Câu hỏi điểm liệt</Text>}
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.resultList}
            />

            <TouchableOpacity style={styles.backButton} onPress={() => router.push('/testscreen')}>
                <Text style={styles.backButtonText}>Quay Lại</Text>
            </TouchableOpacity>
        </View>
    );
};


// Styles giữ nguyên
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA', padding: 10 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    summaryContainer: { marginBottom: 5, textAlign: 'center', alignItems: 'center' },
    summaryText: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
    summaryCorrect: { fontSize: 18, fontWeight: 'bold', marginBottom: 5, color: 'green' },
    summaryWrong: { fontSize: 18, fontWeight: 'bold', marginBottom: 5, color: 'red' },
    failText: { fontSize: 18, fontWeight: 'bold', color: 'red', textAlign: 'center', marginBottom: 10 },
    criticalQuestion: { fontSize: 14, color: 'orange', fontStyle: 'italic', marginTop: 5 },
    resultList: { paddingBottom: 20 },
    resultItem: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    resultQuestion: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
    correctAnswer: { fontSize: 16, color: 'green', fontWeight: 'bold' },
    incorrectAnswer: { fontSize: 16, color: 'red', fontWeight: 'bold' },
    resultAnswer: { fontSize: 14, color: '#333', marginTop: 5 },
    backButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    backButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    divider: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 10 },
});

export default ResultScreen;