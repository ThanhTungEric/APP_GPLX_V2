import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal, ScrollView, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getQuestionsByQuiz } from '../database/quizzes';

const ExamScreen = () => {
    const router = useRouter();
    const { id, title, licenseName } = useLocalSearchParams();

    interface Question {
        id: number;
        content: string;
        options: string;
        correctAnswerIndex: number;
        chapterId: number;
        imageName?: string;
        number: number;
        isCritical?: boolean;
    }

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const quizId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
                const result = await getQuestionsByQuiz(quizId);

                const formattedQuestions = result.map((q) => ({
                    ...q,
                    isCritical: !!q.isCritical,
                    options: typeof q.options === 'string' ? q.options : JSON.stringify(q.options),
                }));

                setQuestions(formattedQuestions);
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        if (id) {
            fetchQuestions();
        }
    }, [id]);

    const handleAnswerSelect = (questionId: number, answerIndex: number) => {
        setSelectedAnswers({ ...selectedAnswers, [questionId]: answerIndex });
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

    const handleSubmit = () => {
        setIsModalVisible(true);
    };

    const confirmSubmit = () => {
        // Chuẩn bị dữ liệu để gửi sang ResultScreen
        const rawData = questions.map((question) => ({
            id: question.id,
            content: question.content,
            options: question.options, // Gửi toàn bộ options
            selectedAnswerIndex: selectedAnswers[question.id], // Chỉ gửi index của đáp án đã chọn
            correctAnswerIndex: question.correctAnswerIndex, // Gửi đáp án đúng để ResultScreen tính toán
            isCritical: question.isCritical,
        }));

        setIsModalVisible(false);
        router.push({
            pathname: '/testscreen/result',
            params: {
                rawData: JSON.stringify(rawData), // Gửi dữ liệu thô
                totalQuestions: questions.length,
                testName: title,
                id: id,
                licenseName: licenseName,
            },
        });
    };

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <View style={styles.container}>
            {/* Header */}
            {/* <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Icon name="arrow-left" size={22} color="#007AFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{title}</Text>
            </View> */}

            {/* Question */}
            {currentQuestion && (
                <View style={styles.questionContainer}>
                    <ScrollView style={styles.questionScroll} contentContainerStyle={styles.questionScrollContent}>
                        <Text style={styles.questionText}>
                            Câu hỏi {currentQuestionIndex + 1}/{questions.length}:
                        </Text>
                        <Text style={styles.questionText}>{currentQuestion.content}</Text>
                        {currentQuestion.imageName && (
                            <Image
                                source={{ uri: `https://daotaolaixebd.com/app/uploads/${currentQuestion.imageName}` }}
                                style={styles.questionImage}
                            />
                        )}
                    </ScrollView>
                    {JSON.parse(currentQuestion.options).map((option: string, index: number) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.answerButton,
                                selectedAnswers[currentQuestion.id] === index && styles.selectedAnswerButton,
                            ]}
                            onPress={() => handleAnswerSelect(currentQuestion.id, index)}
                        >
                            <View style={styles.optionRow}>
                                <View style={[
                                    styles.checkbox,
                                    selectedAnswers[currentQuestion.id] === index && { backgroundColor: '#007AFF' }
                                ]}>
                                    {selectedAnswers[currentQuestion.id] === index && <Text style={styles.checkboxTick}>✓</Text>}
                                </View>
                                <Text style={styles.answerText}>
                                    {option}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* Navigation */}
            <View style={styles.navigationContainer}>
                <TouchableOpacity
                    style={[styles.navButton, currentQuestionIndex === 0 && styles.disabledNavButton]}
                    onPress={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                >
                    <Text style={styles.navButtonText}>Câu Trước</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Nộp Bài</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.navButton,
                        currentQuestionIndex === questions.length - 1 && styles.disabledNavButton,
                    ]}
                    onPress={handleNextQuestion}
                    disabled={currentQuestionIndex === questions.length - 1}
                >
                    <Text style={styles.navButtonText}>Câu Tiếp</Text>
                </TouchableOpacity>
            </View>

            {/* Modal for Confirmation */}
            <Modal visible={isModalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Xác Nhận Nộp Bài</Text>
                        <FlatList
                            data={questions}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.modalQuestionContainer}>
                                    <Text style={styles.modalQuestionText}>
                                        {item.number}. {item.content}
                                    </Text>
                                    <Text style={styles.modalAnswerText}>
                                        Đáp án của bạn:{' '}
                                        {selectedAnswers[item.id] !== undefined
                                            ? JSON.parse(item.options)[selectedAnswers[item.id]]
                                            : 'Chưa chọn'}
                                    </Text>
                                </View>
                            )}
                        />
                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => setIsModalVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalButton} onPress={confirmSubmit}>
                                <Text style={styles.modalButtonText}>Xác Nhận</Text>
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
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#fff' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
    questionContainer: { flex: 1, padding: 20 },
    questionText: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
    answerButton: { padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 10, backgroundColor: '#fff' },
    selectedAnswerButton: { backgroundColor: '#E3F2FD', borderColor: '#007AFF' },
    answerText: { fontSize: 16, color: '#333' },
    navigationContainer: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff' },
    navButton: { paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#007AFF', borderRadius: 8 },
    disabledNavButton: { backgroundColor: '#ccc' },
    navButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    submitButton: { backgroundColor: '#28A745', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
    submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    modalContent: { width: '90%', backgroundColor: '#fff', borderRadius: 8, padding: 20, maxHeight: '80%' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
    questionImage: { width: '100%', height: 200, resizeMode: 'contain', marginBottom: 15 },
    questionScroll: { maxHeight: 320, marginBottom: 15 },
    questionScrollContent: { paddingBottom: 10 },
    modalQuestionContainer: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    modalQuestionText: { fontSize: 14, fontWeight: 'bold', marginBottom: 5 },
    modalAnswerText: { fontSize: 14, color: '#333' },
    modalActions: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
    modalButton: { backgroundColor: '#007AFF', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
    modalButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
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
        borderRadius: 4, // Rounded corners for better visibility
    },
    checkboxTick: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },

});

export default ExamScreen;