import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter } from "expo-router";
import { createTables, checkVersion, getVersion } from '../database/database';
import { getAllChapters } from '../database/chapter';
import { getCurrentLicense } from '../database/history';
import { getLicenseIdByName } from '../database/licenses';
import { getSavedQuestionCount } from '../database/historyquestion';
import { getQuestionCountsByChapterAndLicense, getTotalQuestionsByLicense } from '../database/questions';

const Index = () => {

  const router = useRouter();
  const [currentLicense, setCurrentLicense] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await createTables();
        await checkVersionAndUpdate();
        const license = await getCurrentLicense();

        if (!license) {
          router.replace('/select-gplx');
          return;
        }
        setCurrentLicense(license);
        setIsReady(true);
      } catch (error) {
        setIsReady(true);
      }
    })();
  }, []);



  async function checkVersionAndUpdate() {
    try {
      await checkVersion();
    } catch (error) {
      console.error("❌ Không thể kiểm tra phiên bản:", error);
    }
  }


  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Đang khởi động...</Text>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      {/* Header */}
      <Header router={router} licenses={currentLicense} />


      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Nâng cấp Pro */}
        {/* <UpgradeBanner /> */}

        {/* Lưới tính năng */}
        <FeatureGrid />

        {/* Tiến độ ôn tập */}
        <ProgressSection />

        {/* Ôn tập theo chủ đề */}
        <StudyTopics />
      </ScrollView>
    </View>
  );
};

// Header Component
const Header = ({ router, licenses }: { router: ReturnType<typeof useRouter>; licenses: string | null }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={() => router.push('/settings')}>
      <Icon name="cog" size={22} color="#007AFF" />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>HOCLAIXE - {licenses ?? "?"}</Text>
    {/* <Icon name="trophy" size={22} color="gold" /> */}
  </View>
);

// Banner Nâng Cấp Pro
const UpgradeBanner = () => (
  <View style={styles.upgradeBanner}>
    <Text style={styles.upgradeText}>Phiên bản Pro - 30% OFF</Text>
    <TouchableOpacity style={styles.upgradeButton}>
      <Text style={styles.upgradeButtonText}>Nâng cấp</Text>
    </TouchableOpacity>
  </View>
);

// Lưới tính năng
const FeatureGrid = () => {
  const router = useRouter(); // Hook dùng để chuyển hướng

  const handleFeaturePress = (text: string) => {
    if (text === "THI THỬ") {
      router.push("/testscreen");
    }
    else if (text == "BIỂN BÁO") {
      router.push("/signscreen");
    }
    else if (text === "MẸO") {
      router.push("/tipsscreen");
    }
    else if (text === "CÂU HAY SAI") {
      router.push("/frequentquestionscreen");
    }
    else if (text === "CÂU HỎI ĐIỂM LIỆT") {
      router.push("/criticalscreens/criticalquestionsscreen");
    }
    else if (text === "LƯU") {
      router.push("/SavedQuestionsScreen");
    }
    // Bạn có thể thêm điều kiện cho các button khác nếu cần thiết.
  };

  return (
    <View style={styles.featureGrid}>
      {[
        { icon: "book", text: "THI THỬ", color: "#007AFF" },
        { icon: "bookmark", text: "LƯU", color: "#00C853" },
        { icon: "times-circle", text: "CÂU HỎI ĐIỂM LIỆT", color: "#FF3D00" },
        { icon: "file-text", text: "CÂU HAY SAI", color: "#FFD600" },
        //{ icon: "road", text: "SA HÌNH", color: "#007AFF" }, // Thêm SA HÌNH
        //{ icon: "lightbulb-o", text: "MẸO", color: "#00C853" }, // Thêm MẸO
        //{ icon: "exclamation-triangle", text: "BIỂN BÁO", color: "#FF3D00" }, // Thêm BIỂN BÁO
        //{ icon: "comments", text: "HỎI ĐÁP", color: "#007AFF" }, // Thêm HỎI ĐÁP
      ].map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.featureButton, { backgroundColor: item.color }]}
          onPress={() => handleFeaturePress(item.text)} // Gọi hàm khi ấn vào button
        >
          <Icon name={item.icon} size={24} color="#fff" />
          <Text style={styles.featureText}>{item.text}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Tiến độ ôn tập
const ProgressSection = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    async function loadProgress() {
      try {
        const licenseName = await getCurrentLicense();
        const licenseId = await getLicenseIdByName(licenseName ?? '');
        if (!licenseId) return;

        const savedCount = await getSavedQuestionCount();
        const totalCount = await getTotalQuestionsByLicense(licenseId);
        if (totalCount > 0) {
          setProgress(savedCount / totalCount);
        }
      } catch (error) {
        console.error('Lỗi khi tải tiến độ ôn tập:', error);
      }
    }

    loadProgress();
  }, []);

  return (
    <View style={styles.progressContainer}>
      <Text style={styles.progressTitle}>Tiến độ ôn tập</Text>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]} />
      </View>
      <Text style={styles.progressPercentage}>{Math.round(progress * 100)}%</Text>
    </View>
  );
};

