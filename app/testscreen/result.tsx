import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const ResultScreen = () => {
    const router = useRouter();
    const { results, totalQuestions: totalQuestionsRaw } = useLocalSearchParams();
    const totalQuestions = Number(totalQuestionsRaw) || 0;

    const parsedResults: { id: number; question: string; isCorrect: boolean; selectedAnswer?: string; correctAnswer: string }[] =
        Array.isArray(results) ? results : JSON.parse(results || '[]');
    const correctAnswers = parsedResults.filter((item: any) => item.isCorrect).length;
    const incorrectAnswers = Math.max(0, totalQuestions - correctAnswers);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Kết Quả Bài Thi</Text>
            </View>

            {/* Summary */}
            <View style={styles.summaryContainer}>
                <Text style={styles.summaryText}>Tổng số câu: {totalQuestions}</Text>
                <Text style={styles.summaryText}>Đúng: {correctAnswers}</Text>
                <Text style={styles.summaryText}>Sai: {incorrectAnswers}</Text>
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
    summaryContainer: { marginBottom: 20 },
    summaryText: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
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
});

export default ResultScreen;
