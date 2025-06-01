import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, FlatList } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useRouter } from 'expo-router';

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

    const renderContent = () => (
        <>
            <Text style={styles.title}>Đào Tạo Lái Xe</Text>
            <Text style={styles.description}>
                Chọn tỉnh, huyện, xã để tìm thông tin đào tạo lái xe.
            </Text>

            <View style={styles.dropdownRow}>
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

            <View style={styles.resultContainer}>
                <Text style={styles.resultText}>Văn phòng đào tạo lái xe thầy Thường</Text>
                <Text style={styles.resultText}>Địa chỉ: 124 Trần Ngọc Lên, Định Hoà, Thủ Dầu Một, Bình Dương</Text>
                <Text style={styles.resultText}>Điện thoại: 0344 449 778</Text>
            </View>
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
        marginHorizontal: 5
    },
    label: { fontSize: 14, fontWeight: 'bold', marginBottom: 5, color: '#333', textAlign: 'left' },
    dropdown: { backgroundColor: '#fff', borderRadius: 8, borderColor: '#ccc', zIndex: 10 },
    dropdownContainer: { borderColor: 'red', height: 150 },
    resultContainer: { marginTop: 20, padding: 15, backgroundColor: '#E3F2FD', borderRadius: 8 },
    resultText: { fontSize: 16, color: '#333', marginBottom: 5 },
});

export default TrainingScreen;
