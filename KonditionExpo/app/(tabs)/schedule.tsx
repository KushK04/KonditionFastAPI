import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { SafeAreaView, ScrollView } from 'react-native';
import { Button } from '@/components/ui/Button';

const ScheduleScreen = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [plan, setPlan] = useState('');
  const [plans, setPlans] = useState<{ [key: string]: string }>({});

  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
    setPlan(plans[day.dateString] || '');
    setModalVisible(true);
  };

  const handleSavePlan = () => {
    if (selectedDate) {
      setPlans({ ...plans, [selectedDate]: plan });
    }
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>Schedule</Text>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={Object.keys(plans).reduce((acc, date) => {
            acc[date] = { marked: true, dotColor: '#70A1FF' };
            return acc;
          }, {} as any)}
          theme={{
            selectedDayBackgroundColor: '#70A1FF',
            todayTextColor: '#70A1FF',
            arrowColor: '#70A1FF'
          }}
        />

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Plan for {selectedDate}</Text>
              <TextInput
                style={styles.input}
                value={plan}
                onChangeText={setPlan}
                placeholder="Enter workout plan..."
                multiline
              />
              <View style={styles.modalButtons}>
                <Button title="Save" onPress={handleSavePlan} />
                <Button title="Cancel" variant="outline" onPress={() => setModalVisible(false)} />
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  input: {
    minHeight: 80,
    borderColor: '#70A1FF',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ScheduleScreen;
