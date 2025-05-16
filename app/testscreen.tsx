import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from "expo-router";
import { getQuizzesByLicense } from '../database/quizzes';
import { getCurrentLicenseId } from '../database/history';
import { getQuizHistory } from '../database/quizesshistory';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getCurrentLicense } from '../database/history';
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
        setCurrentLicenseName(licenseName)
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


  return (
    <View style={styles.container}>
      <Header router={router} licenseName={currentLicenseName} />
      <TestGrid quizzes={quizzes} router={router} quizResults={quizResults} />
    </View>
  );
};

const Header = ({ router, licenseName, }: { router: any; licenseName: string | null; }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={() => router.push('/')}>
      <MaterialCommunityIcons name="arrow-left" size={28} color="#007AFF" />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>HOCLAIXE - {licenseName}</Text>
  </View>
);

const TestGrid = ({ quizzes, router, quizResults }: { quizzes: Quiz[]; router: any; quizResults: Record<number, any> }) => {
  const handleTestPress = (quiz: Quiz) => {
    router.push({
      pathname: '/testdetailscreen',
      params: { id: quiz.id, title: quiz.name, licenseName: quiz.licenseName }
    });
  };

  return (
    <View style={styles.testGrid}>
      {quizzes.length > 0 ? (
        quizzes.map((quiz) => {
          const result = quizResults[quiz.id];
          return (
            <TouchableOpacity
              key={quiz.id}
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
      ) : (
        <Text style={styles.noQuizzesText}>Không có bộ đề nào</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, backgroundColor: '#fff', elevation: 2 },
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
