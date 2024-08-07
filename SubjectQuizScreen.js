import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';
import artsQuiz from './assets/quizzes/arts.json';
import biologyQuiz from './assets/quizzes/Biology.json';
import chemistryQuiz from './assets/quizzes/Chemistry.json';
import englishQuiz from './assets/quizzes/English.json';
import geographyQuiz from './assets/quizzes/Geography.json';
import historyQuiz from './assets/quizzes/history.json';
import mathematicsQuiz from './assets/quizzes/mathematics.json';
import physicalEducationQuiz from './assets/quizzes/Physical Education.json';
import physicsQuiz from './assets/quizzes/Physics.json';
import scienceQuiz from './assets/quizzes/science.json';

const SubjectQuizScreen = ({ navigation }) => {
  const [numQuizzes, setNumQuizzes] = useState(10);
  const [timeDuration, setTimeDuration] = useState(30);
  const [selectedSubject, setSelectedSubject] = useState('Arts');

  const getQuestionsForSubject = (subject) => {
    switch (subject) {
      case 'Arts': return artsQuiz.quizzes;
      case 'Biology': return biologyQuiz.quizzes;
      case 'Chemistry': return chemistryQuiz.quizzes;
      case 'English': return englishQuiz.quizzes;
      case 'Geography': return geographyQuiz.quizzes;
      case 'History': return historyQuiz.quizzes;
      case 'Mathematics': return mathematicsQuiz.quizzes;
      case 'Physical Education': return physicalEducationQuiz.quizzes;
      case 'Physics': return physicsQuiz.quizzes;
      case 'Science': return scienceQuiz.quizzes;
      default: return [];
    }
  };

  const handleStartQuiz = () => {
    const questions = getQuestionsForSubject(selectedSubject).slice(0, numQuizzes);
    navigation.replace('Quiz', { questions, timeDuration });
  };

  const renderOptionButton = (label, value, selectedValue, onSelect) => (
    <TouchableOpacity
      style={[styles.optionButton, selectedValue === value && styles.selectedOptionButton]}
      onPress={() => onSelect(value)}
    >
      <Text style={styles.optionButtonText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground source={require('./assets/login_background.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Quiz Options</Text>
        <ScrollView style={styles.optionsContainer}>
          <Text style={styles.optionTitle}>Select Subject</Text>
          <View style={styles.optionsRow}>
            {renderOptionButton('Arts', 'Arts', selectedSubject, setSelectedSubject)}
            {renderOptionButton('Biology', 'Biology', selectedSubject, setSelectedSubject)}
            {renderOptionButton('Chemistry', 'Chemistry', selectedSubject, setSelectedSubject)}
            {renderOptionButton('English', 'English', selectedSubject, setSelectedSubject)}
            {renderOptionButton('Geography', 'Geography', selectedSubject, setSelectedSubject)}
            {renderOptionButton('History', 'History', selectedSubject, setSelectedSubject)}
            {renderOptionButton('Mathematics', 'Mathematics', selectedSubject, setSelectedSubject)}
            {renderOptionButton('Physical Education', 'Physical Education', selectedSubject, setSelectedSubject)}
            {renderOptionButton('Physics', 'Physics', selectedSubject, setSelectedSubject)}
            {renderOptionButton('Science', 'Science', selectedSubject, setSelectedSubject)}
          </View>

          <Text style={styles.optionTitle}>Number of Questions</Text>
          <View style={styles.optionsRow}>
            {[10, 20, 30, 40, 50].map(num => renderOptionButton(`${num}`, num, numQuizzes, setNumQuizzes))}
          </View>

          <Text style={styles.optionTitle}>Time Duration</Text>
          <View style={styles.optionsRow}>
            {[10, 20, 30, 40, 50, 60].map(num => renderOptionButton(`${num} minutes`, num, timeDuration, setTimeDuration))}
          </View>
        </ScrollView>
        <TouchableOpacity style={styles.customQuizButton} onPress={handleStartQuiz}>
          <Text style={styles.customQuizButtonText}>Start Quiz</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsContainer: {
    flex: 1,
    width: '100%',
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
    textAlign: 'center',
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#f7b731',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    margin: 5,
  },
  selectedOptionButton: {
    backgroundColor: '#ec971f',
  },
  optionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  customQuizButton: {
    backgroundColor: '#f7b731',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  customQuizButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SubjectQuizScreen;
