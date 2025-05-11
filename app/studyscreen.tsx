import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  PanResponder,
  Animated,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import { getQuestionsByChapter } from './database/questions';
import {
  insertSavedQuestion,
  getSavedQuestionByQuestionId,
  deleteSavedQuestionById,
} from './database/savequestion';
import {
  insertHistoryQuestion,
  updateHistoryQuestion,
  getHistoryByQuestionId,
  clearAllHistory,
} from './database/historyquestion';

const StudyScreen = () => {
  const router = useRouter();
  const { id, title } = useLocalSearchParams();

  type Question = {
    id: number;
    content: string;
    options: string;
    correctAnswerIndex: number;
    imageName?: string;
    explain?: string;
    number: number;
    isCritical: number;
  };

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false);
  const translateX = useState(new Animated.Value(0))[0];

  useEffect(() => {
    async function fetchQuestions() {
      try {
        await clearAllHistory(); // Xóa lịch sử
        const chapterQuestions = await getQuestionsByChapter(Number(id));
        setQuestions(chapterQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    }
    fetchQuestions();
  }, [id]);

  useEffect(() => {
    async function checkStatus() {
      const question = questions[currentIndex];
      if (!question) return;

      const saved = await getSavedQuestionByQuestionId(question.id);
      setIsSaved(!!saved);

      const history = await getHistoryByQuestionId(question.id);
      if (history?.selectedOption !== null && history?.selectedOption !== undefined) {
        setSelectedOption(history.selectedOption);
      } else {
        setSelectedOption(null);
      }
    }
    checkStatus();
  }, [currentIndex, questions]);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 20 && !isSwiping,
    onPanResponderGrant: () => setIsSwiping(true),
    onPanResponderMove: (_, gestureState) => {
      translateX.setValue(gestureState.dx);
    },
    onPanResponderRelease: (_, gestureState) => {
      const threshold = 100;
      if (gestureState.dx > threshold && currentIndex > 0) {
        Animated.timing(translateX, {
          toValue: 500,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          setCurrentIndex((prev) => prev - 1);
          translateX.setValue(-500);
          Animated.timing(translateX, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start(() => setIsSwiping(false));
        });
      } else if (gestureState.dx < -threshold && currentIndex < questions.length - 1) {
        Animated.timing(translateX, {
          toValue: -500,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          setCurrentIndex((prev) => prev + 1);
          translateX.setValue(500);
          Animated.timing(translateX, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start(() => setIsSwiping(false));
        });
      } else {
        Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start(() => setIsSwiping(false));
      }
    },
  });

  const handleOptionSelect = async (index: number) => {
    setSelectedOption(index);
    const question = questions[currentIndex];
    const existing = await getHistoryByQuestionId(question.id);
    if (existing) {
      await updateHistoryQuestion(question.id, index);
    } else {
      await insertHistoryQuestion(question.id, index);
    }
  };

  const handleSaveQuestion = async () => {
    const question = questions[currentIndex];
    const existing = await getSavedQuestionByQuestionId(question.id);
    if (existing) {
      await deleteSavedQuestionById(existing.id);
      setIsSaved(false);
    } else {
      await insertSavedQuestion(question.id);
      setIsSaved(true);
    }
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Text style={styles.title}>{title}</Text>
      {questions.length > 0 ? (
        <Animated.ScrollView style={[styles.questionContainer, { transform: [{ translateX }] }]}>
          <View style={styles.questionHeader}>
            <Text style={styles.questionContent}>
              Câu {questions[currentIndex].number}: {questions[currentIndex].content}
            </Text>
            <TouchableOpacity onPress={handleSaveQuestion}>
              <MaterialIcons
                name={isSaved ? 'bookmark' : 'bookmark-border'}
                size={28}
                color={isSaved ? '#4CAF50' : '#888'}
              />
            </TouchableOpacity>
          </View>

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

          {selectedOption !== null && questions[currentIndex].explain && (
            <View style={styles.explainContainer}>
              <Text style={styles.explainTitle}>Giải thích:</Text>
              <Text style={styles.explainText}>{questions[currentIndex].explain}</Text>
            </View>
          )}
        </Animated.ScrollView>
      ) : (
        <Text>Không có câu hỏi nào.</Text>
      )}

      <View style={styles.navigationContainer}>
        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={[styles.navButton, currentIndex === 0 && styles.disabledButton]}
            onPress={() => setCurrentIndex(currentIndex - 1)}
            disabled={currentIndex === 0}
          >
            <Text style={styles.navButtonText}>Trước</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navButton, currentIndex === questions.length - 1 && styles.disabledButton]}
            onPress={() => setCurrentIndex(currentIndex + 1)}
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
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 5, textAlign: 'center' },
  questionContainer: { flex: 1, marginBottom: 20, padding: 5, backgroundColor: 'transparent', borderRadius: 10 },
  questionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  questionContent: { fontSize: 17, flex: 1, marginRight: 10, fontWeight: 'bold' },
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
  explainContainer: { marginTop: 15, padding: 10, backgroundColor: '#FFF3CD', borderRadius: 5, borderLeftWidth: 5, borderLeftColor: '#FFEEBA' },
  explainTitle: { fontWeight: 'bold', marginBottom: 5, fontSize: 16 },
  explainText: { fontSize: 15.5, lineHeight: 22 },
});

export default StudyScreen;
