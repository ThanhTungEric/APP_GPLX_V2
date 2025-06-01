import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, TextStyle } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getQuestionById } from '../../database/questions';

interface Question {
    id: number;
    content: string;
    options: string;
    correctAnswerIndex: number;
    isCritical: boolean;
    number: number;
    imageName?: string;
    chapterId: number;
}

const QuestionDetailsScreen = () => {
    const router = useRouter();
    const params = useLocalSearchParams();

    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const selectedAnswer = Array.isArray(params.selectedAnswer) ? params.selectedAnswer[0] : params.selectedAnswer;
    const isCorrect = params.isCorrect === 'true';

    const [questionData, setQuestionData] = useState<Question | null>(null);

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const questionId = parseInt(id as string);
                if (!isNaN(questionId)) {
                    const result = await getQuestionById(questionId);
                    if (result) {
                        setQuestionData({
                            ...result,
                            isCritical: !!result.isCritical,
                        });
                    } else {
                        console.error('No question found for id:', questionId);
                    }
                }
            } catch (error) {
                console.error('Error fetching question:', error);
            }
        };

        fetchQuestion();
    }, [id]);

    const questionContent = questionData?.content || 'Đang tải...';
    const options = questionData?.options ? JSON.parse(questionData.options) : [];
    const correctAnswerIndex = questionData?.correctAnswerIndex ?? -1;
    const selectedAnswerIndex = options.indexOf(selectedAnswer);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <MaterialCommunityIcons name="arrow-left" size={28} color="#007AFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>CHI TIẾT CÂU HỎI</Text>
                    <View style={styles.headerRight} />
                </View>
                <View style={styles.divider} />
            </View>

            {/* Question Details */}
            <View style={styles.content}>
                <Text style={styles.questionText}>
                    {id}. {questionContent}
                </Text>
                <Text style={isCorrect ? styles.correctText : styles.incorrectText}>
                    {isCorrect ? 'Bạn đã trả lời đúng!' : 'Bạn đã trả lời sai.'}
                </Text>
                <View style={styles.optionsContainer}>
                    {options.map((option: string, index: number) => {
                        const isCorrectOption = index === correctAnswerIndex;
                        const isSelectedOption = index === selectedAnswerIndex;

                        let textStyle: StyleProp<TextStyle> = styles.optionText; // Khởi tạo mặc định
                        if (isCorrectOption) {
                            textStyle = [styles.optionText, styles.correctOptionText]; // Đáp án đúng: xanh lá
                        } else if (isSelectedOption && !isCorrect) {
                            textStyle = [styles.optionText, styles.selectedOptionText]; // Đáp án chọn sai: xanh dương
                        }

                        return (
                            <Text key={index} style={textStyle}>
                                {String.fromCharCode(65 + index)}. {option}
                            </Text>
                        );
                    })}
                </View>
                <Text style={styles.explanationText}>
                    Đây là lời giải thích chi tiết về đáp án đúng (có thể thay bằng dữ liệu động).
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 10 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    headerLeft: { width: 22, alignItems: 'flex-start' },
    headerRight: { width: 22 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', flex: 1, color: '#333' },
    divider: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 10 },
    content: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    questionText: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
    correctText: { fontSize: 16, color: 'green', fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
    incorrectText: { fontSize: 16, color: 'red', fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
    optionsContainer: {
        marginBottom: 15,
    },
    optionText: {
        fontSize: 16,
        color: '#666', // Màu mặc định cho các đáp án không được chọn
        marginBottom: 5,
    },
    correctOptionText: {
        color: 'green', // Màu cho đáp án đúng
        fontWeight: 'bold',
    },
    selectedOptionText: {
        color: '#007AFF', // Màu cho đáp án người dùng chọn (nếu sai)
    },
    explanationText: { fontSize: 14, color: '#666', marginTop: 10 },
});

export default QuestionDetailsScreen;