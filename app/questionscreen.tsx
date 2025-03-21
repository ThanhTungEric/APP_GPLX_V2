import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import QuestionItem from "./components/QuestionItem";

const QuestionScreen = () => {
  const router = useRouter();
  
  // Giả lập danh sách câu hỏi
  const questions = [
    {
      id: 1,
      text: "Hành vi nào dưới đây bị nghiêm cấm?",
      options: [
        "Đỗ xe trên đường phố",
        "Sử dụng xe đạp đi trên các tuyến quốc lộ có tốc độ cao.",
        "Làm hỏng (cố ý) cọc tiêu, gương cầu, dải phân cách.",
        "Sử dụng còi và quay đầu xe trong khu dân cư."
      ],
    },
    // Bạn có thể thêm nhiều câu hỏi khác tại đây
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-left" size={22} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Câu hỏi điểm liệt</Text>
        <Icon name="users" size={22} color="#007AFF" />
      </View>

      {/* Hiển thị câu hỏi */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <QuestionItem question={questions[currentQuestionIndex]} />
      </ScrollView>

      {/* Nút điều hướng câu hỏi */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={handlePrevQuestion} style={styles.navButton}>
          <Icon name="chevron-left" size={20} color="#fff" />
          <Text style={styles.navText}>Câu trước</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNextQuestion} style={styles.navButton}>
          <Text style={styles.navText}>Câu sau</Text>
          <Icon name="chevron-right" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 15, backgroundColor: "#fff" },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  bottomNav: { flexDirection: "row", justifyContent: "space-between", padding: 15, backgroundColor: "#007AFF" },
  navButton: { flexDirection: "row", alignItems: "center", padding: 10 },
  navText: { color: "#fff", marginLeft: 5, fontWeight: "bold" }
});

export default QuestionScreen;
