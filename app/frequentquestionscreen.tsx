import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  PanResponder,
  Animated,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { getFrequentMistakes } from '../database/frequentmistakes';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

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

const FrequentQuestionScreen = () => {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isSwiping, setIsSwiping] = useState(false);
  const translateX = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mistakes = await getFrequentMistakes();
        const mapped = mistakes.map((item) => {
          let options: string[] = [];
          try {
            options = JSON.parse(item.options);
          } catch (e) {
            console.error('Error parsing options:', e);
          }

          return {
            id: item.questionId,
            question: item.content,
            answers: options.map((opt: string, idx: number) => ({
              id: String.fromCharCode(65 + idx),
              text: opt.trim(),
            })),
            correct: String.fromCharCode(65 + item.correctAnswerIndex),
            image: item.imageName
              ? `https://daotaolaixebd.com/app/uploads/${item.imageName}`
              : undefined,
          };
        });

        setQuestions(mapped);
      } catch (error) {
        console.error('Error fetching mistakes:', error);
      }
    };

    fetchData();
  }, []);

  const handleAnswerSelect = (questionId: number, answerId: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 20 && !isSwiping,
    onPanResponderGrant: () => setIsSwiping(true),
    onPanResponderMove: (_, gestureState) => {
      translateX.setValue(gestureState.dx);
    },
    onPanResponderRelease: (_, gestureState) => {
      const threshold = 100;
      if (gestureState.dx > threshold && currentIndex > 0) {
        Animated.timing(translateX, { toValue: 500, duration: 200, useNativeDriver: true }).start(() => {
          setCurrentIndex((prev) => prev - 1);
          translateX.setValue(-500);
          Animated.timing(translateX, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => setIsSwiping(false));
        });
      } else if (gestureState.dx < -threshold && currentIndex < questions.length - 1) {
        Animated.timing(translateX, { toValue: -500, duration: 200, useNativeDriver: true }).start(() => {
          setCurrentIndex((prev) => prev + 1);
          translateX.setValue(500);
          Animated.timing(translateX, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => setIsSwiping(false));
        });
      } else {
        Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start(() => setIsSwiping(false));
      }
    },
  });

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.push('/')}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Không có câu hỏi thường sai nào.</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentIndex];
  const userAnswer = selectedAnswers[currentQuestion.id];

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/')}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <Animated.ScrollView style={[styles.questionContainer, { transform: [{ translateX }] }]}>
        <View style={styles.questionHeader}>
          <Text style={styles.questionContent}>
            Câu {currentIndex + 1}/{questions.length}: {currentQuestion.question}
          </Text>
        </View>

        {currentQuestion.image && (
          <Image source={{ uri: currentQuestion.image }} style={styles.questionImage} />
        )}

        <View style={styles.optionsContainer}>
          {currentQuestion.answers.map((answer) => {
            const isCorrect = answer.id === currentQuestion.correct;
            const isSelected = answer.id === userAnswer;
            return (
              <TouchableOpacity
                key={answer.id}
                style={[
                  styles.option,
                  userAnswer && isCorrect && styles.correctOption,
                  userAnswer && isSelected && !isCorrect && styles.incorrectOption,
                ]}
                onPress={() => handleAnswerSelect(currentQuestion.id, answer.id)}
                disabled={!!userAnswer}
              >
                <Text style={styles.optionText}>
                  {answer.id}. {answer.text}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {userAnswer && (
          <Text style={styles.resultText}>
            {userAnswer === currentQuestion.correct
              ? '✅ Chính xác!'
              : `❌ Sai, đáp án đúng là ${currentQuestion.correct}`}
          </Text>
        )}
      </Animated.ScrollView>

      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => setCurrentIndex((prev) => prev - 1)}
          disabled={currentIndex === 0}
        >
          <MaterialCommunityIcons name="chevron-left" size={30} color={currentIndex === 0 ? "#999" : "#1c84c6"} />
          <MaterialCommunityIcons name="chevron-left" size={30} color={currentIndex === 0 ? "#999" : "#1c84c6"} />
          <MaterialCommunityIcons name="chevron-left" size={30} color={currentIndex === 0 ? "#999" : "#1c84c6"} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => setCurrentIndex((prev) => prev + 1)}
          disabled={currentIndex === questions.length - 1}
        >
          <MaterialCommunityIcons name="chevron-right" size={30} color={currentIndex === questions.length - 1 ? "#999" : "#1c84c6"} />
          <MaterialCommunityIcons name="chevron-right" size={30} color={currentIndex === questions.length - 1 ? "#999" : "#1c84c6"} />
          <MaterialCommunityIcons name="chevron-right" size={30} color={currentIndex === questions.length - 1 ? "#999" : "#1c84c6"} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  header: { flexDirection: "row", alignItems: "center" },
  title: { fontSize: 17, fontWeight: 'bold', marginTop: 20, textAlign: 'center' },
  questionContainer: { flex: 1, padding: 10, backgroundColor: 'transparent' },
  questionHeader: { marginBottom: 10 },
  questionContent: { fontSize: 17, fontWeight: 'bold' },
  questionImage: { width: '100%', height: 200, resizeMode: 'contain', marginVertical: 10 },
  optionsContainer: { marginTop: 10 },
  option: { marginBottom: 5, padding: 10, backgroundColor: '#F4F4F4', borderRadius: 5 },
  optionText: { fontSize: 16.5 },
  correctOption: { backgroundColor: '#D4EDDA' },
  incorrectOption: { backgroundColor: '#F8D7DA' },
  resultText: { marginTop: 10, fontSize: 15, fontWeight: 'bold', color: '#007AFF' },
  navigationContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  navButton: { padding: 10, borderRadius: 10, flexDirection: 'row', alignItems: 'center' },
});

export default FrequentQuestionScreen;
