import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { getCriticalQuestions, Question } from '../database/questions';

const CriticalQuestionsScreen = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

    useEffect(() => {
        async function fetchCriticalQuestions() {
            try {
                const data = await getCriticalQuestions();
                setQuestions(data);
            } catch (error) {
                console.error('Error fetching critical questions:', error);
            }
        }
        fetchCriticalQuestions();
    }, []);

    const handleAnswerSelect = (answerIndex: number) => {
        setSelectedAnswer(answerIndex);
    };

    const handleNextQuestion = () => {
        setSelectedAnswer(null);
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    };

    const handlePreviousQuestion = () => {
        setSelectedAnswer(null);
        setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    };

    if (questions.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Đang tải câu hỏi...</Text>
            </View>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const options = JSON.parse(currentQuestion.options) as string[];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>CÂU HỎI ĐIỂM LIỆT</Text>
            <ScrollView style={styles.questionCard}>
                <Text style={styles.questionText}>
                    {currentQuestion.number}. {currentQuestion.content}
                </Text>

                {options.map((option, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.optionButton,
                            selectedAnswer !== null && index === currentQuestion.correctAnswerIndex && { backgroundColor: '#E8F5E9' },
                            selectedAnswer !== null && selectedAnswer !== currentQuestion.correctAnswerIndex && selectedAnswer === index && { backgroundColor: '#FFEBEE' },
                        ]}
                        onPress={() => handleAnswerSelect(index)}
                        disabled={selectedAnswer !== null}
                    >
                        <View style={styles.optionRow}>
                            <Text style={styles.optionText}>{index + 1}. {option}</Text>
                        </View>
                    </TouchableOpacity>
                ))}

                {selectedAnswer !== null && currentQuestion.explain && (
                    <View style={styles.explainContainer}>
                        <Text style={styles.explainTitle}>Giải thích:</Text>
                        <Text style={styles.explainText}>{currentQuestion.explain}</Text>
                    </View>
                )}

                {currentQuestionIndex === questions.length - 1 && (
                    <Text style={styles.endText}>Bạn đã hoàn thành tất cả câu hỏi!</Text>
                )}
            </ScrollView>

            <View style={styles.navigationContainer}>
                <TouchableOpacity
                    style={[styles.navButton, currentQuestionIndex === 0 && styles.disabledNavButton]}
                    onPress={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                >
                    <Text style={styles.navButtonText}>Trước</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.navButton, currentQuestionIndex === questions.length - 1 && styles.disabledNavButton]}
                    onPress={handleNextQuestion}
                    disabled={currentQuestionIndex === questions.length - 1}
                >
                    <Text style={styles.navButtonText}>Sau</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA', padding: 8 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
    questionCard: { padding: 15, backgroundColor: 'transparent', borderRadius: 10, marginBottom: 10 },
    questionText: { fontSize: 17, color: '#333', marginBottom: 10, fontWeight: 'bold' }, // Match StudyScreen
    optionButton: {
        padding: 10,
        backgroundColor: '#F4F4F4',
        borderRadius: 5,
        marginBottom: 5,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionText: {
        fontSize: 16.5, // Match StudyScreen
        color: '#333',
    },
    navigationContainer: { flexDirection: 'row', justifyContent: 'space-between', padding: 15 },
    navButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 15,
        backgroundColor: '#007AFF',
        borderRadius: 5,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    disabledNavButton: { backgroundColor: '#ccc' },
    navButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    endText: { marginTop: 20, fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: '#333' },

    // Giải thích
    explainContainer: {
        marginTop: 15,
        padding: 10,
        backgroundColor: '#FFF3CD',
        borderRadius: 5,
        borderLeftWidth: 5,
        borderLeftColor: '#FFEEBA',
    },
    explainTitle: {
        fontWeight: 'bold',
        marginBottom: 5,
        fontSize: 16,
    },
    explainText: {
        fontSize: 15.5,
        lineHeight: 22,
    },
});

export default CriticalQuestionsScreen;
