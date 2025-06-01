import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  PanResponder,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getAllSavedQuestions } from '../database/savequestion';
import { getQuestionsByIds } from '../database/questions';
import { getImageSource } from '../utils/getImageSource';

const SavedQuestionsScreen = () => {
  type Question = {
    id: number;
    content: string;
    options: string;
    correctAnswerIndex: number;
    imageName?: string;
    explain?: string;
    number: number;
  };

  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const translateX = useState(new Animated.Value(0))[0];

  useEffect(() => {
    async function fetchSavedQuestions() {
      try {
        const saved = await getAllSavedQuestions();
        const ids = saved.map((item) => item.questionId);
        const questionsFromDb = await getQuestionsByIds(ids);
        setQuestions(questionsFromDb);
      } catch (error) {
        console.error('Error loading saved questions:', error);
      }
    }
    fetchSavedQuestions();
  }, []);

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

  const currentQuestion = questions[currentIndex];

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.push('/')}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Không có câu hỏi đã lưu.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/')}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>CÂU HỎI ĐÃ LƯU</Text>
      </View>

      <Animated.ScrollView style={[styles.questionContainer, { transform: [{ translateX }] }]}>
        <View style={styles.questionHeader}>
          <Text style={styles.questionContent}>
            Câu {currentQuestion.number}: {currentQuestion.content}
          </Text>
          <MaterialIcons name="bookmark" size={28} color="#4CAF50" />
        </View>

        {currentQuestion.imageName && (
          <Image
            source={getImageSource(currentQuestion.imageName, currentQuestion.number)}
            style={styles.questionImage}
          />
        )}

        <View style={styles.optionsContainer}>
          {JSON.parse(currentQuestion.options).map((option: string, index: number) => {
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
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 17, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', flex: 1 },
  questionContainer: { flex: 1, marginBottom: 20, padding: 5, backgroundColor: 'transparent' },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  questionContent: { fontSize: 17, flex: 1, marginRight: 10, fontWeight: 'bold' },
  optionsContainer: { marginTop: 10 },
  option: { marginBottom: 5, padding: 10, backgroundColor: '#F4F4F4', borderRadius: 5 },
  optionText: { fontSize: 16.5 },
  correctOption: { backgroundColor: '#D4EDDA' },
  incorrectOption: { backgroundColor: '#F8D7DA' },
  navigationContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  navButton: { padding: 10, borderRadius: 10, flexDirection: 'row', alignItems: 'center' },
  questionImage: { width: '100%', height: 200, resizeMode: 'contain', marginVertical: 10 },
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
});

export default SavedQuestionsScreen;
