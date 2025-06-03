import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import { getAllSavedQuestions } from '../database/savequestion';
import { getQuestionsByIds } from '../database/questions';
import { getImageSource } from '../utils/getImageSource';

const SCREEN_WIDTH = Dimensions.get('window').width;

const SavedQuestionsScreen = () => {
  const router = useRouter();

  type Question = {
    id: number;
    content: string;
    options: string;
    correctAnswerIndex: number;
    imageName?: string;
    explain?: string;
    number: number;
  };

  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

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
      try {
        const saved = await getAllSavedQuestions();
        const ids = saved.map((item) => item.questionId);
        const result = await getQuestionsByIds(ids);
        setQuestions(result);
      } catch (error) {
        console.error('Error loading saved questions:', error);
      }
    }
    fetchData();
  }, []);

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const renderItem = ({ item }: { item: Question }) => {
    const selected = selectedAnswers[item.id];
    const options = JSON.parse(item.options);

    return (
      <View style={{ width: SCREEN_WIDTH, padding: 15 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.questionNumber}>Câu {item.number}</Text>

          <View style={styles.questionHeader}>
            <Text style={styles.questionContent}>{item.content}</Text>
            <MaterialIcons name="bookmark" size={28} color="#4CAF50" />
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

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Không có câu hỏi đã lưu.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>CÂU HỎI ĐÃ LƯU</Text>
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
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  title: { fontSize: 17, fontWeight: 'bold', marginLeft: 10 },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  questionContent: { fontSize: 17, flex: 1, marginRight: 10, fontWeight: 'bold' },
  questionNumber: { fontSize: 17 },
  answerButton: { padding: 10, borderWidth: 1, borderColor: '#ccc', marginBottom: 10, borderRadius: 5 },
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
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  navButton: {
    padding: 15,
    alignItems: 'center',
    flex: 1,
    flexDirection: "row",
    justifyContent: 'center',
  },
});

export default SavedQuestionsScreen;
