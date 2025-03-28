import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome'; // Thêm import Icon

const QuestionDetailsScreen = () => {
    const router = useRouter();
    const { id, question, selectedAnswer, correctAnswer, isCorrect } = useLocalSearchParams();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.headerLeft}>
                        <Icon name="arrow-left" size={22} color="#007AFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Chi Tiết Câu Hỏi</Text>
                    <View style={styles.headerRight} />
                </View>
                <View style={styles.divider} /> {/* Đường kẻ phân biệt */}
            </View>

            {/* Question Details */}
            <View style={styles.content}>
                <Text style={styles.questionText}>{id}. {question}</Text>
                <Text style={isCorrect === 'true' ? styles.correctText : styles.incorrectText}>
                    {isCorrect === 'true' ? 'Bạn đã trả lời đúng!' : 'Bạn đã trả lời sai.'}
                </Text>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                    <Text style={styles.answerIncorrect}>Đáp án đúng: {correctAnswer}</Text>
                    <Text style={styles.answerCorrect}>Đáp án của bạn: {selectedAnswer || 'Chưa chọn'}</Text>
                </View>

                <Text style={styles.explanationText}>
                    Đây là lời giải thích chi tiết về đáp án đúng.
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA', padding: 20 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, marginBottom: 20 },
    headerLeft: { width: 22, alignItems: 'flex-start' },
    headerRight: { width: 22 },
    headerTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', flex: 1, color: '#333' },
    content: { flex: 1, borderRadius: 8, padding: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
    questionText: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333' },
    answerCorrect: { fontSize: 16, marginBottom: 5, color: '#007AFF' },
    answerIncorrect: { fontSize: 16, marginBottom: 5, color: 'green' },
    correctText: { fontSize: 16, color: 'green', fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
    incorrectText: { fontSize: 16, color: 'red', fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
    explanationText: { fontSize: 14, color: '#666', marginTop: 10 },
    divider: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 10 }, // Định nghĩa đường kẻ
});

export default QuestionDetailsScreen;
