import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, PanResponder, Animated } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getQuestionsByChapter } from './database/questions';

import { insertSavedQuestion, getSavedQuestionByQuestionId } from "./database/savequestion";
const StudyScreen = () => {
    const translateX = useState(new Animated.Value(0))[0];
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);


    const router = useRouter();
    const { id, title } = useLocalSearchParams();
    // Define the Question type
    type Question = {
        id: number;
        content: string;
        options: string;
        correctAnswerIndex: number;
        imageName?: string;
    };

    const [isSwiping, setIsSwiping] = useState(false);

    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 20 && !isSwiping, // Detect horizontal swipe
        onPanResponderGrant: () => setIsSwiping(true),
        onPanResponderMove: (_, gestureState) => {
            translateX.setValue(gestureState.dx);
        },
        onPanResponderRelease: (_, gestureState) => {
            const threshold = 100;
            if (gestureState.dx > threshold && currentIndex > 0) {
                Animated.timing(translateX, {
                    toValue: 500,
                    duration: 200,
                    useNativeDriver: true,
                }).start(() => {
                    setCurrentIndex((prevIndex) => prevIndex - 1);
                    translateX.setValue(-500); // Reset translateX for the next animation
                    Animated.timing(translateX, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: true,
                    }).start(() => setIsSwiping(false));
                });
            } else if (gestureState.dx < -threshold && currentIndex < questions.length - 1) {
                // Swipe left to go to the next question
                Animated.timing(translateX, {
                    toValue: -500,
                    duration: 200,
                    useNativeDriver: true,
                }).start(() => {
                    setCurrentIndex((prevIndex) => prevIndex + 1);
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

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    useEffect(() => {
        async function fetchQuestions() {
            try {
                const chapterQuestions = await getQuestionsByChapter(Number(id));
                setQuestions(chapterQuestions);
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        }
        fetchQuestions();
    }, [id]);

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setSelectedOption(null);
        }
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedOption(null);
        }
    };

    const handleOptionSelect = (index: number) => {
        setSelectedOption(index);
    };

    return (
        <View style={styles.container} {...panResponder.panHandlers}>
            <Text style={styles.title}>{title}</Text>
            {questions.length > 0 ? (
                <View style={styles.questionContainer}>
                    <Text style={styles.questionContent}>Câu {currentIndex + 1}: {questions[currentIndex].content}</Text>
                    <View style={styles.optionsContainer}>
                        {questions[currentIndex].imageName && (
                            <Image
                                source={{ uri: `https://daotaolaixebd.com/app/uploads/${questions[currentIndex].imageName}` }}
                                style={styles.questionImage}
                            />
                        )}

                        {JSON.parse(questions[currentIndex].options).map((option: string, index: number) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.option,
                                    selectedOption !== null && index === questions[currentIndex].correctAnswerIndex && styles.correctOption,
                                    selectedOption !== null && index === selectedOption && index !== questions[currentIndex].correctAnswerIndex && styles.incorrectOption,
                                ]}
                                onPress={() => handleOptionSelect(index)}
                                disabled={selectedOption !== null} // Chỉ cho phép chọn một lần
                            >
                                <Text style={styles.optionText}>{index + 1}. {option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            ) : (
                <Text>Không có câu hỏi nào.</Text>
            )}

            <View style={styles.navigationContainer}>
                <View style={styles.navigationButtons}>
                    <TouchableOpacity
                        style={[styles.navButton, currentIndex === 0 && styles.disabledButton]}
                        onPress={handlePrevious}
                        disabled={currentIndex === 0}
                    >
                        <Text style={styles.navButtonText}>Trước</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.navButton, currentIndex === questions.length - 1 && styles.disabledButton]}
                        onPress={handleNext}
                        disabled={currentIndex === questions.length - 1}
                    >
                        <Text style={styles.navButtonText}>Tiếp</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: '#F8F9FA' },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 5, textAlign: "center" },
    questionContainer: { flex: 1, marginBottom: 20, padding: 5, backgroundColor: 'transparent', borderRadius: 10 },
    questionNumber: { fontWeight: 'bold', marginBottom: 5, fontSize: 17 },
    questionContent: { fontSize: 17, marginBottom: 10 },
    optionsContainer: { marginTop: 10 },
    option: { marginBottom: 5, padding: 10, backgroundColor: '#F4F4F4', borderRadius: 5 },
    optionText: { fontSize: 16.5 },
    correctOption: { backgroundColor: '#D4EDDA', color: '#155724', fontWeight: 'bold' },
    incorrectOption: { backgroundColor: '#F8D7DA', color: '#721C24', fontWeight: 'bold' },
    navigationContainer: { justifyContent: 'flex-end', marginBottom: 10 },
    navigationButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
    navButton: { padding: 15, backgroundColor: '#007AFF', borderRadius: 10, alignItems: 'center', flex: 1, marginHorizontal: 5 },
    disabledButton: { backgroundColor: '#ccc' },
    navButtonText: { color: '#fff', fontWeight: 'bold' },
    backButton: { marginTop: 20, padding: 15, backgroundColor: '#007AFF', borderRadius: 10, alignItems: 'center' },
    backButtonText: { color: '#fff', fontWeight: 'bold' },
    questionImage: { width: '100%', height: 200, resizeMode: 'contain', marginVertical: 10 },
});

export default StudyScreen;
