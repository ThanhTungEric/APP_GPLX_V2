import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { saveQuizHistory } from '../database/quizesshistory';

const ResultScreen = () => {
    const router = useRouter();
    const { results, totalQuestions: totalQuestionsRaw, testName, id: quizIdRaw, licenseName: licenseName } = useLocalSearchParams();
    const totalQuestions = Number(totalQuestionsRaw) || 0;
    const quizId = Number(quizIdRaw);
    console.log('->quizId', licenseName)

    const parsedResults: { id: number; question: string; isCorrect: boolean; selectedAnswer?: string; correctAnswer: string; isCritical?: boolean }[] =
        Array.isArray(results) ? results : JSON.parse(results || '[]');

    const correctAnswers = parsedResults.filter((item) => item.isCorrect).length;
    console.log('-->correctAnswers', correctAnswers)
    const incorrectAnswers = Math.max(0, totalQuestions - correctAnswers);
    console.log('-->incorrectAnswers', correctAnswers)
    const hasCriticalError = parsedResults.some((item) => item.isCritical && !item.isCorrect);
    console.log('-->hasCriticalError', hasCriticalError)

    const licenseRequirements: Record<string, number> = {
        A1: 21,
        A: 23,
        B1: 0,
        C1: 32,
        C: 36,
        D1: 36,
        D2: 41, D: 41, BE: 41, C1E: 41, CE: 41, D1E: 41, D2E: 41, DE: 41
    };

    const requiredCorrectAnswers = licenseRequirements[Array.isArray(licenseName) ? licenseName[0] : licenseName];
    const passed = !hasCriticalError && correctAnswers >= requiredCorrectAnswers;

    console.log('-->requiredCorrectAnswers', requiredCorrectAnswers);
    console.log('-->passed', passed)

    useEffect(() => {
        const saveResult = async () => {
            if (!isNaN(quizId)) {
                const a = await saveQuizHistory(quizId, correctAnswers, incorrectAnswers, passed);
                console.log('llll', a)
                console.log('✅ Quiz result saved to quizesshistory.');
            } else {
                console.warn('⚠️ Quiz ID is invalid. Cannot save result.');
            }
        };
        saveResult();
    }, [quizId, correctAnswers, incorrectAnswers, passed]);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Kết quả của bộ đề {testName || 'Kết Quả Bài Thi'}</Text>
                </View>
                <View style={styles.divider} />
            </View>

            {/* Summary */}
            <View style={styles.summaryContainer}>
                <Text style={styles.summaryText}>Loại bằng: {licenseName || 'Không xác định'}</Text>
                <Text style={styles.summaryText}>Tổng số câu: {totalQuestions}</Text>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                    <Text style={styles.summaryCorrect}>Đúng: {correctAnswers}</Text>
                    <Text style={styles.summaryWrong}>Sai: {incorrectAnswers}</Text>
                </View>
                {hasCriticalError && (
                    <Text style={styles.failText}>Bạn đã bị đánh rớt do sai câu hỏi điểm liệt!</Text>
                )}
                {!passed && !hasCriticalError && (
                    <Text style={styles.failText}>
                        Bạn đã bị đánh rớt do không đạt số câu đúng tối thiểu ({requiredCorrectAnswers}).
                    </Text>
                )}
            </View>

            {/* Detailed Results */}
            <FlatList
                data={parsedResults}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.resultItem}
                        onPress={() => router.push({ pathname: '/testscreen/questiondetails', params: { id: item.id, question: item.question, selectedAnswer: item.selectedAnswer, correctAnswer: item.correctAnswer, isCorrect: String(item.isCorrect) } })}
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
                        <Text style={styles.resultAnswer}>
                            Đáp án đúng: {item.correctAnswer}
                        </Text>
                        {item.isCritical && (
                            <Text style={styles.criticalQuestion}>Câu hỏi điểm liệt</Text>
                        )}
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.resultList}
            />

            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.push('/testscreen')}>
                <Text style={styles.backButtonText}>Quay Lại</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA', padding: 20 },
    header: { alignItems: 'center', marginBottom: 20 },
    headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
    summaryContainer: { marginBottom: 20, textAlign: 'center', alignItems: 'center' },
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
