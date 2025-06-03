import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Animated,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getFrequentMistakes } from '../database/frequentmistakes';

const SCREEN_WIDTH = Dimensions.get('window').width;

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
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
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
    const fetchData = async () => {
      try {
        const mistakes = await getFrequentMistakes();

        // Lọc trùng theo questionId
        const uniqueMap = new Map<number, any>();
        for (const item of mistakes) {
          if (!uniqueMap.has(item.questionId)) uniqueMap.set(item.questionId, item);
        }

        const mapped: Question[] = Array.from(uniqueMap.values()).map((item) => {
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

  const renderItem = ({ item }: { item: Question }) => {
    const selected = selectedAnswers[item.id];

    return (
      <View style={{ width: SCREEN_WIDTH, padding: 15 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.questionNumber}>Câu {currentIndex + 1}/{questions.length}</Text>

          <View style={styles.questionHeader}>
            <Text style={styles.questionContent}>{item.question}</Text>
          </View>

          {item.image && (
            <Image source={{ uri: item.image }} style={styles.questionImage} />
          )}

          <View style={styles.optionsContainer}>
            {item.answers.map((answer) => {
              const isCorrect = answer.id === item.correct;
              const isSelected = answer.id === selected;

              return (
                <TouchableOpacity
                  key={answer.id}
                  style={[
                    styles.option,
                    selected && isCorrect && styles.correctOption,
                    selected && isSelected && !isCorrect && styles.incorrectOption,
                  ]}
                  onPress={() => handleAnswerSelect(item.id, answer.id)}
                  disabled={!!selected}
                >
                  <Text style={styles.optionText}>{answer.id}. {answer.text}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {selected && (
            <Text style={styles.resultText}>
              {selected === item.correct
                ? '✅ Chính xác!'
                : `❌ Sai, đáp án đúng là ${item.correct}`}
            </Text>
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
        <Text style={styles.title}>Không có câu hỏi thường sai nào.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>CÂU HỎI THƯỜNG SAI</Text>
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
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, marginBottom: 10 },
  title: { fontSize: 17, fontWeight: 'bold', marginLeft: 10 },
  questionHeader: { marginBottom: 10 },
  questionContent: { fontSize: 17, fontWeight: 'bold' },
  questionNumber: { fontSize: 17 },
  questionImage: { width: '100%', height: 200, resizeMode: 'contain', marginVertical: 10 },
  optionsContainer: { marginTop: 10 },
  option: { marginBottom: 5, padding: 10, backgroundColor: '#F4F4F4', borderRadius: 5 },
  optionText: { fontSize: 16.5 },
  correctOption: { backgroundColor: '#D4EDDA' },
  incorrectOption: { backgroundColor: '#F8D7DA' },
  resultText: { marginTop: 10, fontSize: 15, fontWeight: 'bold', color: '#007AFF' },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: "center",
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

export default FrequentQuestionScreen;
