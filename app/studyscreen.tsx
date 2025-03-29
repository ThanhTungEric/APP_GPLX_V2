import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getQuestionsByChapter } from './database/questions';

const StudyScreen = () => {
    const router = useRouter();
    const { id, title } = useLocalSearchParams();
    // Define the Question type
    type Question = {
        id: number;
        content: string;
        options: string; // Options as a JSON string
        correctAnswerIndex: number; // Index of the correct answer
        imageName?: string; // Optional property for the image name
    };

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
            setSelectedOption(null); // Reset lựa chọn khi quay lại câu hỏi trước
        }
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedOption(null); // Reset lựa chọn khi chuyển sang câu hỏi mới
        }
    };

    const handleOptionSelect = (index: number) => {
        setSelectedOption(index); // Lưu lại đáp án được chọn
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ôn tập: {title}</Text>
            {questions.length > 0 ? (
                <View style={styles.questionContainer}>
                    <Text style={styles.questionNumber}>Câu {currentIndex + 1}:</Text>
                    <Text style={styles.questionContent}>{questions[currentIndex].content}</Text>
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
                                <Text>{index + 1}. {option}</Text>
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
    container: { flex: 1, padding: 20, backgroundColor: '#F8F9FA' },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
    questionContainer: { flex: 1, marginBottom: 20, padding: 15, backgroundColor: 'transparent', borderRadius: 10 },
    questionNumber: { fontWeight: 'bold', marginBottom: 5 },
    questionContent: { fontSize: 16, marginBottom: 10 },
    optionsContainer: { marginTop: 10 },
    option: { fontSize: 16, marginBottom: 5, padding: 10, backgroundColor: '#F4F4F4', borderRadius: 5 },
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
