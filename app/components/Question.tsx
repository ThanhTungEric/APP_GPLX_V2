import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';

interface QuestionProps {
    question: {
        id: number;
        question: string;
        image: string | null;
        answers: { id: string; text: string }[];
    };
    selectedAnswer: string | undefined;
    onSelectAnswer: (answerId: string) => void;
}

const Question: React.FC<QuestionProps> = ({ question, selectedAnswer, onSelectAnswer }) => {
    return (
        <View style={styles.questionContainer}>
            <ScrollView
                style={styles.questionScroll}
                contentContainerStyle={styles.questionScrollContent}
            >
                <Text style={styles.questionText}>{question.question}</Text>
                {question.image && (
                    <Image source={{ uri: question.image }} style={styles.questionImage} />
                )}
            </ScrollView>
            {question.answers.map((answer) => (
                <TouchableOpacity
                    key={answer.id}
                    style={[
                        styles.answerButton,
                        selectedAnswer === answer.id && styles.selectedAnswerButton,
                    ]}
                    onPress={() => onSelectAnswer(answer.id)}
                >
                    <Text style={styles.answerText}>{answer.text}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    questionContainer: { flex: 1, padding: 20 },
    questionText: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
    answerButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    selectedAnswerButton: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
    answerText: { fontSize: 16, color: '#333' },
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
        flexGrow: 1, // Đảm bảo nội dung có thể cuộn
        justifyContent: 'flex-start',
    },
});

export default Question;