// Ôn tập theo chủ đề
const StudyTopics = () => {
  const router = useRouter();
  const [topics, setTopics] = React.useState<{ id: number; name: string; questionCount: number }[]>([]);
  const [licenseId, setLicenseId] = React.useState<number>(1); // Mặc định là 1

  React.useEffect(() => {
    async function fetchChaptersWithQuestions() {
      try {
        const licenseName = await getCurrentLicense(); 
        const licenseIdNum = await getLicenseIdByName(licenseName ?? '');
        if (!licenseIdNum) {
          setLicenseId(1);
          return;
        }

        setLicenseId(licenseIdNum);

        const chapters = await getAllChapters();
        const questionCountWithChapterIdAndLicenseId = await getQuestionCountsByChapterAndLicense();

        const chaptersWithCounts = chapters.map((chapter) => {
          const countData = questionCountWithChapterIdAndLicenseId.find(
            (q) => q.chapterId === chapter.id && q.licenseId === licenseIdNum
          );
          return { ...chapter, questionCount: countData?.questionCount || 0 };
        });

        setTopics(chaptersWithCounts);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu chủ đề và câu hỏi:', error);
      }
    }
    fetchChaptersWithQuestions();
  }, []);


  const handleTopicPress = (id: number, name: string) => {
    router.push({ pathname: '/studyscreen', params: { id, title: name, licenseId } });
  };

  return (
    <View style={styles.studyTopicsContainer}>
      <Text style={styles.studyTopicsTitle}>Ôn tập theo chủ đề</Text>
      {topics.map((topic, index) => (
        <TouchableOpacity
          key={topic.id || index}
          style={styles.topicCard}
          onPress={() => handleTopicPress(topic.id, topic.name)}
        >
          <Text style={styles.topicIcon}>📘</Text>
          <View style={styles.topicInfo}>
            <Text style={styles.topicTitle}>{topic.name}</Text>
            <Text style={styles.topicCount}>{topic.questionCount} câu hỏi</Text>
          </View>
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
  upgradeBanner: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#007AFF', margin: 10, borderRadius: 10 },
  upgradeText: { fontWeight: 'bold', color: '#fff' },
  upgradeButton: { backgroundColor: '#fff', padding: 5, borderRadius: 5 },
  upgradeButtonText: { color: '#007AFF', fontWeight: 'bold' },
  featureGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', margin: 10 },
  featureButton: { width: '45%', padding: 20, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  featureText: { color: '#fff', marginTop: 5, fontWeight: 'bold', textAlign: 'center' },
  progressContainer: { padding: 15, backgroundColor: '#fff', margin: 10, borderRadius: 10 },
  progressTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  progressBar: {
    height: 12,
    backgroundColor: '#ddd',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  progressPercentage: {
    marginTop: 5,
    textAlign: 'right',
    fontSize: 14,
    color: '#555',
  },
  studyTopicsContainer: { padding: 15, backgroundColor: '#fff', margin: 10, borderRadius: 10 },
  studyTopicsTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  topicCard: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#F4F4F4', borderRadius: 10, marginBottom: 10 },
  topicIcon: { fontSize: 24, marginRight: 10 },
  topicInfo: { flex: 1 },
  topicTitle: { fontSize: 16, },
  topicCount: { fontSize: 14, color: '#666' },
});

export default Index;
