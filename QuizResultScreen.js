import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';

const QuizResultScreen = ({ route, navigation }) => {
  const { score, total, incorrectAnswers = [] } = route.params;

  return (
    <ImageBackground source={require('./assets/login_background.jpg')} style={styles.background}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Quiz Completed</Text>
          <Text style={styles.result}>Score: {((score / total) * 100).toFixed(2)}% ({score} out of {total})</Text>
          {incorrectAnswers.length > 0 && (
            <View style={styles.incorrectAnswersContainer}>
              <Text style={styles.incorrectTitle}>Incorrect Answers:</Text>
              {incorrectAnswers.map((item, index) => (
                <View key={index} style={styles.incorrectAnswer}>
                  <Text style={styles.questionText}>Q: {item.question}</Text>
                  <Text style={styles.answerText}>Correct: {item.correctAnswer}</Text>
                  <Text style={styles.answerText}>Your Answer: {item.selectedOption}</Text>
                </View>
              ))}
            </View>
          )}
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.buttonText}>Go Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 20,
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  result: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  incorrectAnswersContainer: {
    marginTop: 20,
    width: '100%',
  },
  incorrectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  incorrectAnswer: {
    marginBottom: 10,
  },
  questionText: {
    fontSize: 16,
    color: '#333',
  },
  answerText: {
    fontSize: 16,
    color: '#d32f2f',
  },
  button: {
    backgroundColor: '#f7b731', // Bright yellow
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default QuizResultScreen;
