// ExamScreen.tsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, FlatList, Modal, ScrollView,
    Image, Animated, Dimensions
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { getQuestionsByQuiz } from '../../database/quizzes';
import { getLicenseById } from '../../database/licenses';
import { getCurrentLicenseId } from '../../database/history';
import { getImageSource } from '../../utils/getImageSource';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface Question {
    id: number;
    content: string;
    options: string[];
    correctAnswerIndex: number;
    chapterId: number;
    imageName?: string;
    number: number;
    isCritical?: boolean;
}


const ExamScreen = () => {
    const router = useRouter();
    const { id, title, licenseName } = useLocalSearchParams();

    const [questions, setQuestions] = useState<Question[]>([]);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
    const [licenseInfo, setLicenseInfo] = useState<any | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [currentIndex, setCurrentIndex] = useState(0);

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        (async () => {
            const licenseId = await getCurrentLicenseId();
            if (licenseId) {
                const data = await getLicenseById(Number(licenseId));
                setLicenseInfo(data);
            }
        })();
    }, []);

    useEffect(() => {
        if (licenseInfo?.durationMinutes) {
            const totalSeconds = licenseInfo.durationMinutes * 60;
            setTimeLeft(totalSeconds);
        }
    }, [licenseInfo]);

    useEffect(() => {
        if (timeLeft <= 0) return;
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    handleSubmit();
                    confirmSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [timeLeft]);

    useEffect(() => {
        const fetchQuestions = async () => {
            const quizId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
            const result = await getQuestionsByQuiz(quizId);

            const formatted = result.map((q: any) => {
                const options: string[] = typeof q.options === 'string'
                    ? JSON.parse(q.options)
                    : q.options;

                const indexed: { opt: string; index: number }[] = options.map((opt: string, i: number) => ({
                    opt,
                    index: i,
                }));

                for (let i = indexed.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
                }

                return {
                    ...q,
                    options: indexed.map((item) => item.opt),
                    correctAnswerIndex: indexed.findIndex((item) => item.index === q.correctAnswerIndex),
                    isCritical: !!q.isCritical,
                };
            });

            setQuestions(formatted);
        };

        if (id) fetchQuestions();
    }, [id]);


    const handleAnswerSelect = (questionId: number, answerIndex: number) => {
        setSelectedAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
    };

    const handleSubmit = () => setIsModalVisible(true);

    const confirmSubmit = () => {
        const rawData = questions.map(q => ({
            id: q.id,
            content: q.content,
            options: q.options,
            selectedAnswerIndex: selectedAnswers[q.id],
            correctAnswerIndex: q.correctAnswerIndex,
            isCritical: q.isCritical,
        }));
        setIsModalVisible(false);
        router.push({
            pathname: '/testscreen/result',
            params: {
                rawData: encodeURIComponent(JSON.stringify(rawData)),
                totalQuestions: questions.length.toString(),
                testName: String(title),
                id: String(id),
                licenseName: String(licenseName),
            },
        });

    };

    const renderItem = ({ item, index }: { item: any, index: number }) => {
        const selected = selectedAnswers[item.id];
        return (
            <View style={{ width: SCREEN_WIDTH, padding: 15, flex: 1 }}>
                <ScrollView contentContainerStyle={{ paddingBottom: 20 }} style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    <Text style={styles.questionNumber}>Câu {index + 1}/{questions.length}</Text>
                    <Text style={styles.questionText}>{item.content}</Text>

                    {item.imageName && (
                        <Image
                            source={getImageSource(item.imageName, item.number)}
                            style={styles.questionImage}
                        />
                    )}

                    <View style={{ marginTop: 10 }}>
                        {item.options.map((opt: string, i: number) => (
                            <TouchableOpacity
                                key={i}
                                onPress={() => handleAnswerSelect(item.id, i)}
                                style={[styles.answerButton, selected === i && styles.selectedAnswerButton]}
                            >
                                <Text style={styles.answerText}>{opt}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </View>

        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.timerAndStatusRow}>
                <View style={styles.timerBox}>
                    <Text style={styles.timerText}>
                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </Text>
                </View>

                <View style={styles.questionStatusContainer}>
                    {questions.map((q, index) => {
                        const answered = selectedAnswers[q.id] !== undefined;
                        const isCurrent = index === currentIndex;
                        return (
                            <View
                                key={q.id}
                                style={[
                                    styles.circle,
                                    answered ? styles.circleAnswered : styles.circleUnanswered,
                                    isCurrent && styles.circleCurrent,
                                ]}
                            >
                                <Text style={styles.circleText}>{index + 1}</Text>
                            </View>
                        );
                    })}
                </View>
            </View>


            <Animated.FlatList
                ref={flatListRef}
                horizontal
                pagingEnabled
                data={questions}
                keyExtractor={q => q.id.toString()}
                renderItem={renderItem}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                    useNativeDriver: false,
                })}
                scrollEventThrottle={16}
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
            />
            <View style={styles.navigationContainer}>
                <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => {
                        if (flatListRef.current && currentIndex > 0) {
                            flatListRef.current.scrollToIndex({ index: currentIndex - 1, animated: true });
                        }
                    }}
                    disabled={currentIndex === 0}
                >
                    <MaterialCommunityIcons name="chevron-left" size={30} color={currentIndex === 0 ? "#999" : "#1c84c6"} />
                    <MaterialCommunityIcons name="chevron-left" size={30} color={currentIndex === 0 ? "#999" : "#1c84c6"} />
                    <MaterialCommunityIcons name="chevron-left" size={30} color={currentIndex === 0 ? "#999" : "#1c84c6"} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>NỘP BÀI</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => {
                        if (flatListRef.current && currentIndex < questions.length - 1) {
                            flatListRef.current.scrollToIndex({ index: currentIndex + 1, animated: true });
                        }
                    }}
                    disabled={currentIndex === questions.length - 1}
                >
                    <MaterialCommunityIcons name="chevron-right" size={30} color={currentIndex === questions.length - 1 ? "#999" : "#1c84c6"} />
                    <MaterialCommunityIcons name="chevron-right" size={30} color={currentIndex === questions.length - 1 ? "#999" : "#1c84c6"} />
                    <MaterialCommunityIcons name="chevron-right" size={30} color={currentIndex === questions.length - 1 ? "#999" : "#1c84c6"} />
                </TouchableOpacity>
            </View>

            <Modal visible={isModalVisible} transparent animationType="fade">
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View style={{ width: '80%', backgroundColor: '#fff', padding: 20 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>
                            Bạn có chắc muốn nộp bài?
                        </Text>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            <TouchableOpacity onPress={() => setIsModalVisible(false)} style={{ paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#f2f2f2' }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>HỦY</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={confirmSubmit} style={{ paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#007AFF' }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>XÁC NHẬN</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    questionText: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    questionNumber: { fontSize: 17 },
    answerButton: { padding: 10, borderWidth: 1, borderColor: '#ccc', marginBottom: 10 },
    selectedAnswerButton: { backgroundColor: '#E3F2FD', borderColor: '#007AFF' },
    answerText: { fontSize: 16 },
    submitButton: { backgroundColor: '#007AFF', padding: 15, height: 50 },
    submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    timerBox: { padding: 10, alignItems: 'center', backgroundColor: '#FFEFD5', width: 70},
    timerText: { fontSize: 18, color: '#dc3545' },
    questionImage: { width: '100%', height: 200, resizeMode: 'contain', marginVertical: 10 },

    navigationContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", paddingBottom: 15, backgroundColor: '#fff' },
    navButton: { padding: 15, alignItems: 'center', flex: 1, marginHorizontal: 5, display: 'flex', flexDirection: 'row', justifyContent: 'center' },
    navButtonText: { color: '#fff', fontWeight: 'bold' },
    timerAndStatusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 10,
        paddingHorizontal: 10,
    },

    questionStatusContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 2,
        flex: 1,
    },

    circle: {
        width: 20,
        height: 20,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 1,
    },

    circleAnswered: {
        backgroundColor: '#4CAF50',
    },

    circleUnanswered: {
        backgroundColor: '#ccc',
    },

    circleCurrent: {
        borderWidth: 2,
        borderColor: '#007AFF',
    },

    circleText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },

});

export default ExamScreen;