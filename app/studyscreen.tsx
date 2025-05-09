import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getQuestionsByChapter } from './database/questions';
import { insertSavedQuestion, getSavedQuestionByQuestionId } from "./database/savequestion";

const StudyScreen = () => {
    const router = useRouter();
    const { id, title } = useLocalSearchParams();

    // Define the Question type
    type Question = {
        id: number;
        content: string;
        options: string; // Options as a JSON string
        correctAnswerIndex: number;
        imageName?: string;
        explain?: string; // Thêm trường explain
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
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            {questions.length > 0 ? (
                <ScrollView style={styles.questionContainer}>
                    <Text style={styles.questionContent}>Câu {currentIndex + 1}: {questions[currentIndex].content}</Text>

                    {questions[currentIndex].imageName && (
                        <Image
                            source={{ uri: `https://daotaolaixebd.com/app/uploads/${questions[currentIndex].imageName}` }}
                            style={styles.questionImage}
                        />
                    )}

                    <View style={styles.optionsContainer}>
                        {JSON.parse(questions[currentIndex].options).map((option: string, index: number) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.option,
                                    selectedOption !== null && index === questions[currentIndex].correctAnswerIndex && styles.correctOption,
                                    selectedOption !== null && index === selectedOption && index !== questions[currentIndex].correctAnswerIndex && styles.incorrectOption,
                                ]}
                                onPress={() => handleOptionSelect(index)}
                                disabled={selectedOption !== null}
                            >
                                <Text style={styles.optionText}>{index + 1}. {option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* ✅ Hiển thị giải thích sau khi chọn đáp án */}
                    {selectedOption !== null && questions[currentIndex].explain && (
                        <View style={styles.explainContainer}>
                            <Text style={styles.explainTitle}>Giải thích:</Text>
                            <Text style={styles.explainText}>{questions[currentIndex].explain}</Text>
                        </View>
                    )}
                </ScrollView>
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
    questionContent: { fontSize: 17, marginBottom: 10 },
    optionsContainer: { marginTop: 10 },
    option: { marginBottom: 5, padding: 10, backgroundColor: '#F4F4F4', borderRadius: 5 },
    optionText: { fontSize: 16.5 },
    correctOption: { backgroundColor: '#D4EDDA' },
    incorrectOption: { backgroundColor: '#F8D7DA' },
    navigationContainer: { justifyContent: 'flex-end', marginBottom: 10 },
    navigationButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
    navButton: { padding: 15, backgroundColor: '#007AFF', borderRadius: 10, alignItems: 'center', flex: 1, marginHorizontal: 5 },
    disabledButton: { backgroundColor: '#ccc' },
    navButtonText: { color: '#fff', fontWeight: 'bold' },
    questionImage: { width: '100%', height: 200, resizeMode: 'contain', marginVertical: 10 },
    // ✅ Thêm style cho phần giải thích
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

export default StudyScreen;
