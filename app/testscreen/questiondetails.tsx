import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const QuestionDetailsScreen = () => {
    const router = useRouter();
    const { id, question, selectedAnswer, correctAnswer, isCorrect } = useLocalSearchParams();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backButton}>Quay Lại</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chi Tiết Câu Hỏi</Text>
            </View>

            {/* Question Details */}
            <View style={styles.content}>
                <Text style={styles.questionText}>{id}. {question}</Text>
                <Text style={styles.answerCorrect}>Đáp án của bạn: {selectedAnswer || 'Chưa chọn'}</Text>
                <Text style={styles.answerIncorrect}>Đáp án đúng: {correctAnswer}</Text>
                {/* <Text style={isCorrect ? styles.correctText : styles.incorrectText}>
                    {isCorrect ? 'Bạn đã trả lời đúng!' : 'Bạn đã trả lời sai.'}
                </Text> */}
                <Text style={styles.explanationText}>
                    Đây là lời giải thích chi tiết về đáp án đúng.
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA', padding: 20 },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    backButton: { fontSize: 16, color: '#007AFF', marginRight: 10 },
    headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
    content: { flex: 1 },
    questionText: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    answerCorrect: { fontSize: 16, marginBottom: 5, color: 'black' },
    answerIncorrect: { fontSize: 16, marginBottom: 5, color: 'green' },

    correctText: { fontSize: 16, color: 'green', fontWeight: 'bold', marginBottom: 10 },
    incorrectText: { fontSize: 16, color: 'red', fontWeight: 'bold', marginBottom: 10 },
    explanationText: { fontSize: 14, color: '#333', marginTop: 10 },
});

export default QuestionDetailsScreen;
