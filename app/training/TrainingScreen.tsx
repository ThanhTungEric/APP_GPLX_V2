import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, FlatList } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useRouter } from 'expo-router';
import DrivingCenters from './DrivingCenters';

const TrainingScreen = () => {
    const router = useRouter();
    const [provinces, setProvinces] = useState<{ code: string; name: string }[]>([]);
    const [districts, setDistricts] = useState<{ code: string; name: string }[]>([]);
    const [communes, setCommunes] = useState<{ code: string; name: string }[]>([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedCommune, setSelectedCommune] = useState('');

    const [provinceOpen, setProvinceOpen] = useState(false);
    const [districtOpen, setDistrictOpen] = useState(false);
    const [communeOpen, setCommuneOpen] = useState(false);

    useEffect(() => {
        fetch('https://provinces.open-api.vn/api/')
            .then((response) => response.json())
            .then((data) => {
                setProvinces(data);
            })
            .catch((error) => console.error('Error fetching provinces:', error));
    }, []);

    const handleProvinceChange = (provinceCode: string) => {
        setSelectedProvince(provinceCode);
        setSelectedDistrict('');
        setSelectedCommune('');
        fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
            .then((response) => response.json())
            .then((data) => setDistricts(data.districts))
            .catch((error) => console.error('Error fetching districts:', error));
    };

    const handleDistrictChange = (districtCode: string) => {
        setSelectedDistrict(districtCode);
        setSelectedCommune('');
        fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
            .then((response) => response.json())
            .then((data) => setCommunes(data.wards))
            .catch((error) => console.error('Error fetching communes:', error));
    };

    const handleCommuneChange = (communeCode: string) => {
        setSelectedCommune(communeCode);
    };

    // Dữ liệu mặc định cho các trung tâm dạy lái xe
    const defaultCenters = [
        {
            id: 1,
            name: 'Trung Tâm Dạy Lái Xe A',
            provinceName: 'Hà Nội',
            districtName: 'Ba Đình',
            communeName: 'Phúc Xá',
            avt: "https://png.pngtree.com/png-clipart/20240105/original/pngtree-traffic-stop-sign-symbol-photo-png-image_14019657.png",
            rating: 4.9,
            reviews: 120,
            description: 'Trung tâm đào tạo lái xe chuyên nghiệp với đội ngũ giáo viên giàu kinh nghiệm.',
            phone: '0123-456-789',
            website: 'https://trungtamlaixe-a.com',
            detailedAddress: '123 Đường ABC, Phường XYZ, Quận DEF',
            userReviews: [
                { user: 'Nguyễn Văn A', comment: 'Rất tốt!', rating: 5 },
                { user: 'Trần Thị B', comment: 'Giáo viên nhiệt tình.', rating: 4 },
            ],
        },
        {
            id: 2,
            name: 'Trung Tâm Dạy Lái Xe B',
            provinceName: 'Hà Nội',
            districtName: 'Đống Đa',
            communeName: 'Cát Linh',
            rating: 5,
            reviews: 200,
            description: 'Trung tâm hiện đại với cơ sở vật chất tiên tiến.',
            phone: '0987-654-321',
            website: 'https://trungtamlaixe-b.com',
            detailedAddress: '456 Đường DEF, Phường UVW, Quận XYZ',
            userReviews: [
                { user: 'Lê Văn C', comment: 'Cơ sở vật chất tốt.', rating: 5 },
                { user: 'Phạm Thị D', comment: 'Học phí hợp lý.', rating: 4.5 },
            ],
        },
        {
            id: 3,
            name: 'Trung Tâm Dạy Lái Xe C',
            provinceName: 'Hồ Chí Minh',
            districtName: 'Quận 1',
            communeName: 'Bến Nghé',
            rating: 3,
            reviews: 80,
            description: 'Trung tâm phù hợp cho người mới bắt đầu.',
            phone: '0345-678-910',
            website: 'https://trungtamlaixe-c.com',
            detailedAddress: '789 Đường GHI, Phường JKL, Quận MNO',
            userReviews: [
                { user: 'Nguyễn Văn E', comment: 'Cần cải thiện dịch vụ.', rating: 3 },
                { user: 'Trần Thị F', comment: 'Học phí hơi cao.', rating: 2.5 },
            ],
        },
        {
            id: 4,
            name: 'Trung Tâm Dạy Lái Xe D',
            provinceName: 'Hà Nội',
            districtName: 'Đống Đa',
            communeName: 'Cát Linh',
            rating: 4,
            reviews: 150,
            description: 'Trung tâm uy tín với nhiều năm kinh nghiệm.',
            phone: '0567-890-123',
            website: 'https://trungtamlaixe-d.com',
            detailedAddress: '321 Đường PQR, Phường STU, Quận VWX',
            userReviews: [
                { user: 'Lê Văn G', comment: 'Giáo viên tận tâm.', rating: 4 },
                { user: 'Phạm Thị H', comment: 'Thời gian học linh hoạt.', rating: 4.5 },
            ],
        },
    ];

    // Hàm chuẩn hóa tên (loại bỏ tiền tố không cần thiết)
    const normalizeName = (name: string) => {
        return name
            .replace(/^(Thành phố|Tỉnh|Huyện|Quận|Phường|Xã)\s+/i, '') // Loại bỏ tiền tố
            .trim(); // Loại bỏ khoảng trắng thừa
    };

    // Lọc danh sách trung tâm theo tên tỉnh, huyện, xã đã chọn
    const filteredCenters = defaultCenters.filter(
        (center) =>
            normalizeName(center.provinceName) === normalizeName(provinces.find((p) => p.code === selectedProvince)?.name || '') &&
            normalizeName(center.districtName) === normalizeName(districts.find((d) => d.code === selectedDistrict)?.name || '') &&
            normalizeName(center.communeName) === normalizeName(communes.find((c) => c.code === selectedCommune)?.name || '')
    );

    const renderContent = () => (
        <>
            <Text style={styles.title}>Đào Tạo Lái Xe</Text>
            <Text style={styles.description}>
                Chọn tỉnh, huyện, xã để tìm thông tin đào tạo lái xe.
            </Text>

            {/* Dropdowns on the same row */}
            <View style={styles.dropdownRow}>
                {/* Province Dropdown */}
                <View style={styles.dropdownWrapper}>
                    <Text style={styles.label}>Tỉnh/Thành:</Text>
                    <DropDownPicker
                        listMode="MODAL"
                        open={provinceOpen}
                        value={selectedProvince}
                        items={provinces.map((province) => ({
                            label: province.name,
                            value: province.code,
                        }))}
                        setOpen={setProvinceOpen}
                        setValue={setSelectedProvince}
                        setItems={setProvinces}
                        onChangeValue={(value) => value && handleProvinceChange(value)}
                        placeholder="Chọn Tỉnh/Thành Phố"
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownContainer}
                    />

                </View>

            </View>
            <View style={styles.dropdownRow}>

                {/* District Dropdown */}
                <View style={styles.dropdownWrapper}>
                    <Text style={styles.label}>Quận/Huyện:</Text>
                    <DropDownPicker
                        listMode="MODAL"
                        open={districtOpen}
                        value={selectedDistrict}
                        items={districts.map((district) => ({
                            label: district.name,
                            value: district.code,
                        }))}
                        setOpen={setDistrictOpen}
                        setValue={setSelectedDistrict}
                        onChangeValue={(value) => value && handleDistrictChange(value)}
                        placeholder="Huyện"
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownContainer}
                        zIndex={2000}
                        zIndexInverse={2000}
                    />
                </View>

                <View style={styles.dropdownWrapper}>
                    <Text style={styles.label}>Phường/Xã:</Text>
                    <DropDownPicker
                        listMode="MODAL"
                        open={communeOpen}
                        value={selectedCommune}
                        items={communes.map((commune) => ({
                            label: commune.name,
                            value: commune.code,
                        }))}
                        setOpen={setCommuneOpen}
                        setValue={setSelectedCommune}
                        onChangeValue={(value) => value && handleCommuneChange(value)}
                        placeholder="Xã"
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownContainer}
                        zIndex={1000}
                        zIndexInverse={3000}
                    />
                </View>

            </View>


            {/* Display Selected Information */}
            {selectedCommune && (
                <>
                    {/* <View style={styles.resultContainer}>
                        <Text style={styles.resultText}>Tỉnh/Thành Phố: {provinces.find(p => p.code === selectedProvince)?.name}</Text>
                        <Text style={styles.resultText}>Quận/Huyện: {districts.find(d => d.code === selectedDistrict)?.name}</Text>
                        <Text style={styles.resultText}>Phường/Xã: {communes.find(c => c.code === selectedCommune)?.name}</Text>
                    </View> */}

                    {/* Driving Centers */}
                    <DrivingCenters centers={filteredCenters} />
                </>
            )}
        </>
    );

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <FlatList
                data={[{}]}
                renderItem={renderContent}
                keyExtractor={(_, index) => index.toString()}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled={true}
            />
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#007AFF' },
    description: { fontSize: 16, marginBottom: 30, textAlign: 'center', color: '#333' },
    dropdownRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    dropdownWrapper: {
        flex: 1,
        marginHorizontal: 5 // Space between dropdowns
    },
    label: { fontSize: 14, fontWeight: 'bold', marginBottom: 5, color: '#333', textAlign: 'left' },
    dropdown: { backgroundColor: '#fff', borderRadius: 8, borderColor: '#ccc', zIndex: 10 },
    dropdownContainer: { borderColor: 'red', height: 150 },
    resultContainer: { marginTop: 20, padding: 15, backgroundColor: '#E3F2FD', borderRadius: 8 },
    resultText: { fontSize: 16, color: '#333', marginBottom: 5 },
});

export default TrainingScreen;
