import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';

const FrequentQuestionScreen = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});

    const questions = [
        {
            id: 1,
            question: "Câu hỏi 1: Đây là nội dung câu hỏi có hình ảnh?",
            image: "https://png.pngtree.com/png-clipart/20240105/original/pngtree-traffic-stop-sign-symbol-photo-png-image_14019657.png",
            answers: [
                { id: 'A', text: 'Đáp án A' },
                { id: 'B', text: 'Đáp án B' },
                { id: 'C', text: 'Đáp án C' },
                { id: 'D', text: 'Đáp án D' }
            ],
            correct: 'A'
        },
        {
            id: 2,
            question: "Câu hỏi 2: Đây là nội dung câu hỏi lý thuyết không có hình ảnh?",
            answers: [
                { id: 'A', text: 'Đáp án A' },
                { id: 'B', text: 'Đáp án B' },
                { id: 'C', text: 'Đáp án C' },
                { id: 'D', text: 'Đáp án D' }
            ],
            correct: 'C'
        },
        // ...existing questions...
    ];

    const handleAnswerSelect = (questionId: number, answerId: string) => {
        setSelectedAnswers({ ...selectedAnswers, [questionId]: answerId });
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <View style={styles.container}>
            {/* Question */}
            <ScrollView style={styles.questionContainer}>
                <Text style={styles.questionText}>{currentQuestion.question}</Text>
                {currentQuestion.image && (
                    <Image source={{ uri: currentQuestion.image }} style={styles.questionImage} />
                )}
                {currentQuestion.answers.map((answer) => (
                    <TouchableOpacity
                        key={answer.id}
                        style={[
                            styles.answerButton,
                            selectedAnswers[currentQuestion.id] === answer.id && {
                                backgroundColor: answer.id === currentQuestion.correct ? "#00C853" : "#FF3D00",
                            },
                        ]}
                        onPress={() => handleAnswerSelect(currentQuestion.id, answer.id)}
                    >
                        <Text style={styles.answerText}>{answer.text}</Text>
                    </TouchableOpacity>
                ))}
                {selectedAnswers[currentQuestion.id] && (
                    <Text style={styles.resultText}>
                        {selectedAnswers[currentQuestion.id] === currentQuestion.correct
                            ? "Đúng"
                            : `Sai, đáp án đúng: ${currentQuestion.correct}`}
                    </Text>
                )}
            </ScrollView>

            {/* Navigation */}
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
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    questionContainer: { flex: 1, padding: 20 },
    questionText: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
    questionImage: { width: '100%', height: 200, resizeMode: 'contain', marginBottom: 15 },
    answerButton: { padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 10, backgroundColor: '#fff' },
    answerText: { fontSize: 16, color: '#333' },
    resultText: { marginTop: 10, fontSize: 14, fontWeight: 'bold', color: '#007AFF' },
    navigationContainer: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff' },
    navButton: { paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#007AFF', borderRadius: 8 },
    disabledNavButton: { backgroundColor: '#ccc' },
    navButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default FrequentQuestionScreen;
