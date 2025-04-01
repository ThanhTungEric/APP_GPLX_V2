import React from 'react';
import { Stack, usePathname } from "expo-router";
import { View, StyleSheet, Platform } from "react-native";
import BottomNavigation from "./components/BottomNavigation";
import TipsScreen from './tipsscreen';
import FrequentQuestionScreen from './frequentquestionscreen';

export default function RootLayout() {
  const pathname = usePathname(); // Lấy đường dẫn hiện tại

  // Danh sách màn hình không hiển thị BottomNavigation
  const hiddenScreens = ["/settings", "/questionscreen", "/studyscreen", "/testscreen/exam", "/testscreen", "/testdetailscreen", "/select-gplx"];

  return (
    <>
      <Stack screenOptions={{ header: () => <CustomHeader /> }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="select-gplx" />
        <Stack.Screen name="information" />
        <Stack.Screen name="testscreen" />
        <Stack.Screen name="signscreen" />
        <Stack.Screen name="exam" />
        <Stack.Screen name="questionscreen" />
        <Stack.Screen name="frequentquestionscreen" />
      </Stack>
      {!hiddenScreens.includes(pathname) && <BottomNavigation />}
    </>
  );
}

// Header trống chỉ có màu nền
const CustomHeader = () => {
  return <View style={styles.header} />;
};

const styles = StyleSheet.create({
  header: { backgroundColor: "#FFF", height: Platform.OS === "ios" ? 50 : 0 },
});
