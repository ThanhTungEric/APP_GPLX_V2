import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter } from "expo-router";
import { getQuizzesByLicense } from './database/quizzes';
import { getCurrentLicenseId, getExamHistory, clearExamHistory } from './database/history';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Quiz {
  id: number;
  name: string;
}

const TestScreen = () => {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentLicense, setCurrentLicense] = useState<number | null>(null);
  const [quizResults, setQuizResults] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchCurrentLicense = async () => {
      try {
        const licenses = await getCurrentLicenseId();
        setCurrentLicense(licenses);
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
      const history = await getExamHistory();
      const resultsMap = history.reduce((acc: Record<string, any>, item: any) => {
        acc[item.testName] = item;
        return acc;
      }, {});
      setQuizResults(resultsMap);
    };
    fetchQuizResults();
  }, []);

  const handleClearData = async () => {
    try {
      await clearExamHistory();
      setQuizResults({});
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Header router={router} />
      <TestGrid quizzes={quizzes} router={router} quizResults={quizResults} />
      {quizzes.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.clearButton} onPress={handleClearData}>
            <Text style={styles.clearButtonText}>Xóa dữ liệu thi thử</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const Header = ({ router }: { router: any }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={() => router.push('/')}>
      <Icon name="arrow-left" size={22} color="#007AFF" />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>OTOMOTO - C1</Text>
  </View>
);

const TestGrid = ({ quizzes, router, quizResults }: { quizzes: any[]; router: any; quizResults: Record<string, any> }) => {
  const handleTestPress = (quiz: { id: number; name: string; description: string }) => {
    router.push({
      pathname: '/testdetailscreen',
      params: { id: quiz.id, title: quiz.name, description: quiz.description }
    });
  };

  return (
    <View style={styles.testGrid}>
      {quizzes.length > 0 ? (
        quizzes.map((quiz, index) => {
          const result = quizResults[quiz.name];
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.testButton,
                { backgroundColor: result ? (result.passed ? '#4CAF50' : '#FF5252') : '#FFFFFF' }
              ]}
              onPress={() => handleTestPress(quiz)}
            >
              {result && (
                <View style={styles.resultContainer}>
                  <View style={styles.resultRow}>
                    <Text style={[styles.resultText, { color: 'white' }]}>Đúng: {result.correctCount}</Text>
                    <Text style={[styles.resultText, { color: 'white' }]}>Sai: {result.incorrectCount}</Text>
                  </View>
                  <Text style={[styles.resultText, styles.resultStatus]}>
                    {result.passed ? 'Đậu' : 'Rớt'}
                  </Text>
                </View>
              )}
              {!result && <Text style={styles.testText}>{quiz.name}</Text>}
            </TouchableOpacity>
          );
        })
      ) : (<Text style={styles.noQuizzesText}>Không có bộ đề nào</Text>)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#fff', elevation: 2 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  testGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', padding: 20 },
  testButton: { width: 120, height: 120, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 20, backgroundColor: '#ffffff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 5 },
  testText: { color: '#000', fontWeight: 'bold', fontSize: 16, textAlign: 'center' },
  noQuizzesText: { fontSize: 16, textAlign: 'center', color: '#888' },
  resultContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  resultRow: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '90%' },
  resultText: { fontSize: 14, color: '#fff' },
  resultStatus: { fontSize: 16, fontWeight: 'bold', marginTop: 5 },
  footer: { marginTop: 'auto', padding: 15, alignItems: 'center', backgroundColor: '#F8F9FA' },
  clearButton: { padding: 10, backgroundColor: '#FF3B30', borderRadius: 5, alignItems: 'center', elevation: 3 },
  clearButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default TestScreen;
