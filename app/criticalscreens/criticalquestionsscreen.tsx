import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
  Animated,
} from 'react-native';
import { getCriticalQuestions, Question } from '../../database/questions';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CriticalQuestionsScreen = () => {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const translateX = useState(new Animated.Value(0))[0];
  const [isSwiping, setIsSwiping] = useState(false);

  useEffect(() => {
    async function fetchCriticalQuestions() {
      try {
        const data = await getCriticalQuestions();
        setQuestions(data || []);
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
    if (currentQuestionIndex < questions.length - 1) {
      setSelectedAnswer(null);
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setSelectedAnswer(null);
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) =>
      Math.abs(gestureState.dx) > 20 && !isSwiping,
    onPanResponderGrant: () => setIsSwiping(true),
    onPanResponderMove: (_, gestureState) => {
      translateX.setValue(gestureState.dx);
    },
    onPanResponderRelease: (_, gestureState) => {
      const threshold = 100;
      if (gestureState.dx > threshold && currentQuestionIndex > 0) {
        Animated.timing(translateX, {
          toValue: 500,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          setCurrentQuestionIndex((prev) => prev - 1);
          translateX.setValue(-500);
          Animated.timing(translateX, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start(() => setIsSwiping(false));
        });
      } else if (
        gestureState.dx < -threshold &&
        currentQuestionIndex < questions.length - 1
      ) {
        Animated.timing(translateX, {
          toValue: -500,
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

  // ✅ Nếu không có câu hỏi → render header + thông báo
  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/')}>
            <MaterialCommunityIcons name="arrow-left" size={28} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.title}>CÂU HỎI ĐIỂM LIỆT</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.title}>Không có câu hỏi điểm liệt nào.</Text>
        </View>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const options = JSON.parse(currentQuestion.options ?? '[]') as string[];

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/')}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#007AFF" />
        </TouchableOpacity>
      </View>
      <Animated.View style={{ transform: [{ translateX }] }}>
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>
            {currentQuestion.number}. {currentQuestion.content}
          </Text>

          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedAnswer !== null &&
                index === currentQuestion.correctAnswerIndex && {
                  backgroundColor: '#E8F5E9',
                },
                selectedAnswer !== null &&
                selectedAnswer !== currentQuestion.correctAnswerIndex &&
                selectedAnswer === index && {
                  backgroundColor: '#FFEBEE',
                },
              ]}
              onPress={() => handleAnswerSelect(index)}
              disabled={selectedAnswer !== null}
            >
              <View style={styles.optionRow}>
                <Text style={styles.optionText}>{index + 1}. {option}</Text>
              </View>
            </TouchableOpacity>
          ))}

          {selectedAnswer !== null && currentQuestion.explain && (
            <View style={styles.explainContainer}>
              <Text style={styles.explainTitle}>Giải thích:</Text>
              <Text style={styles.explainText}>{currentQuestion.explain}</Text>
            </View>
          )}

          {currentQuestionIndex === questions.length - 1 && (
            <Text style={styles.endText}>Bạn đã hoàn thành tất cả câu hỏi!</Text>
          )}
        </View>
      </Animated.View>

      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          {[...Array(3)].map((_, i) => (
            <MaterialCommunityIcons
              key={i}
              name="chevron-left"
              size={30}
              color={currentQuestionIndex === 0 ? "#999" : "#233646"}
            />
          ))}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={handleNextQuestion}
          disabled={currentQuestionIndex === questions.length - 1}
        >
          {[...Array(3)].map((_, i) => (
            <MaterialCommunityIcons
              key={i}
              name="chevron-right"
              size={30}
              color={currentQuestionIndex === questions.length - 1 ? "#999" : "#1c84c6"}
            />
          ))}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 10 },
  title: { fontSize: 18, fontWeight: 'bold' },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 10, justifyContent: "space-between" },
  questionCard: { padding: 15, backgroundColor: 'transparent', borderRadius: 10, marginBottom: 10 },
  questionText: { fontSize: 17, color: '#333', marginBottom: 10, fontWeight: 'bold' },
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
  optionText: {
    fontSize: 16.5,
    color: '#333',
  },
  navigationContainer: { flexDirection: 'row', justifyContent: 'space-between', padding: 15 },
  navButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  navButtonText: { color: '#111', fontWeight: 'bold' },
  endText: { marginTop: 20, fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: '#333' },
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

export default CriticalQuestionsScreen;
