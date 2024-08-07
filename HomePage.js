import React from 'react';
import { View, Text, ScrollView, ImageBackground } from 'react-native';
import CustomButton from './CustomButton';
import styles from './styles';

const HomePage = ({ navigation }) => {
  const classes = [
    { id: 1, name: 'Class 1' },
    { id: 2, name: 'Class 2' },
    { id: 3, name: 'Class 3' },
    { id: 4, name: 'Class 4' },
    { id: 5, name: 'Class 5' },
  ];

  const handleClassPress = (classId) => {
    navigation.navigate('SubjectQuiz', { classId });
  };

  const handleCustomQuizPress = () => {
    navigation.navigate('CustomQuiz');
  };

  return (
    <ImageBackground source={require('./assets/login_background.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Classes</Text>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {classes.map(item => (
            <CustomButton
              key={item.id}
              onPress={() => handleClassPress(item.id)}
              title={item.name}
              style={{marginTop: 20}}
            />
          ))}
        </ScrollView>
        <CustomButton
          onPress={handleCustomQuizPress}
          title="Custom Quiz"
          style={{ marginTop: 20 }}
        />
      </View>
    </ImageBackground>
  );
};

export default HomePage;
