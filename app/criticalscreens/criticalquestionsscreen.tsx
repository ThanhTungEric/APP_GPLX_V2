import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, PanResponder, Animated } from 'react-native';
import { getCriticalQuestions, Question } from '../database/questions';

const CriticalQuestionsScreen = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const translateX = useState(new Animated.Value(0))[0];
    const [isSwiping, setIsSwiping] = useState(false);

    useEffect(() => {
        async function fetchCriticalQuestions() {
            try {
                const data = await getCriticalQuestions();
                if (data && data.length > 0) {
                    setQuestions(data);
                } else {
                    console.error('No critical questions found.');
                }
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

    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 20 && !isSwiping, // Detect horizontal swipe
        onPanResponderGrant: () => setIsSwiping(true),
        onPanResponderMove: (_, gestureState) => {
            translateX.setValue(gestureState.dx); // Update translateX based on swipe distance
        },
        onPanResponderRelease: (_, gestureState) => {
            const threshold = 100; // Minimum swipe distance to trigger navigation
            if (gestureState.dx > threshold && currentQuestionIndex > 0) {
                // Swipe right to go to the previous question
                Animated.timing(translateX, {
                    toValue: 500,
                    duration: 200,
                    useNativeDriver: true,
                }).start(() => {
                    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
                    translateX.setValue(-500); // Reset translateX for the next animation
                    Animated.timing(translateX, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: true,
                    }).start(() => setIsSwiping(false));
                });
            } else if (gestureState.dx < -threshold && currentQuestionIndex < questions.length - 1) {
                // Swipe left to go to the next question
                Animated.timing(translateX, {
                    toValue: -500,
                    duration: 200,
                    useNativeDriver: true,
                }).start(() => {
                    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
                    translateX.setValue(500); // Reset translateX for the next animation
                    Animated.timing(translateX, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: true,
                    }).start(() => setIsSwiping(false));
                });
            } else {
                // If swipe distance is below the threshold, reset translateX
                Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start(() => setIsSwiping(false));
            }
        },
    });

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
        <View style={styles.container} {...panResponder.panHandlers}>
            <Animated.View style={{ transform: [{ translateX }] }}>
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
                            disabled={selectedAnswer !== null}
                        >
                            <View style={styles.optionRow}>
                                <Text style={styles.optionText}>{option}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
                {currentQuestionIndex === questions.length - 1 && (
                    <Text style={styles.endText}>Bạn đã hoàn thành tất cả câu hỏi!</Text>
                )}
            </Animated.View>
            <View style={{ flex: 1 }} />
            <View style={styles.navigationContainer}>
                <TouchableOpacity
                    style={[styles.navButton, currentQuestionIndex === 0 && styles.disabledNavButton]}
                    onPress={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                >
                    <Text style={styles.navButtonText}>Trước</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.navButton,
                        currentQuestionIndex === questions.length - 1 && styles.disabledNavButton,
                    ]}
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
    container: { flex: 1, backgroundColor: '#F8F9FA', padding: 15 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    questionCard: { padding: 15, backgroundColor: 'transparent', borderRadius: 10, marginBottom: 10 },
    questionText: { fontSize: 16, color: '#333', marginBottom: 10, fontWeight: 'bold' },
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
    navButton: { flex: 1, paddingVertical: 12, paddingHorizontal: 15, backgroundColor: '#007AFF', borderRadius: 5, marginHorizontal: 5, alignItems: 'center' },
    disabledNavButton: { backgroundColor: '#ccc' },
    navButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },

});

export default CriticalQuestionsScreen;
