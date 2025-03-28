import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter } from "expo-router";
import { getQuizzesByLicense } from './database/quizzes';
import { getCurrentLicenseId } from './database/history';

interface Quiz {
  id: number;
  name: string;
}

const TestScreen = () => {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentLicense, setCurrentLicense] = useState<number | null>(null);

  useEffect(() => {
    // Fetch the current license from the history table
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
    // Once the current license is set, fetch quizzes for that license
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header router={router} />

      {/* Lưới Thi Thử */}
      <TestGrid quizzes={quizzes} router={router} />
    </View>
  );
};

// Header Component
const Header = ({ router }: { router: any }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={() => router.push('/')}>
      <Icon name="arrow-left" size={22} color="#007AFF" />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>OTOMOTO - C1</Text>
  </View>
);

// Lưới Thi Thử
const TestGrid = ({ quizzes, router }: { quizzes: any[]; router: any }) => {
  const handleTestPress = (quiz: { id: number; name: string; description: string }) => {
    router.push({
      pathname: '/testdetailscreen',
      params: { id: quiz.id, title: quiz.name, description: quiz.description }
    });
  };

  return (
    <View style={styles.testGrid}>
      {quizzes.length > 0 ? (
        quizzes.map((quiz, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.testButton, { backgroundColor: 'red' }]}
            onPress={() => handleTestPress(quiz)}
          >
            <Text style={styles.testText}>{quiz.name}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noQuizzesText}>Không có bộ đề nào</Text>
      )}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#fff' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  testGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 40,
  },
  testButton: {
    width: 110,
    height: 110,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  testText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  noQuizzesText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
  },
});

export default TestScreen;
