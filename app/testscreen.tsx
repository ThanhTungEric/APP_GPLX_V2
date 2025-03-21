import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter } from "expo-router";

const TestScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header router={router} />

      {/* Lưới Thi Thử */}
      <TestGrid />
    </View>
  );
};

// Header Component
const Header = ({ router }: { router: ReturnType<typeof useRouter> }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={() => router.push('/')}>
      <Icon name="arrow-left" size={22} color="#007AFF" />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>OTOMOTO - C1</Text>
  </View>
);

// Lưới Thi Thử
const TestGrid = () => {
  const tests = [
    { title: "Câu hỏi ngẫu nhiên", color: "#007AFF" },
    { title: "RỚT", color: "#FF3D00", correct: 5, incorrect: 30 },
    { title: "Đề 2", color: "#FFD600" },
    { title: "Đề 3", color: "#00C853" },
    { title: "Đề 4", color: "#FF3D00" },
    { title: "Đề 5", color: "#FFD600" },
    { title: "Đề 6", color: "#007AFF" },
    { title: "Đề 7", color: "#00C853" },
    { title: "Đề 8", color: "#FF3D00" },
    { title: "Đề 9", color: "#FFD600" },
    { title: "Đề 10", color: "#007AFF" },
    { title: "Đề 11", color: "#00C853" },
    { title: "Đề 12", color: "#FF3D00" },
    { title: "Đề 13", color: "#FFD600" },
    { title: "Đề 14", color: "#007AFF" },
  ];

  return (
    <View style={styles.testGrid}>
      {tests.map((test, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.testButton, { backgroundColor: test.color }]}>
          {test.correct !== undefined && test.incorrect !== undefined ? (
            <View style={styles.testStatus}>
              <Text style={styles.testCorrect}>{test.correct}</Text>
              <Text style={styles.testIncorrect}>{test.incorrect}</Text>
            </View>
          ) : null}
          <Text style={styles.testText}>{test.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#fff' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  testGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', padding: 10, flexGrow: 1 }, // Added flexGrow
  testButton: {
    width: 80,
    height: 80,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  testStatus: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 5 },
  testCorrect: { color: 'green', fontSize: 16, fontWeight: 'bold' },
  testIncorrect: { color: 'red', fontSize: 16, fontWeight: 'bold' },
  testText: { color: '#fff', fontWeight: 'bold' },
});

export default TestScreen;
