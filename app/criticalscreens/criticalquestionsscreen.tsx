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
import { getCriticalQuestions, Question } from '../../database/questions';

const SCREEN_WIDTH = Dimensions.get('window').width;

const CriticalQuestionsScreen = () => {
  const router = useRouter();
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

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

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

  const handleAnswerSelect = async (questionId: number, answerIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answerIndex }));
  };

  const renderItem = ({ item }: { item: Question }) => {
    const selected = selectedAnswers[item.id];
    const options = JSON.parse(item.options || '[]');

    return (
      <View style={{ width: SCREEN_WIDTH, padding: 15 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.questionNumber}>Câu {item.number}</Text>
          <View style={styles.questionHeader}>
            <Text style={styles.questionContent}>{item.content}</Text>
          </View>

          {item.imageName && (
            <Image
              source={{ uri: `https://daotaolaixebd.com/app/uploads/${item.imageName}` }}
              style={styles.questionImage}
            />
          )}

          <View style={styles.optionsContainer}>
            {options.map((option: string, index: number) => {
              const isCorrect = index === item.correctAnswerIndex;
              const isSelected = index === selected;
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.option,
                    selected !== undefined && isCorrect && styles.correctOption,
                    selected !== undefined && isSelected && !isCorrect && styles.incorrectOption,
                  ]}
                  onPress={() => handleAnswerSelect(item.id, index)}
                  disabled={selected !== undefined}
                >
                  <Text style={styles.optionText}>{index + 1}. {option}</Text>
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

          {currentIndex === questions.length - 1 && (
            <Text style={styles.endText}>🎉 Bạn đã hoàn thành tất cả câu hỏi!</Text>
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
        <Text style={styles.title}>Không có câu hỏi điểm liệt nào.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>CÂU HỌI ĐIỂM LIỆT</Text>
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

export default CriticalQuestionsScreen;
