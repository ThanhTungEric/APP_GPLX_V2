import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal, ScrollView, Image, PanResponder, Animated } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { getQuestionsByQuiz } from '../../database/quizzes';
import { getLicenseById } from '../../database/licenses';
import { getCurrentLicenseId } from '../../database/history';
import { getImageSource } from '../../utils/getImageSource';
type License = { id: number; name: string; description: string; totalQuestions: number; requiredCorrect: number; durationMinutes: number; };

const ExamScreen = () => {
    const router = useRouter();
    const { id, title, licenseName } = useLocalSearchParams();

    interface Question { id: number; content: string; options: string; correctAnswerIndex: number; chapterId: number; imageName?: string; number: number; isCritical?: boolean; }

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [licenseInfo, setLicenseInfo] = useState<License | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const translateX = useState(new Animated.Value(0))[0];
    const [isSwiping, setIsSwiping] = useState(false);
    const fadeAnim = useState(new Animated.Value(1))[0]; // Animation for fade effect

    const shuffleOptionsAndAdjustAnswer = (
        options: string[],
        correctIndex: number
    ): { shuffledOptions: string[]; newCorrectIndex: number } => {
        const indexedOptions = options.map((opt, i) => ({ opt, index: i }));
        for (let i = indexedOptions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indexedOptions[i], indexedOptions[j]] = [indexedOptions[j], indexedOptions[i]];
        }
        const shuffledOptions = indexedOptions.map((item) => item.opt);
        const newCorrectIndex = indexedOptions.findIndex((item) => item.index === correctIndex);
        return { shuffledOptions, newCorrectIndex };
    };


    useEffect(() => {
        (async () => {
            const licenseId = await getCurrentLicenseId();
            if (licenseId) {
                const numericId = Number(licenseId);
                const data = await getLicenseById(numericId) as License;
                setLicenseInfo(data);
            }
        })();
    }, []);
    useEffect(() => {
        if (licenseInfo?.durationMinutes) {
            const totalSeconds = licenseInfo.durationMinutes * 60;
            setTimeLeft(totalSeconds);
        }
    }, [licenseInfo]);
    useEffect(() => {
        if (timeLeft <= 0) return;

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    handleSubmit();
                    confirmSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft]);


    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const quizId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
                const result = await getQuestionsByQuiz(quizId);
                const formattedQuestions = result.map((q) => {
                    const originalOptions = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
                    const { shuffledOptions, newCorrectIndex } = shuffleOptionsAndAdjustAnswer(originalOptions, q.correctAnswerIndex);

                    return {
                        ...q,
                        options: JSON.stringify(shuffledOptions),
                        correctAnswerIndex: newCorrectIndex,
                        isCritical: !!q.isCritical,
                    };
                });

                setQuestions(formattedQuestions);
            } catch (error) { console.error('Error fetching questions:', error); }
        };
        if (id) { fetchQuestions(); }
    }, [id]);

    const handleAnswerSelect = (questionId: number, answerIndex: number) => { setSelectedAnswers({ ...selectedAnswers, [questionId]: answerIndex }); };

    const handleNextQuestion = () => { if (currentQuestionIndex < questions.length - 1) { setCurrentQuestionIndex(currentQuestionIndex + 1); } };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) { setCurrentQuestionIndex(currentQuestionIndex - 1); }
    };

    const handleSubmit = () => { setIsModalVisible(true); };

    const confirmSubmit = () => {
        const rawData = questions.map((question) => ({
            id: question.id,
            content: question.content,
            options: question.options,
            selectedAnswerIndex: selectedAnswers[question.id],
            correctAnswerIndex: question.correctAnswerIndex,
            isCritical: question.isCritical,
        }));

        setIsModalVisible(false);
        router.push({
            pathname: '/testscreen/result',
            params: { rawData: JSON.stringify(rawData), totalQuestions: questions.length, testName: title, id: id, licenseName: licenseName, },
        });
    };

    const handleQuestionTransition = (direction: 'next' | 'previous') => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            if (direction === 'next' && currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex((prev) => prev + 1);
            } else if (direction === 'previous' && currentQuestionIndex > 0) {
                setCurrentQuestionIndex((prev) => prev - 1);
            }
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();
        });
    };

    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
            Math.abs(gestureState.dx) > 10 && !isSwiping,

        onPanResponderGrant: () => {
            setIsSwiping(true);
        },

        onPanResponderMove: (_, gestureState) => {
            translateX.setValue(gestureState.dx);
        },

        onPanResponderRelease: (_, gestureState) => {
            const threshold = 100;

            if (gestureState.dx > threshold && currentQuestionIndex > 0) {
                // Swipe right (previous)
                Animated.timing(translateX, {
                    toValue: 15000000,
                    duration: 20000,
                    useNativeDriver: true,
                }).start(() => {
                    setCurrentQuestionIndex((prev) => prev - 1);
                    translateX.setValue(-500); // Reset từ bên trái
                    Animated.timing(translateX, {
                        toValue: 1500000,
                        duration: 20000,
                        useNativeDriver: true,
                    }).start(() => setIsSwiping(false));
                });
            } else if (gestureState.dx < -threshold && currentQuestionIndex < questions.length - 1) {
                Animated.timing(translateX, {
                    toValue: -10500,
                    duration: 200,
                    useNativeDriver: true,
                }).start(() => {
                    setCurrentQuestionIndex((prev) => prev + 1);
                    translateX.setValue(500);
                    Animated.timing(translateX, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: true,
                    }).start(() => setIsSwiping(false));
                });
            } else {
                Animated.spring(translateX, {
                    toValue: 0,
                    useNativeDriver: true,
                }).start(() => setIsSwiping(false));
            }
        },
    });


    const currentQuestion = questions[currentQuestionIndex];

    return (
        <View style={styles.container}>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
                {/* Timer and Status Row */}
                <View style={styles.timerAndStatusRow}>
                    <View style={styles.timerBox}>
                        <Text style={styles.timerText}>
                            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                        </Text>
                    </View>

                    <View style={styles.questionStatusContainer}>
                        {questions.map((q, index) => {
                            const answered = selectedAnswers[q.id] !== undefined;
                            const isCurrent = index === currentQuestionIndex;
                            return (
                                <View
                                    key={q.id}
                                    style={[
                                        styles.circle,
                                        answered ? styles.circleAnswered : styles.circleUnanswered,
                                        isCurrent && styles.circleCurrent,
                                    ]}
                                >
                                    <Text style={styles.circleText}>{index + 1}</Text>
                                </View>
                            );
                        })}
                    </View>
                </View>

                {/* Swipeable Question Content */}
                <Animated.View
                    {...panResponder.panHandlers}
                    style={[{ transform: [{ translateX }], opacity: fadeAnim }]}
                >
                    {currentQuestion && (
                        <View>
                            <Text style={styles.questionText}>
                                Câu hỏi {currentQuestionIndex + 1}/{questions.length}:
                            </Text>
                            <Text style={styles.questionText}>{currentQuestion.content}</Text>
                            {currentQuestion.imageName && (
                                <Image
                                    source={getImageSource(currentQuestion.imageName, currentQuestion.number)}
                                    style={styles.questionImage}
                                />
                            )}

                            <ScrollView
                                style={styles.questionScroll}
                                contentContainerStyle={styles.questionScrollContent}
                            >
                                {JSON.parse(currentQuestion.options).map((option: string, index: number) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.answerButton,
                                            selectedAnswers[currentQuestion.id] === index && styles.selectedAnswerButton,
                                        ]}
                                        onPress={() => handleAnswerSelect(currentQuestion.id, index)}
                                    >
                                        <Text style={styles.answerText}> {option} </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                </Animated.View>
            </ScrollView>

            {/* Fixed Navigation at bottom */}
            <View style={styles.navigationContainer}>
                <TouchableOpacity
                    style={[styles.navButton]}
                    onPress={() => handleQuestionTransition('previous')}
                    disabled={currentQuestionIndex === 0}
                >
                    <MaterialCommunityIcons name="chevron-left" size={30} color={currentQuestionIndex === 0 ? "#999" : "#1c84c6"} />
                    <MaterialCommunityIcons name="chevron-left" size={30} color={currentQuestionIndex === 0 ? "#999" : "#1c84c6"} />
                    <MaterialCommunityIcons name="chevron-left" size={30} color={currentQuestionIndex === 0 ? "#999" : "#1c84c6"} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Nộp Bài</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.navButton]}
                    onPress={() => handleQuestionTransition('next')}
                    disabled={currentQuestionIndex === questions.length - 1}
                >
                    <MaterialCommunityIcons name="chevron-right" size={30} color={currentQuestionIndex === questions.length - 1 ? "#999" : "#1c84c6"} />
                    <MaterialCommunityIcons name="chevron-right" size={30} color={currentQuestionIndex === questions.length - 1 ? "#999" : "#1c84c6"} />
                    <MaterialCommunityIcons name="chevron-right" size={30} color={currentQuestionIndex === questions.length - 1 ? "#999" : "#1c84c6"} />
                </TouchableOpacity>
            </View>

            {/* Modal for Confirmation */}
            <Modal visible={isModalVisible} transparent animationType="fade">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Xác Nhận Nộp Bài</Text>
                        <FlatList
                            data={questions}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.modalQuestionContainer}>
                                    <Text style={styles.modalQuestionText}> {item.number}. {item.content} </Text>
                                    <Text style={styles.modalAnswerText}>Đáp án của bạn:{' '}
                                        {selectedAnswers[item.id] !== undefined
                                            ? JSON.parse(item.options)[selectedAnswers[item.id]]
                                            : 'Chưa chọn'}
                                    </Text>
                                </View>
                            )}
                        />
                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.modalButton} onPress={() => setIsModalVisible(false)}>
                                <Text style={[styles.modalButtonText, { color: '#888' }]}>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalButton} onPress={confirmSubmit}>
                                <Text style={[styles.modalButtonText, { color: '#007AFF' }]}>Xác nhận</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </Modal>
        </View>
    );
};

