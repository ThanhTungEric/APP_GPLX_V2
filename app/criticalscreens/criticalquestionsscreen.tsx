import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
    const options = JSON.parse(currentQuestion.options) as string[]; // Assuming options are stored as a JSON string

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Câu Hỏi Điểm Liệt</Text>
            <View style={styles.questionCard}>
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
                        disabled={selectedAnswer !== null} // Disable selection after an answer is chosen
                    >
                        <View style={styles.optionRow}>
                            <View style={[
                                styles.checkbox,
                                selectedAnswer === index && { backgroundColor: selectedAnswer === currentQuestion.correctAnswerIndex ? '#00C853' : '#FF3D00' }
                            ]}>
                                {selectedAnswer === index && <Text style={styles.checkboxTick}>✓</Text>}
                            </View>
                            <Text style={styles.optionText}>
                                {option}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
            {currentQuestionIndex === questions.length - 1 && (
                <Text style={styles.endText}>Bạn đã hoàn thành tất cả câu hỏi!</Text>
            )}

            <View style={{ flex: 1 }} />
            <View style={styles.navigationContainer}>
                <TouchableOpacity
                    style={[styles.navButton, currentQuestionIndex === 0 && styles.disabledNavButton]}
                    onPress={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                >
                    <Text style={styles.navButtonText}>Câu Trước</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.navButton,
                        currentQuestionIndex === questions.length - 1 && styles.disabledNavButton
                    ]}
                    onPress={handleNextQuestion}
                    disabled={currentQuestionIndex === questions.length - 1}
                >
                    <Text style={styles.navButtonText}>Câu Tiếp</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA', padding: 15 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    questionCard: { padding: 15, backgroundColor: 'transparent', borderRadius: 10, marginBottom: 10 },
    questionText: { fontSize: 16, color: '#333', marginBottom: 10, fontWeight: 'bold' },
    optionButton: {
        padding: 10,
        backgroundColor: '#F4F4F4',
        borderRadius: 5,
        marginBottom: 15,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#333',
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 4,
    },
    checkboxTick: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    optionText: {
        fontSize: 14,
        color: '#333',
    },
    navigationButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    previousButton: {
        flex: 1,
        padding: 15,
        backgroundColor: '#FF3D00',
        borderRadius: 10,
        alignItems: 'center',
        marginRight: 5,
    },
    previousButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    nextButton: {
        flex: 1,
        padding: 15,
        backgroundColor: '#007AFF',
        borderRadius: 10,
        alignItems: 'center',
        marginLeft: 5,
    },
    nextButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    endText: { marginTop: 20, fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: '#333' },
    navigationContainer: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: 'transparent' },
    navButton: { paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#007AFF', borderRadius: 8 },
    disabledNavButton: { backgroundColor: '#ccc' },
    navButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

});

export default CriticalQuestionsScreen;
