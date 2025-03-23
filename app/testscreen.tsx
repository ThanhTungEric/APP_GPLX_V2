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
  const router = useRouter();

  const tests = [
    { id: 1, title: "Câu hỏi ngẫu nhiên", color: "#FF3D00", description: "Bộ đề gồm các câu hỏi ngẫu nhiên từ ngân hàng câu hỏi." },
    { id: 2, title: "RỚT", color: "#FFD600", correct: 5, incorrect: 30, description: "Bộ đề này đã bị rớt, cần ôn tập thêm." },
    { id: 3, title: "Đề 2", color: "#00C853", description: "Bộ đề 2 với cấu trúc chuẩn." },
    { id: 4, title: "Đề 3", color: "#FFD600", description: "Bộ đề 3 với cấu trúc chuẩn." },
    { id: 5, title: "Đề 4", color: "#00C853", description: "Bộ đề 4 với cấu trúc chuẩn." },
    { id: 6, title: "Đề 5", color: "#FF3D00", description: "Bộ đề 5 với cấu trúc chuẩn." },
    { id: 7, title: "Đề 6", color: "#00C853", description: "Bộ đề 6 với cấu trúc chuẩn." },
    { id: 8, title: "Đề 7", color: "#FF3D00", description: "Bộ đề 7 với cấu trúc chuẩn." },
    { id: 9, title: "Đề 8", color: "#FFD600", description: "Bộ đề 8 với cấu trúc chuẩn." },
    { id: 10, title: "Đề 9", color: "#FF3D00", description: "Bộ đề 9 với cấu trúc chuẩn." },
    { id: 11, title: "Đề 10", color: "#FFD600", description: "Bộ đề 10 với cấu trúc chuẩn." },
    { id: 12, title: "Đề 11", color: "#00C853", description: "Bộ đề 11 với cấu trúc chuẩn." },
    { id: 13, title: "Đề 12", color: "#FFD600", description: "Bộ đề 12 với cấu trúc chuẩn." },
    { id: 14, title: "Đề 13", color: "#00C853", description: "Bộ đề 13 với cấu trúc chuẩn." },
    { id: 15, title: "Đề 14", color: "#FF3D00", description: "Bộ đề 14 với cấu trúc chuẩn." },
  ];

  const handleTestPress = (test: { id: number; title: string; description: string }) => {
    router.push({
      pathname: '/testdetailscreen',
      params: { id: test.id, title: test.title, description: test.description }
    });
  };

  return (
    <View style={styles.testGrid}>
      {tests.map((test, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.testButton, { backgroundColor: test.color }]}
          onPress={() => handleTestPress(test)}
        >
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
  testStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  testCorrect: { color: 'green', fontSize: 16, fontWeight: 'bold' },
  testIncorrect: { color: 'red', fontSize: 16, fontWeight: 'bold' },
  testText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default TestScreen;
