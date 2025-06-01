import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getCriticalQuestions, Question } from '../../database/questions';

const CriticalQuestionsScreen = () => {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const translateX = useState(new Animated.Value(0))[0];

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getCriticalQuestions();
        setQuestions(data || []);
      } catch (error) {
        console.error('Error fetching critical questions:', error);
      }
    }
    fetchData();
  }, []);

  const currentQuestion = questions[currentIndex];
  const options = JSON.parse(currentQuestion?.options ?? '[]') as string[];

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
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
          setSelectedOption(null);
          translateX.setValue(-500);
          Animated.timing(translateX, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => setIsSwiping(false));
        });
      } else if (gestureState.dx < -threshold && currentIndex < questions.length - 1) {
        Animated.timing(translateX, { toValue: -500, duration: 200, useNativeDriver: true }).start(() => {
          setCurrentIndex((prev) => prev + 1);
          setSelectedOption(null);
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
            Câu {currentQuestion.number}: {currentQuestion.content}
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          {options.map((option, index) => {
            const isCorrect = index === currentQuestion.correctAnswerIndex;
            const isSelected = index === selectedOption;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.option,
                  selectedOption !== null && isCorrect && styles.correctOption,
                  selectedOption !== null && isSelected && !isCorrect && styles.incorrectOption,
                ]}
                onPress={() => handleOptionSelect(index)}
                disabled={selectedOption !== null}
              >
                <Text style={styles.optionText}>{index + 1}. {option}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedOption !== null && currentQuestion.explain && (
          <View style={styles.explainContainer}>
            <Text style={styles.explainTitle}>Giải thích:</Text>
            <Text style={styles.explainText}>{currentQuestion.explain}</Text>
          </View>
        )}

        {currentIndex === questions.length - 1 && (
          <Text style={styles.endText}>🎉 Bạn đã hoàn thành tất cả câu hỏi!</Text>
        )}
      </Animated.ScrollView>

      <View style={styles.navigationContainer}>
        <View style={styles.navigationButtons}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  header: { flexDirection: "row", alignItems: "center" },
  title: { fontSize: 17, fontWeight: 'bold', textAlign: 'center', flex: 1 },
  questionContainer: { flex: 1, marginBottom: 20, padding: 5, backgroundColor: 'transparent', borderRadius: 10 },
  questionHeader: { marginBottom: 10 },
  questionContent: { fontSize: 17, fontWeight: 'bold' },
  optionsContainer: { marginTop: 10 },
  option: { marginBottom: 5, padding: 10, backgroundColor: '#F4F4F4', borderRadius: 5 },
  optionText: { fontSize: 16.5, color: '#333' },
  correctOption: { backgroundColor: '#D4EDDA' },
  incorrectOption: { backgroundColor: '#F8D7DA' },
  explainContainer: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#FFF3CD',
    borderRadius: 5,
    borderLeftWidth: 5,
    borderLeftColor: '#FFEEBA',
  },
  explainTitle: { fontWeight: 'bold', marginBottom: 5, fontSize: 16 },
  explainText: { fontSize: 15.5, lineHeight: 22 },
  endText: { marginTop: 20, fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: '#333' },
  navigationContainer: { justifyContent: 'flex-end', marginBottom: 10 },
  navigationButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  navButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default CriticalQuestionsScreen;
