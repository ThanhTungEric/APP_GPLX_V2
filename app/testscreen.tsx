import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from "expo-router";
import { getQuizzesByLicense } from '../database/quizzes';
import { getCurrentLicenseId, getCurrentLicense } from '../database/history';
import { getQuizHistory } from '../database/quizesshistory';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

interface Quiz {
  id: number;
  name: string;
  licenseName: string;
}

const TestScreen = () => {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentLicense, setCurrentLicense] = useState<number | null>(null);
  const [quizResults, setQuizResults] = useState<Record<number, any>>({});
  const [currentLicenseName, setCurrentLicenseName] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentLicense = async () => {
      try {
        const licenses = await getCurrentLicenseId();
        const licenseName = await getCurrentLicense();
        setCurrentLicense(licenses);
        setCurrentLicenseName(licenseName);
      } catch (error) {
        console.error("Error fetching current license:", error);
      }
    };

    fetchCurrentLicense();
  }, []);

  useEffect(() => {
    const fetchQuizzesForLicense = async () => {
      if (currentLicense !== null) {
        try {
          const quizzesData = await getQuizzesByLicense(currentLicense);
          setQuizzes(quizzesData);
        } catch (error) {
          console.error("Error fetching quizzes by license:", error);
        }
      }
    };

    fetchQuizzesForLicense();
  }, [currentLicense]);

  useEffect(() => {
    const fetchQuizResults = async () => {
      const results: Record<number, any> = {};
      for (const quiz of quizzes) {
        const history = await getQuizHistory(quiz.id);
        if (history.length > 0) {
          results[quiz.id] = history[0];
        }
      }
      setQuizResults(results);
    };

    if (quizzes.length > 0) {
      fetchQuizResults();
    }
  }, [quizzes]);

  const handleTestPress = (quiz: Quiz) => {
    router.push({
      pathname: '/testdetailscreen',
      params: { id: quiz.id, title: quiz.name, licenseName: quiz.licenseName },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/')}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>HOCLAIXE - {currentLicenseName}</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { flexGrow: 1 }]}>
        {quizzes.length === 0 ? (
          <Text style={styles.noQuizzesText}>Không có bộ đề nào</Text>
        ) : (
          <View style={styles.testGrid}>
            {quizzes.map((quiz) => {
              const result = quizResults[quiz.id];
              return (
                <TouchableOpacity
                  key={quiz.id}
                  style={[styles.testButton, { backgroundColor: '#FFFFFF' }]}
                  onPress={() => handleTestPress(quiz)}
                >
                  {result ? (
                    <View style={styles.resultContainer}>
                      <View style={styles.resultRow}>
                        <View style={styles.resultIconText}>
                          <MaterialIcons name="check-circle-outline" size={24} color="#28A745" />
                          <Text style={styles.resultText}> Đúng: {result.correctCount}</Text>
                        </View>
                        <View style={styles.resultIconText}>
                          <FontAwesome6 name="circle-xmark" size={24} color="#DC3545" />
                          <Text style={styles.resultText}> Sai: {result.incorrectCount}</Text>
                        </View>
                      </View>
                      <Text
                        style={[
                          styles.resultStatus,
                          { color: result.passed ? '#28A745' : '#DC3545' },
                        ]}
                      >
                        {result.passed ? 'ĐẬU' : 'RỚT'}
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.testText}>{quiz.name}</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  testGrid: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  testButton: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  testText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  noQuizzesText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
    marginTop: 30,
  },
  resultContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultRow: {
    marginBottom: 5,
  },
  resultIconText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  resultText: {
    fontSize: 14,
    color: '#000',
  },
  resultStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
});

export default TestScreen;
