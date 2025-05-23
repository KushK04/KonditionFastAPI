import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { LineChart, PieChart } from 'react-native-svg-charts';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  // TODO: Replace with real data
  const bmiValue = '20.1';
  const { name } = useUser();
  const heartRateData = [60, 62, 65, 70, 75, 78, 80, 82, 79, 76];
  const waterIntake = '4L';
  const sleepHours = '8h 20m';
  const caloriesBurnt = 760;
  const caloriesLeft = 230;
  const workoutProgressData = [20, 40, 30, 60, 90, 80, 70];
  const workoutDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const latestWorkouts = [
    { id: '1', type: 'Fullbody Workout', calories: 180, duration: '20 minutes', icon: require('../assets/images/fullbody.png') },
    { id: '2', type: 'Lowerbody Workout', calories: 200, duration: '30 minutes', icon: require('../assets/images/lowerbody.png') },
    // ... more workouts
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome Back,</Text>
          <Text style={styles.userName}>{name}</Text>
          <TouchableOpacity style={styles.notificationBtn} onPress={() => router.push('/notification')}>
            <Image source={require('../assets/images/bell.png')} style={styles.bellIcon} />
          </TouchableOpacity>
        </View>

        {/* BMI Card */}
        <View style={styles.bmiCard}>
          <View style={styles.bmiInfo}>
            <Text style={styles.bmiLabel}>BMI (Body Mass Index)</Text>
            <Text style={styles.bmiStatus}>You have a normal weight</Text>
            <TouchableOpacity style={styles.viewMoreBtn} onPress={() => alert('BMI screen not yet implemented')}>
              <Text style={styles.viewMoreText}>View More</Text>
            </TouchableOpacity>
          </View>
          <PieChart
            style={styles.bmiPie}
            data={[
              { value: parseFloat(bmiValue), svg: { fill: '#A3C9FD' } },
              { value: 30 - parseFloat(bmiValue), svg: { fill: '#E5EFFF' } },
            ]}
            innerRadius={40}
            outerRadius={50}
          />
          <View style={styles.bmiOverlay}>
            <Text style={styles.bmiValue}>{bmiValue}</Text>
          </View>
        </View>

        {/* Today Target */}
        <View style={styles.targetCard}>
          <Text style={styles.targetText}>Today Target</Text>
          <TouchableOpacity style={styles.checkBtn} onPress={() => alert('Targets screen not yet implemented')}>
            <Text style={styles.checkText}>Check</Text>
          </TouchableOpacity>
        </View>

        {/* Activity Status */}
        <Text style={styles.sectionTitle}>Activity Status</Text>
        <View style={styles.activityCard}>
          <Text style={styles.activityLabel}>Heart Rate</Text>
          <Text style={styles.activityValue}>78 BPM</Text>
          <LineChart
            style={styles.lineChart}
            data={heartRateData}
            svg={{ stroke: '#91D5A1', strokeWidth: 2 }}
            contentInset={{ top: 10, bottom: 10 }}
          />
          <View style={styles.timestampBadge}>
            <Text style={styles.timestampText}>3 mins ago</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statsCard}>
            <Text style={styles.statsLabel}>Water Intake</Text>
            <Text style={styles.statsValue}>{waterIntake}</Text>
          </View>
          <View style={styles.statsCard}>
            <Text style={styles.statsLabel}>Sleep</Text>
            <Text style={styles.statsValue}>{sleepHours}</Text>
          </View>
          <View style={styles.statsCardSmall}>
            <Text style={styles.statsLabel}>Calories</Text>
            <Text style={styles.statsValue}>{caloriesBurnt} kCal</Text>
            <PieChart
              style={{ height: 80 }}
              data={[
                { value: caloriesBurnt, svg: { fill: '#FFC069' } },
                { value: caloriesLeft, svg: { fill: '#FFECCE' } },
              ]}
              innerRadius={20}
              outerRadius={25}
            />
            <View style={styles.calOverlay}>
              <Text style={styles.calOverlayText}>{caloriesLeft} kCal</Text>
            </View>
          </View>
        </View>

        {/* Workout Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.sectionTitle}>Workout Progress</Text>
            <TouchableOpacity onPress={() => {/* toggle weekly/monthly */}}>
              <Text style={styles.periodToggle}>Weekly ▼</Text>
            </TouchableOpacity>
          </View>
          <LineChart
            style={styles.progressChart}
            data={workoutProgressData}
            svg={{ stroke: '#B07FFD', strokeWidth: 2 }}
            contentInset={{ top: 10, bottom: 10 }}
            gridMin={0}
            gridMax={100}
          />
          <View style={styles.daysRow}>
            {workoutDays.map(day => (
              <Text key={day} style={styles.dayText}>{day}</Text>
            ))}
          </View>
        </View>

        {/* Latest Workout */}
        <View style={styles.latestSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest Workout</Text>
            <TouchableOpacity onPress={() => alert('Workout List not yet implemented')}>
              <Text style={styles.seeMore}>See more</Text>
            </TouchableOpacity>
          </View>
          {latestWorkouts.map(w => (
            <TouchableOpacity key={w.id} style={styles.workoutItem} onPress={() => alert('Workout Details not yet implemented')}>
              <Image source={w.icon} style={styles.workoutIcon} />
              <View style={styles.workoutInfo}>
                <Text style={styles.workoutType}>{w.type}</Text>
                <Text style={styles.workoutMeta}>{w.calories} Calories Burn | {w.duration}</Text>
              </View>
              <Image source={require('../assets/images/arrow-right.png')} style={styles.arrowIcon} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.push('/home')}>
          <Image source={require('../assets/images/home-active.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => alert('Progress screen not yet implemented')}>
          <Image source={require('../assets/images/chart.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => alert('Search screen not yet implemented')} style={styles.centerButton}>
          <Image source={require('../assets/images/search.png')} style={styles.searchIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => alert('Camera screen not yet implemented')}>
          <Image source={require('../assets/images/camera.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Image source={require('../assets/images/user.png')} style={styles.navIcon} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 16, paddingBottom: 80 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  welcomeText: { fontSize: 16, color: '#777' },
  userName: { fontSize: 24, fontWeight: 'bold', marginLeft: 8, color: '#333' },
  notificationBtn: { marginLeft: 'auto' },
  bellIcon: { width: 24, height: 24 },
  bmiCard: {
    flexDirection: 'row',
    backgroundColor: '#E5F1FF',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  bmiInfo: { flex: 2 },
  bmiLabel: { fontSize: 14, color: '#555' },
  bmiStatus: { fontSize: 16, marginVertical: 4, color: '#333' },
  viewMoreBtn: { backgroundColor: '#70A1FF', borderRadius: 12, paddingVertical: 6, paddingHorizontal: 12, marginTop: 8, alignSelf: 'flex-start' },
  viewMoreText: { color: '#FFF' },
  bmiPie: { height: 100, width: 100, flex: 1 },
  bmiOverlay: { position: 'absolute', right: 32, top: 32, alignItems: 'center' },
  bmiValue: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  targetCard: { flexDirection: 'row', backgroundColor: '#F5F8FF', borderRadius: 16, padding: 16, alignItems: 'center', marginBottom: 24 },
  targetText: { fontSize: 16, color: '#333' },
  checkBtn: { marginLeft: 'auto', backgroundColor: '#A3C9FD', borderRadius: 12, paddingVertical: 6, paddingHorizontal: 12 },
  checkText: { color: '#FFF' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  activityCard: { backgroundColor: '#F0F6FF', borderRadius: 16, padding: 16, marginBottom: 24 },
  activityLabel: { fontSize: 14, color: '#555' },
  activityValue: { fontSize: 20, fontWeight: 'bold', marginVertical: 8, color: '#333' },
  lineChart: { height: 80, width: '100%' },
  timestampBadge: { position: 'absolute', right: 16, top: 16, backgroundColor: '#FFC0CB', borderRadius: 12, paddingVertical: 4, paddingHorizontal: 8 },
  timestampText: { fontSize: 12, color: '#FFF' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 },
  statsCard: { width: '48%', backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  statsCardSmall: { width: '48%', backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 16, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  statsLabel: { fontSize: 14, color: '#555' },
  statsValue: { fontSize: 18, fontWeight: 'bold', marginVertical: 8, color: '#333' },
  calOverlay: { position: 'absolute', top: 28, alignItems: 'center' },
  calOverlayText: { fontSize: 14, fontWeight: 'bold', color: '#FFF' },
  progressSection: { marginBottom: 24 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  periodToggle: { fontSize: 14, color: '#777' },
  progressChart: { height: 100, width: '100%' },
  daysRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  dayText: { fontSize: 12, color: '#777' },
  latestSection: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  seeMore: { fontSize: 14, color: '#70A1FF' },
  workoutItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFF', borderRadius: 16, padding: 12, marginBottom: 12 },
  workoutIcon: { width: 40, height: 40, marginRight: 12 },
  workoutInfo: { flex: 1 },
  workoutType: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  workoutMeta: { fontSize: 12, color: '#777', marginTop: 4 },
  arrowIcon: { width: 24, height: 24, tintColor: '#777' },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#FFF', borderTopWidth: 1, borderColor: '#EEE' },
  navIcon: { width: 24, height: 24 },
  centerButton: { backgroundColor: '#fff', padding: 12, borderRadius: 24, elevation: 4 },
  searchIcon: { width: 28, height: 28 },
});

export default HomeScreen;
