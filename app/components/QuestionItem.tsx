import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface Question {
  text: string;
  options: string[];
}

interface QuestionItemProps {
  question: Question;
}

const QuestionItem: React.FC<QuestionItemProps> = ({ question }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{question.text}</Text>
      {question.options.map((option: string, index: number) => (
        <TouchableOpacity key={index} style={styles.optionButton}>
          <Text style={styles.optionText}>{`${index + 1}- ${option}`}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 15, backgroundColor: "#fff" },
  questionText: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  optionButton: { padding: 10, borderWidth: 1, borderColor: "#ddd", borderRadius: 5, marginBottom: 5 },
  optionText: { fontSize: 16 }
});

export default QuestionItem;