import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator
} from "react-native";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from 'react';


import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

export default function ReviewQuestion() {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1);
        return () => clearTimeout(timer);
    }, []);
    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push('/')}>
                    <MaterialCommunityIcons name="arrow-left" size={28} color="#007AFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>LÝ THUYẾT</Text>
            </View>
            {isLoading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={{ marginTop: 10 }}>Đang tải dữ liệu...</Text>
                </View>
            ) : (

                <View style={styles.contentReveiwQuestion}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={{ flexGrow: 1 }}
                    >
                        <View style={styles.component}>
                            <Text style={styles.title}>CÁC HẠNG GIẤY PHÉP LÁI XE</Text>
                            <View style={{ paddingLeft: 8, marginTop: 10 }}>
                                <Text style={styles.text}>• Hạng A1: Mô tô có dung tích xi-lanh tối đa 125 cm³ hoặc công suất điện không quá 11 kW.</Text>
                                <Text style={styles.text}>• Hạng A: Mô tô có dung tích xi-lanh trên 125 cm³ hoặc công suất điện trên 11 kW; bao gồm cả xe hạng A1.</Text>
                                <Text style={styles.text}>• Hạng B1: Mô tô 3 bánh và các xe thuộc hạng A1.</Text>
                                <Text style={styles.text}>• Hạng B: Ô tô chở người đến 8 chỗ ngồi (không kể tài xế), ô tô tải và chuyên dùng có khối lượng toàn bộ thiết kế tối đa 3.500 kg; có thể kéo rơ moóc đến 750 kg.</Text>
                                <Text style={styles.text}>• Hạng C1: Ô tô tải và chuyên dùng có khối lượng toàn bộ thiết kế trên 3.500 kg đến 7.500 kg; có thể kéo rơ moóc đến 750 kg.</Text>
                                <Text style={styles.text}>• Hạng C: Ô tô tải và chuyên dùng có khối lượng toàn bộ thiết kế trên 7.500 kg; có thể kéo rơ moóc đến 750 kg; bao gồm cả xe hạng B và C1.</Text>
                                <Text style={styles.text}>• Hạng D1: Ô tô chở người từ 9 đến 16 chỗ ngồi (không kể tài xế); có thể kéo rơ moóc đến 750 kg; bao gồm xe hạng B, C1 và C.</Text>
                                <Text style={styles.text}>• Hạng D2: Ô tô chở người (kể cả xe buýt) từ 17 đến 29 chỗ ngồi (không kể tài xế); có thể kéo rơ moóc đến 750 kg; bao gồm xe hạng B, C1, C và D1.</Text>
                                <Text style={styles.text}>• Hạng D: Ô tô chở người trên 29 chỗ hoặc xe giường nằm; có thể kéo rơ moóc đến 750 kg; bao gồm xe hạng B, C1, C, D1 và D2.</Text>
                                <Text style={styles.text}>• Hạng BE: Ô tô hạng B kéo rơ moóc có khối lượng toàn bộ thiết kế trên 750 kg.</Text>
                                <Text style={styles.text}>• Hạng C1E: Ô tô hạng C1 kéo rơ moóc có khối lượng toàn bộ thiết kế trên 750 kg.</Text>
                                <Text style={styles.text}>• Hạng CE: Ô tô hạng C kéo rơ moóc trên 750 kg hoặc ô tô đầu kéo kéo sơ mi rơ moóc.</Text>
                                <Text style={styles.text}>• Hạng D1E: Ô tô hạng D1 kéo rơ moóc có khối lượng toàn bộ thiết kế trên 750 kg.</Text>
                                <Text style={styles.text}>• Hạng D2E: Ô tô hạng D2 kéo rơ moóc có khối lượng toàn bộ thiết kế trên 750 kg.</Text>
                                <Text style={styles.text}>• Hạng DE: Ô tô hạng D kéo rơ moóc trên 750 kg hoặc xe chở khách nối toa.</Text>
                            </View>
                        </View>

                        <View style={styles.component}>
                            <Text style={styles.title}>ĐỘ TUỔI</Text>
                            <View style={{ paddingLeft: 8, marginTop: 10 }}>
                                <Text style={styles.text}>
                                    • Người đủ 16 tuổi trở lên được điều khiển xe gắn máy (dưới 50 cm³).
                                </Text>
                                <Text style={styles.text}>
                                    • Người đủ 18 tuổi trở lên được cấp giấy phép lái xe hạng A1, A, B1, B, C1; đồng thời đủ điều kiện cấp chứng chỉ điều khiển xe máy chuyên dùng.
                                </Text>
                                <Text style={styles.text}>
                                    • Người đủ 21 tuổi trở lên được cấp giấy phép lái xe hạng C, BE.
                                </Text>
                                <Text style={styles.text}>
                                    • Người đủ 24 tuổi trở lên được cấp giấy phép lái xe hạng D1, D2, C1E, CE.
                                </Text>
                                <Text style={styles.text}>
                                    • Người đủ 27 tuổi trở lên được cấp giấy phép lái xe hạng D, D1E, D2E, DE.
                                </Text>
                                <Text style={styles.text}>
                                    • Tuổi tối đa đối với người lái xe ô tô chở trên 29 chỗ (kể cả xe buýt): nam không quá 55 tuổi, nữ không quá 50 tuổi.
                                </Text>
                            </View>
                        </View>


                        <View style={styles.component}>
                            <Text style={styles.title}>KHOẢNG CÁCH AN TOÀN TỐI THIỂU</Text>
                            <View style={{ paddingLeft: 8, marginTop: 10 }}>
                                <Text style={styles.text}>
                                    • 35m nếu vận tốc lưu hành là 60km/h.
                                </Text>
                                <Text style={styles.text}>
                                    • 55m nếu vận tốc lớn hơn{" "}
                                    <Text style={{ color: "red" }}>60km/h</Text> và nhỏ hơn hoặc
                                    bằng <Text style={{ color: "red" }}>80km/h</Text>.
                                </Text>
                                <Text style={styles.text}>
                                    • 75m nếu vận tốc lớn hơn{" "}
                                    <Text style={{ color: "red" }}>80km/h</Text> và nhỏ hơn hoặc
                                    bằng <Text style={{ color: "red" }}>100km/h</Text>.
                                </Text>
                                <Text style={styles.text}>
                                    • 100m nếu vận tốc lớn hơn{" "}
                                    <Text style={{ color: "red" }}>100km/h</Text> và nhỏ hơn hoặc
                                    bằng <Text style={{ color: "red" }}>120km/h</Text>.
                                </Text>
                                <Text style={styles.text}>
                                    • Dưới 60km/h: Chủ động và đảm bảo khoảng cách.
                                </Text>
                            </View>
                        </View>
                        <View style={styles.component}>
                            <Text style={styles.title}>NỒNG ĐỘ CỒN</Text>
                            <View style={{ paddingLeft: 8, marginTop: 10 }}>
                                <Text style={styles.text}>
                                    Người điều khiển mô xe mô tô, ô tô, máy kéo trên đường mà
                                    trong máu hoặc hơi thở có nồng độ cồn:
                                    <Text style={{ color: "red" }}> Bị nghiêm cấm</Text>
                                </Text>
                            </View>
                        </View>
                        <View style={styles.component}>
                            <Text style={styles.title}>
                                TRÊN ĐƯỜNG CAO TỐC, TRONG ĐƯỜNG HẦM, ĐƯỜNG VÒNG, ĐẦU DỐC, NƠI
                                TẦM NHÌN HẠN CHẾ
                            </Text>
                            <View style={{ paddingLeft: 8, marginTop: 10 }}>
                                <Text style={styles.text}>
                                    • Không được quay đầu xe, không lùi, không vượt.
                                </Text>
                                <Text style={styles.text}>
                                    • Không được phép quay đầu xe ở phần đường dành cho người đi
                                    bộ qua đường.
                                </Text>
                                <Text style={styles.text}>
                                    Không được vượt trên cầu hẹp có một làn xe.
                                </Text>
                                <Text style={styles.text}>
                                    Cấm lùi xe ở khu vực cấm dừng và nơi đường bộ giao nhau.
                                </Text>
                            </View>
                        </View>

                        <View style={styles.component}>
                            <Text style={styles.title}>
                                TẠI NƠI GIAO NHAU KHÔNG CÓ TÍN HIỆU ĐÈN
                            </Text>
                            <View style={{ paddingLeft: 8, marginTop: 10 }}>
                                <Text style={styles.text}>
                                    • Có vòng xuyến: Nhường đường bến trái.
                                </Text>
                                <Text style={styles.text}>
                                    • Không có vòng xuyến: Nhường đường bên phải.
                                </Text>
                            </View>
                        </View>

                        <View style={styles.component}>
                            <Text style={styles.title}>NIÊN HẠN SỬ DỤNG XE</Text>
                            <View style={{ paddingLeft: 8, marginTop: 10 }}>
                                <Text style={styles.text}>• 25 năm: ô tô tải.</Text>
                                <Text style={styles.text}>
                                    • 20 năm: ô tô chở người trên 9 chỗ.
                                </Text>
                            </View>
                        </View>

                        <View style={styles.component}>
                            <Text style={styles.title}>
                                THỨ TỰ ƯU TIÊN: NHẤT CHỚM, NHÌ ƯU, TAM ĐƯỜNG, TỨ HƯỚNG
                            </Text>
                            <View style={{ paddingLeft: 8, marginTop: 10 }}>
                                <Text style={styles.text}>
                                    • Nhất chớm: Xe nào chơm tới vạch trước thì được đi trước.
                                </Text>
                                <Text style={styles.text}>
                                    • Nhì ưu: Xe ưu tiên được đi trước (Xe cứu hỏa - Quân sự -
                                    Công an - Cứu thương - Hộ đê - Đoàn xe tang).
                                </Text>
                                <Text style={styles.text}>
                                    • Tam đường: Xe ở đường chính, đường ưu tiên.
                                </Text>
                                <Text style={styles.text}>
                                    • Tứ hướng: Thứ tự hướng: Bên phải trồng- Rẽ phải - Đi thẳng -
                                    Rẽ trái.
                                </Text>
                            </View>
                        </View>

                        <View style={styles.component}>
                            <Text style={styles.title}>THỨ TỰ ƯU TIÊN VỚI XE ƯU TIÊN</Text>
                            <View style={{ paddingLeft: 8, marginTop: 10 }}>
                                <Text style={styles.text}>1. Xe cứu hỏa.</Text>
                                <Text style={styles.text}>2. Xe quân sự.</Text>
                                <Text style={styles.text}>3. Xe công an.</Text>
                                <Text style={styles.text}>4. Xe cứu thương.</Text>
                                <Text style={styles.text}>
                                    5. Xe hộ đê, xe đi làm nhiệm vụ khẩn cấp.
                                </Text>
                                <Text style={styles.text}>6. Đoàn xe tang.</Text>
                            </View>
                        </View>

                        <View style={styles.component}>
                            <Text style={styles.title}>THỨ TỰ ƯU TIÊN KHÔNG VÒNG XUYẾN</Text>
                            <View style={{ paddingLeft: 8, marginTop: 10 }}>
                                <Text style={styles.text}>
                                    Xe vào ngã ba, ngã tư trước - Xe ưu tiên - Đường ưu tiên -
                                    Đường cùng cấp theo thứ tự bên phải trống - rẽ phải - đi thẳng
                                    - rẽ trái.
                                </Text>
                            </View>
                        </View>

                        <View style={styles.component}>
                            <Text style={styles.title}>GIAO NHAU CÙNG CẤP CÓ VÒNG XUYẾN</Text>
                            <View style={{ paddingLeft: 8, marginTop: 10 }}>
                                <Text style={styles.text}>
                                    Chưa vào vòng xuyến thì ưu tiên xe bên phải; đã vào vòng xuyến
                                    ưu tiên xe từ bên trái tới.
                                </Text>
                            </View>
                        </View>

                        <View style={styles.component}>
                            <View style={{ paddingLeft: 8, marginTop: 10 }}>
                                <Text style={styles.text}>
                                    Xe xuống dốc phải nhường đường cho xe đang lên dốc.
                                </Text>
                            </View>
                        </View>
                        <View style={styles.component}>
                            <Text style={styles.title}>PHÂN NHÓM BIỂN BÁO HIỆU</Text>
                            <View style={{ paddingLeft: 8, marginTop: 10 }}>
                                <Text style={styles.text}>
                                    • Biển nguy hiểm (hình tam giác vàng).
                                </Text>
                                <Text style={styles.text}>• Biển cấm (vòng tròn đỏ).</Text>
                                <Text style={styles.text}>
                                    • Biển chỉ dẫn (vuông hoặc hình chữ nhật màu xanh).
                                </Text>
                                <Text style={styles.text}>
                                    • Biển hiệu lệnh (vòng tròn màu xanh).
                                </Text>
                                <Text style={styles.text}>
                                    • Biển phụ (vuông, chữ nhật màu trắng đen): Hiệu lực nằm ở
                                    biển phụ khi có đặt biển phụ.
                                </Text>
                            </View>
                        </View>
                        <View style={styles.component}>
                            <Text style={styles.title}>
                                TỐC ĐỘ TỐI ĐA CHO PHÉP KHU VỰC ĐÔNG DÂN CƯ
                            </Text>
                            <View style={{ paddingLeft: 8, marginTop: 10 }}>
                                <Text style={styles.text}>
                                    • Đường đôi, đường một chiều 2 làn xe trở lên: Toàn bộ phương
                                    tiện <Text style={{ color: "red" }}>60km/h</Text>.
                                </Text>
                                <Text style={styles.text}>
                                    • Đường hai chiều, đường một chiều có 1 làn xe: Toàn bộ phương
                                    tiện <Text style={{ color: "red" }}>50km/h</Text>.
                                </Text>
                            </View>
                        </View>
                        <View style={styles.component}>
                            <Text style={styles.title}>
                                TỐC ĐỘ TỐI ĐA CHO PHÉP NGOÀI KHU VỰC ĐÔNG DÂN CƯ
                            </Text>
                            <View style={{ paddingLeft: 8, marginTop: 10 }}>
                                <Text style={styles.text}>
                                    • Đường đôi, đường một chiều 2 làn xe trở lên:
                                </Text>
                                <Text style={styles.textChild}>
                                    - Ô tô kéo rơ moóc, trộn bê tông:{" "}
                                    <Text style={styles.redText}>60km/h</Text>.
                                </Text>
                                <Text style={styles.textChild}>
                                    - Mô tô, đầu kéo, ô tô buýt:{" "}
                                    <Text style={styles.redText}>70km/h</Text>.
                                </Text>
                                <Text style={styles.textChild}>
                                    - Ô tô trên 30 chỗ, tải trọng trên 3,5 tấn:{" "}
                                    <Text style={styles.redText}>80km/h</Text>.
                                </Text>
                                <Text style={styles.textChild}>
                                    - Ô tô ĐẾN 30 chỗ, tải trọng DƯỚI 3,5 tấn:{" "}
                                    <Text style={styles.redText}>90km/h</Text>.
                                </Text>
                                <Text style={styles.text}>
                                    • Đường hai chiều, đường một chiều có 1 làn xe:
                                </Text>
                                <Text style={styles.textChild}>
                                    - Ô tô kéo rơ moóc, trộn bê tông:{" "}
                                    <Text style={styles.redText}>50km/h</Text>.
                                </Text>
                                <Text style={styles.textChild}>
                                    - Mô tô, đầu kéo, ô tô buýt:{" "}
                                    <Text style={styles.redText}>60km/h</Text>.
                                </Text>
                                <Text style={styles.textChild}>
                                    - Ô tô trên 30 chỗ, tải trọng trên 3,5 tấn:{" "}
                                    <Text style={styles.redText}>70km/h</Text>.
                                </Text>
                                <Text style={styles.textChild}>
                                    - Ô tô ĐẾN 30 chỗ, tải trọng DƯỚI 3,5 tấn:{" "}
                                    <Text style={styles.redText}>80km/h</Text>.
                                </Text>
                            </View>
                        </View>

                        <View style={styles.component}>
                            <Text style={styles.title}>TỐC ĐỘ TỐI ĐA CHO PHÉP ĐỐI VỚI</Text>
                            <View style={{ paddingLeft: 8, marginTop: 10 }}>
                                <Text style={styles.text}>
                                    • Xe máy chuyên dùng, xe gắn máy (kể cả xe máy điện) và các
                                    loại xe tương tự trên đường bộ (trừ đường cao tốc):{" "}
                                    <Text style={styles.redText}>40km/h</Text>.
                                </Text>
                                <Text style={styles.text}>
                                    • Tốc độ tối đa cho phép của các loại xe cơ giới, xe máy
                                    chuyên dùng trên đường cao tốc phải tuân thủ tốc độ tối đa,
                                    tốc độ tối thiểu và không vượt quá:{" "}
                                    <Text style={styles.redText}>120km/h</Text>.
                                </Text>
                            </View>
                        </View>

                        <View style={styles.component}>
                            <Text style={styles.title}>
                                HIỆU LỆNH NGƯỜI ĐIỀU KHIỂN GIAO THÔNG
                            </Text>
                            <View style={{ paddingLeft: 8, marginTop: 10 }}>
                                <Text style={styles.text}>
                                    • Giơ tay thẳng đứng: Tất cả dừng, trừ xe đã ở trong ngã tư
                                    được phép đi.
                                </Text>
                                <Text style={styles.text}>
                                    • Giang ngang tay: Trái phải đi; Trước sau dừng.
                                </Text>
                                <Text style={styles.text}>
                                    • Tay phải giơ trước: Sau, phải dừng, trước rẽ phải, trái đi
                                    các hướng, người đi bộ qua đường đi sau người điều khiển.
                                </Text>
                            </View>
                        </View>
                        <View style={styles.component}>
                            <Text style={styles.title}>KHÁI NIỆM VÀ QUY TẮC</Text>
                            <View style={{ paddingLeft: 8, marginTop: 10 }}>
                                <Text style={styles.text}>
                                    • Tất cả các câu có đáp án bị nghiêm cấm, không cho phép hoặc
                                    không được phép thì chọn đáp án đó.
                                </Text>
                                <Text style={styles.text}>• Tốc độ chậm đi về bên phải.</Text>
                                <Text style={styles.text}>
                                    • Chỉ dùng sử dụng còi từ 5 giờ sáng đến 22 giờ tối.
                                </Text>
                                <Text style={styles.text}>
                                    • Trong đô thị sử dụng đèn chiếu gần.
                                </Text>
                                <Text style={styles.text}>
                                    • Không được phép lắp đặt còi đèn không đúng thiết kế, trừ phi
                                    được chấp thuận của cơ quan có thẩm quyền.
                                </Text>
                                <Text style={styles.text}>
                                    • Xe mô tô không được kéo xe khác.
                                </Text>
                                <Text style={styles.text}>
                                    • 05 năm không cấp lại nếu sử dụng bằng lái đã khai báo mất.
                                </Text>
                                <Text style={styles.text}>
                                    • Chuyển làn đường phải có tín hiệu báo trước.
                                </Text>
                                <Text style={styles.text}>
                                    • Xe thô sơ phải đi làn đường nên phải trong cùng.
                                </Text>
                                <Text style={styles.text}>
                                    • Tránh xe ngược chiều thì nhường đường qua đường hẹp và
                                    nhường xe lên dốc.
                                </Text>
                                <Text style={styles.text}>• Đứng cách ray đường sắt 5m.</Text>
                                <Text style={styles.text}>
                                    • Vào cao tốc phải nhường đường cho xe đang chạy trên đường.
                                </Text>
                                <Text style={styles.text}>
                                    • Xe thiết kế nhỏ hơn 70km/h không được vào cao tốc.
                                </Text>
                                <Text style={styles.text}>
                                    • Trên cao tốc chỉ được dừng xe, đỗ xe ở nơi quy định.
                                </Text>
                                <Text style={styles.text}>
                                    • Trong hầm chỉ được dừng xe, đỗ xe ở nơi quy định.
                                </Text>
                                <Text style={styles.text}>
                                    • Xe quá tải trọng phải do cơ quan quản lý đường bộ cấp phép.
                                </Text>
                                <Text style={styles.text}>
                                    • Trọng lượng xe kéo rơ moóc phải lớn hơn rơ moóc.
                                </Text>
                                <Text style={styles.text}>
                                    • Kéo xe không hệ thống hãm phải dùng thanh nối cứng.
                                </Text>
                                <Text style={styles.text}>Xe gắn máy tối đa 40km/h.</Text>
                                <Text style={styles.text}>
                                    • Xe cơ giới không bao gồm xe gắn máy.
                                </Text>
                                <Text style={styles.text}>
                                    • Đường có giải phân cách được xem là đường đôi.
                                </Text>
                                <Text style={styles.text}>
                                    • Giảm tốc độ, chú ý quan sát khi gặp biển báo nguy hiểm.
                                </Text>
                                <Text style={styles.text}>
                                    • Giảm tốc độ, đi sát về bên phải khi xe sau xin vượt.
                                </Text>
                                <Text style={styles.text}>
                                    • Điểm giao cắt đường sắt thì ưu tiên đường sắt.
                                </Text>
                                <Text style={styles.text}>
                                    • Nhường đường cho xe ưu tiên có tín hiệu còi, cờ, đèn.
                                </Text>
                                <Text style={styles.text}>
                                    • Không vượt xe khác trên đường vòng, khuất tầm nhìn.
                                </Text>
                                <Text style={styles.text}>
                                    • Nơi có vạch kẻ đường dành cho người đi bộ thì nhường đường.
                                </Text>
                                <Text style={styles.text}>
                                    • Dừng xe, đỗ xe cách lề đường, hè phố không quá 0,25 mét.
                                </Text>
                                <Text style={styles.text}>
                                    • Dừng xe, đỗ xe trên đường hẹp cách xe khác 20 mét.
                                </Text>
                                <Text style={styles.text}>
                                    • Giảm tốc độ trên đường ướt, đường hẹp và đèo dốc.
                                </Text>
                                <Text style={styles.text}>
                                    • Xe buýt đang dừng đón trả khách thì giảm tốc độ và từ từ
                                    vượt qua xe buýt.
                                </Text>
                            </View>
                        </View>
                        <View style={styles.component}>
                            <Text style={styles.title}>NGHIỆP VỤ VẬN TẢI</Text>
                            <View style={{ paddingLeft: 8, marginTop: 10 }}>
                                <Text style={styles.text}>
                                    • Không lái xe liên tục quá 4 giờ.
                                </Text>
                                <Text style={styles.text}>
                                    • Không làm việc 1 ngày của lái xe quá 10 giờ.
                                </Text>
                                <Text style={styles.text}>
                                    • Người kinh doanh vận tải không được tự ý thay đổi vị trí đón
                                    trả khách.
                                </Text>
                                <Text style={styles.text}>
                                    • Vận chuyển hàng nguy hiểm phải có giấy phép.
                                </Text>
                            </View>
                        </View>
                        <View style={styles.component}>
                            <Text style={styles.title}>KỸ THUẬT LÁI XE</Text>
                            <View style={{ paddingLeft: 8, marginTop: 10 }}>
                                <Text style={styles.text}>
                                    • Xe mô tô xuống dốc dài cần sử dụng cả phanh trước và phanh
                                    sau để giảm tốc độ.
                                </Text>
                                <Text style={styles.text}>
                                    • Khởi hành xe ô tô số tự động cần đạp phanh chân hết hành
                                    trình.
                                </Text>
                                <Text style={styles.text}>
                                    • Thực hiện phanh tay cần phải bóp khóa hãm đẩy cần phanh tay
                                    về phía trước.
                                </Text>
                                <Text style={styles.text}>
                                    • Khởi hành ô tô sử dụng hộp số đạp côn hết hành trình.
                                </Text>
                                <Text style={styles.text}>
                                    • Thực hiện quay đầu xe với tốc độ thấp.
                                </Text>
                                <Text style={styles.text}>
                                    • Lái xe ô tô qua đường sắt không rào chắn thì cách 5 mét hạ
                                    kính cửa, tắt âm thanh, quan sát.
                                </Text>
                                <Text style={styles.text}>
                                    • Mở cửa xe thì quan sát rồi mới mở hé cánh cửa.
                                </Text>
                            </View>
                        </View>
                        <View style={styles.component}>
                            <Text style={styles.title}>CẤU TẠO VÀ SỬA CHỮA</Text>
                            <View style={{ paddingLeft: 8, marginTop: 10 }}>
                                <Text style={styles.text}>
                                    • Yêu cầu của kính chắn gió, chọn “Loại kính an toàn“.
                                </Text>
                                <Text style={styles.text}>
                                    • Âm lượng của còi là từ 90dB đến 115 dB.
                                </Text>
                                <Text style={styles.text}>
                                    • Động cơ diesel không nổ do nhiên liệu lẫn tạp chất.
                                </Text>
                                <Text style={styles.text}>
                                    • Dây đai an toàn có cơ cấu hãm giữ chặt dây khi giật dây đột
                                    ngột.
                                </Text>
                                <Text style={styles.text}>
                                    • Động cơ 4 kỳ thì pít tông thực hiện 4 hành trình.
                                </Text>
                                <Text style={styles.text}>
                                    • Hệ thống bôi trơn giảm ma sát.
                                </Text>
                                <Text style={styles.text}>
                                    • Niên hạn ô tô trên 9 chỗ ngồi là 20 năm.
                                </Text>
                                <Text style={styles.text}>• Niên hạn ô tô tải là 25 năm.</Text>
                                <Text style={styles.text}>
                                    • Động cơ ô tô biến nhiệt năng thành cơ năng.
                                </Text>
                                <Text style={styles.text}>
                                    • Hệ thống truyền lực truyền mô men quay từ động cơ tới bánh
                                    xe.
                                </Text>
                                <Text style={styles.text}>
                                    • Ly hợp (côn) truyền hoặc ngắt truyền động từ động cơ đến hộp
                                    số.
                                </Text>
                                <Text style={styles.text}>
                                    • Hộp số ô tô đảm bảo chuyển động lùi.
                                </Text>
                                <Text style={styles.text}>
                                    • Hệ thống lái dùng để thay đổi hướng.
                                </Text>
                                <Text style={styles.text}>
                                    • Hệ thống phanh giúp giảm tốc độ.
                                </Text>
                                <Text style={styles.text}>• Ắc quy để tích trữ điện năng.</Text>
                                <Text style={styles.text}>
                                    • Khởi động xe tự động phải đạp phanh.
                                </Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    contentReveiwQuestion: {
        flex: 1,
        padding: 5,
        backgroundColor: "#fff",
        color: "#000",
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        elevation: 2,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    component: {
        padding: 8,
    },
    text: {
        lineHeight: 25,
        fontSize: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
    },
    textChild: {
        paddingLeft: 8,
        lineHeight: 25,
        fontSize: 16,
    },
    redText: {
        color: "red",
    },
});