// Styles giữ nguyên như cũ
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 10 },
    header: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#fff' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
    questionText: { fontSize: 18, fontWeight: 'bold', marginBottom: 3 },
    answerButton: { padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 10, backgroundColor: '#fff' },
    selectedAnswerButton: { backgroundColor: '#E3F2FD', borderColor: '#007AFF' },
    answerText: { fontSize: 16, color: '#333' },
    navigationContainer: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff' },
    navButton: { padding: 15, borderRadius: 10, alignItems: 'center', flex: 1, marginHorizontal: 5, display: 'flex', flexDirection: 'row', justifyContent: 'center' },
    navButtonText: { color: '#111', fontWeight: 'bold' },
    submitButton: { backgroundColor: '#28A745', paddingHorizontal: 20, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    modalContent: { width: '90%', backgroundColor: '#fff', borderRadius: 8, padding: 20, maxHeight: '80%' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
    questionImage: {
        width: '100%',
        height: 200,
        resizeMode: 'contain',
        marginVertical: 10,
    },
    questionScroll: { marginBottom: 15, marginTop: 10 },
    questionScrollContent: { paddingBottom: 5 },
    modalQuestionContainer: { marginBottom: 15, padding: 10, backgroundColor: '#f9f9f9', borderRadius: 8, borderWidth: 1, borderColor: '#ddd', },
    modalQuestionText: { fontSize: 14, fontWeight: 'bold', marginBottom: 5 },
    modalAnswerText: { fontSize: 14, color: '#333' },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: '#f2f2f2',
        marginHorizontal: 5,
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 15,
    },

    timerBox: { backgroundColor: '#FFEFD5', paddingVertical: 5, paddingHorizontal: 5, width: 60, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderRadius: 8, },
    timerText: { fontSize: 16, color: '#dc3545', fontWeight: '500', },
    timerAndStatusRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 10, },
    questionStatusContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 2, flex: 1, },
    circle: { width: 20, height: 20, borderRadius: 14, justifyContent: 'center', alignItems: 'center', },
    circleAnswered: { backgroundColor: '#007AFF', },
    circleUnanswered: { backgroundColor: '#ccc', },
    circleCurrent: { backgroundColor: '#007AFF', },
    circleText: { color: '#fff', fontWeight: 'bold', fontSize: 13, },
});

export default ExamScreen;