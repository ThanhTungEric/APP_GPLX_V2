import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import { getImageSource } from '../utils/getImageSource';
import { getQuestionsByChapter } from '../database/questions';
import {
  insertSavedQuestion,
  getSavedQuestionByQuestionId,
  deleteSavedQuestionById,
} from '../database/savequestion';
import {
  insertHistoryQuestion,
  updateHistoryQuestion,
  getHistoryByQuestionId,
  clearAllHistory,
} from '../database/historyquestion';
import { saveCorrectQuestion } from '../database/questionprogress';

const SCREEN_WIDTH = Dimensions.get('window').width;

const StudyScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

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
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  useEffect(() => {
    async function fetchData() {
      await clearAllHistory();
      const data = await getQuestionsByChapter(Number(id));
      setQuestions(data);
    }
    fetchData();
  }, [id]);

  useEffect(() => {
    async function updateSaveStatus() {
      const q = questions[currentIndex];
      if (!q) return;
      const saved = await getSavedQuestionByQuestionId(q.id);
      setIsSaved(!!saved);

      const history = await getHistoryByQuestionId(q.id);
      if (history?.selectedOption !== null && history?.selectedOption !== undefined) {
        setSelectedAnswers(prev => ({
          ...prev,
          [q.id]: history.selectedOption as number
        }));
      }

    }

    updateSaveStatus();
  }, [currentIndex, questions]);

  const handleAnswerSelect = async (questionId: number, answerIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answerIndex }));

    const history = await getHistoryByQuestionId(questionId);
    if (history) {
      await updateHistoryQuestion(questionId, answerIndex);
    } else {
      await insertHistoryQuestion(questionId, answerIndex);
    }

    const question = questions.find(q => q.id === questionId);
    if (question && answerIndex === question.correctAnswerIndex) {
      await saveCorrectQuestion(questionId);
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

  const renderItem = ({ item, index }: { item: Question; index: number }) => {
    const selected = selectedAnswers[item.id];
    const options = JSON.parse(item.options);

    return (
      <View style={{ width: SCREEN_WIDTH, padding: 10}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.questionNumber}>Câu {item.number}</Text>

          <View style={styles.questionHeader}>
            <Text style={styles.questionContent}>{item.content}</Text>
            <TouchableOpacity onPress={handleSaveQuestion}>
              <MaterialIcons
                name={isSaved ? 'bookmark' : 'bookmark-border'}
                size={28}
                color={isSaved ? '#4CAF50' : '#888'}
              />
            </TouchableOpacity>
          </View>

          {item.imageName && (
            <Image
              source={getImageSource(item.imageName, item.number)}
              style={styles.questionImage}
            />
          )}

          <View style={{ marginTop: 10 }}>
            {options.map((opt: string, i: number) => {
              const isSelected = selected === i;
              const isCorrect = i === item.correctAnswerIndex;

              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => handleAnswerSelect(item.id, i)}
                  disabled={selected !== undefined}
                  style={[
                    styles.answerButton,
                    selected !== undefined && isCorrect && styles.correctOption,
                    selected !== undefined && isSelected && !isCorrect && styles.incorrectOption,
                  ]}
                >
                  <Text style={styles.answerText}>{i + 1}. {opt}</Text>
                </TouchableOpacity>
              );
            })}

          </View>

          {selected !== undefined && item.explain && (
            <View style={styles.explainContainer}>
              <Text style={styles.explainTitle}>Giải thích:</Text>
              <Text style={styles.explainText}>{item.explain}</Text>
            </View>
          )}

        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <Animated.FlatList
        ref={flatListRef}
        horizontal
        pagingEnabled
        data={questions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        showsHorizontalScrollIndicator={false}
      />

      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => {
            if (flatListRef.current && currentIndex > 0) {
              flatListRef.current.scrollToIndex({ index: currentIndex - 1, animated: true });
            }
          }}
          disabled={currentIndex === 0}
        >
          <MaterialCommunityIcons name="chevron-left" size={30} color={currentIndex === 0 ? "#999" : "#1c84c6"} />
          <MaterialCommunityIcons name="chevron-left" size={30} color={currentIndex === 0 ? "#999" : "#1c84c6"} />
          <MaterialCommunityIcons name="chevron-left" size={30} color={currentIndex === 0 ? "#999" : "#1c84c6"} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => {
            if (flatListRef.current && currentIndex < questions.length - 1) {
              flatListRef.current.scrollToIndex({ index: currentIndex + 1, animated: true });
            }
          }}
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
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10 },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  questionContent: { fontSize: 17, flex: 1, marginRight: 10, fontWeight: 'bold' },
  questionNumber: { fontSize: 17 },
  answerButton: { padding: 10, borderWidth: 1, borderColor: '#ccc', marginBottom: 10 },
  correctOption: { backgroundColor: '#D4EDDA', borderColor: '#28a745' },
  incorrectOption: { backgroundColor: '#F8D7DA', borderColor: '#dc3545' },
  answerText: { fontSize: 16 },
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
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: "center",
    backgroundColor: '#fff',
  },
  navButton: {
    padding: 15,
    alignItems: 'center',
    flexDirection: "row",
    justifyContent: 'space-around'
  },
});

export default StudyScreen;
