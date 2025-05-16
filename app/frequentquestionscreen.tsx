import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, PanResponder } from 'react-native';
import { getFrequentMistakes } from '../database/frequentmistakes';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const FrequentQuestionScreen = () => {
    const router = useRouter();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});

    interface Answer {
        id: string;
        text: string;
    }

    interface Question {
        id: number;
        question: string;
        answers: Answer[];
        correct: string;
        image?: string;
    }

    const [questions, setQuestions] = useState<Question[]>([]);

    useEffect(() => {
        const fetchFrequentMistakes = async () => {
            try {
                const frequentMistakes = await getFrequentMistakes();

                const mappedQuestions = frequentMistakes.map((mistake) => {
                    let parsedOptions: string[] = [];
                    try {
                        parsedOptions = JSON.parse(mistake.options);
                    } catch (error) {
                        console.error('Lỗi parse options:', error);
                    }

                    return {
                        id: mistake.questionId,
                        question: mistake.content,
                        answers: parsedOptions.map((option: string, index: number) => ({
                            id: String.fromCharCode(65 + index),
                            text: option.trim(),
                        })),
                        correct: String.fromCharCode(65 + mistake.correctAnswerIndex),
                        image: mistake.imageName
                            ? `https://daotaolaixebd.com/app/uploads/${mistake.imageName}`
                            : undefined,
                    };
                });

                setQuestions(mappedQuestions);
            } catch (error) {
                console.error('Error fetching frequent mistakes:', error);
            }
        };

        fetchFrequentMistakes();
    }, []);

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

    const handleSwipe = (direction: 'left' | 'right') => {
        if (direction === 'left' && currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else if (direction === 'right' && currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 20,
        onPanResponderRelease: (_, gestureState) => {
            if (gestureState.dx < -50) {
                handleSwipe('left');
            } else if (gestureState.dx > 50) {
                handleSwipe('right');
            }
        },
    });

    // ✅ Giao diện nếu không có câu hỏi
    if (questions.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.push('/')}>
                        <MaterialCommunityIcons name="arrow-left" size={28} color="#007AFF" />
                    </TouchableOpacity>
                    <Text style={styles.title}>CÂU HỎI HAY SAI</Text>
                </View>

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
                    <Text style={styles.loadingText}>Không có câu hỏi thường sai nào.</Text>
                </View>
            </View>
        );
    }

    // ✅ Giao diện khi có câu hỏi
    const currentQuestion = questions[currentQuestionIndex];

    return (
        <View style={styles.container} {...panResponder.panHandlers}>
            <ScrollView style={styles.questionContainer}>
                <Text style={styles.questionNumber}>
                    Câu {currentQuestionIndex + 1}/{questions.length}
                </Text>
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

            <View style={styles.navigationContainer}>
                <TouchableOpacity
                    style={[styles.navButton, currentQuestionIndex === 0 && styles.disabledNavButton]}
                    onPress={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                >
                    <Text style={styles.navButtonText}>Câu Trước</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.navButton, currentQuestionIndex === questions.length - 1 && styles.disabledNavButton]}
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
    container: { flex: 1, backgroundColor: '#fff', padding: 10, },
    questionContainer: { flex: 1, padding: 20 },
    header: { flexDirection: "row", alignItems: "center", marginBottom: 10, justifyContent: "space-between" },
    title: { fontSize: 17, fontWeight: 'bold', marginBottom: 5, textAlign: "center" },
    questionNumber: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#555' },
    questionText: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
    questionImage: { width: '100%', height: 200, resizeMode: 'contain', marginBottom: 15 },
    answerButton: { padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 10, backgroundColor: '#fff' },
    answerText: { fontSize: 16, color: '#333' },
    resultText: { marginTop: 10, fontSize: 14, fontWeight: 'bold', color: '#007AFF' },
    navigationContainer: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff' },
    navButton: { paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#007AFF', borderRadius: 8 },
    disabledNavButton: { backgroundColor: '#ccc' },
    navButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    loadingText: { fontSize: 18, textAlign: 'center', marginTop: 20, color: '#333' },
});

export default FrequentQuestionScreen;
