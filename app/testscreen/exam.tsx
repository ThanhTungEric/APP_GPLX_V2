import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal, ScrollView, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';

const ExamScreen = () => {
    const router = useRouter();
    const { id, title } = useLocalSearchParams();

    useEffect(() => {
        if (id) {
            const questionIndex = questions.findIndex((q) => q.id === Number(id));
            if (questionIndex !== -1) {
                setCurrentQuestionIndex(questionIndex);
            }
        }
    }, [id]);

    const questions = [
        {
            id: 1,
            question: "Câu hỏi 1: Đây là nội dung câu hỏi có hình ảnh?",
            image: "https://png.pngtree.com/png-clipart/20240105/original/pngtree-traffic-stop-sign-symbol-photo-png-image_14019657.png", // Đường dẫn hình ảnh
            answers: [
                { id: 'A', text: 'Đáp án A' },
                { id: 'B', text: 'Đáp án B' },
                { id: 'C', text: 'Đáp án C' },
                { id: 'D', text: 'Đáp án D' }
            ]
        },
        {
            id: 2,
            question: "Câu hỏi 2: Đây là nội dung câu hỏi lý thuyết không có hình ảnh?",
            answers: [
                { id: 'A', text: 'Đáp án A' },
                { id: 'B', text: 'Đáp án B' },
                { id: 'C', text: 'Đáp án C' },
                { id: 'D', text: 'Đáp án D' }
            ]
        },
        // ...existing questions...
    ];

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
    const [isModalVisible, setIsModalVisible] = useState(false);

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

    const isAllAnswered = Object.keys(selectedAnswers).length === questions.length;

    const handleSubmit = () => {
        setIsModalVisible(true);
    };

    const confirmSubmit = () => {
        const results = questions.map((question) => ({
            id: question.id,
            question: question.question,
            selectedAnswer: selectedAnswers[question.id],
            correctAnswer: question.answers[0].id, // Giả sử đáp án đúng luôn là đáp án đầu tiên
            isCorrect: selectedAnswers[question.id] === question.answers[0].id,
        }));

        setIsModalVisible(false);
        router.push({
            pathname: '/testscreen/result',
            params: { results: JSON.stringify(results), totalQuestions: questions.length },
        });
    };

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Icon name="arrow-left" size={22} color="#007AFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{title}</Text>
            </View>

            {/* Question List */}
            <View style={styles.questionListContainer}>
                <FlatList
                    data={questions}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.questionListButton,
                                currentQuestionIndex === item.id - 1 && styles.activeQuestionListButton
                            ]}
                            onPress={() => setCurrentQuestionIndex(item.id - 1)}
                        >
                            <Text style={styles.questionListButtonText}>{item.id}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {/* Question */}
            <View style={styles.questionContainer}>
                <ScrollView style={styles.questionScroll} contentContainerStyle={styles.questionScrollContent}>
                    <Text style={styles.questionText}>{currentQuestion.question}</Text>
                    {currentQuestion.image && (
                        <Image source={{ uri: currentQuestion.image }} style={styles.questionImage} />
                    )}
                </ScrollView>
                {currentQuestion.answers.map((answer) => (
                    <TouchableOpacity
                        key={answer.id}
                        style={[
                            styles.answerButton,
                            selectedAnswers[currentQuestion.id] === answer.id && styles.selectedAnswerButton
                        ]}
                        onPress={() => handleAnswerSelect(currentQuestion.id, answer.id)}
                    >
                        <Text style={styles.answerText}>{answer.text}</Text>
                    </TouchableOpacity>
                ))}
            </View>

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
                    style={[styles.submitButton, !isAllAnswered && styles.disabledSubmitButton]}
                    onPress={handleSubmit}
                    disabled={!isAllAnswered}
                >
                    <Text style={styles.submitButtonText}>Nộp Bài</Text>
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


            {/* Modal for Confirmation */}
            <Modal visible={isModalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Xác Nhận Nộp Bài</Text>

                        {/* FlatList with 3 columns */}
                        <FlatList
                            data={questions}
                            keyExtractor={(item) => item.id.toString()}
                            numColumns={3}
                            renderItem={({ item }) => (
                                <View style={styles.modalItem}>
                                    <Text style={styles.modalQuestion}>
                                        {item.id}. {item.question}
                                    </Text>
                                    <Text style={styles.modalAnswer}>
                                        Đáp án: {selectedAnswers[item.id] || 'Chưa chọn'}
                                    </Text>
                                </View>
                            )}
                            contentContainerStyle={styles.modalList}
                        />

                        {/* Actions */}
                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => setIsModalVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={confirmSubmit}
                            >
                                <Text style={styles.modalButtonText}>Xác Nhận</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#fff' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
    questionContainer: { flex: 1, padding: 20 },
    questionText: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
    answerButton: { padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 10, backgroundColor: '#fff' },
    selectedAnswerButton: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
    answerText: { fontSize: 16, color: '#333' },
    navigationContainer: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff' },
    navButton: { paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#007AFF', borderRadius: 8 },
    disabledNavButton: { backgroundColor: '#ccc' },
    navButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    questionListContainer: { paddingVertical: 10, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#ccc' },
    questionListButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginHorizontal: 5, backgroundColor: '#ccc' },
    activeQuestionListButton: { backgroundColor: '#007AFF' },
    questionListButtonText: { color: '#fff', fontWeight: 'bold' },
    submitContainer: { padding: 15, backgroundColor: '#fff', alignItems: 'center' },
    submitButton: { backgroundColor: '#28A745', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
    disabledSubmitButton: { backgroundColor: '#ccc' },
    submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    modalContent: { width: '90%', backgroundColor: '#fff', borderRadius: 8, padding: 20, maxHeight: '80%' },
    modalList: { marginBottom: 15 },
    modalItem: { flex: 1, margin: 5, padding: 10, backgroundColor: '#f9f9f9', borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
    modalQuestion: { fontSize: 14, fontWeight: 'bold', marginBottom: 5 },
    modalAnswer: { fontSize: 12, color: '#333' },
    modalActions: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
    modalButton: { backgroundColor: '#007AFF', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
    modalButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
    questionImage: {
        width: '100%',
        height: 200,
        resizeMode: 'contain',
        marginBottom: 15,
    },
    questionScroll: {
        maxHeight: 320,
        marginBottom: 15,
    },
    questionScrollContent: {
        paddingBottom: 10,
    },
});

export default ExamScreen;
