import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Alert, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import useOCRHook from './OCRHook';
import { useNavigation } from '@react-navigation/native';

const CustomQuizScreen = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [numQuestions, setNumQuestions] = useState(10);
  const [timeDuration, setTimeDuration] = useState(30);
  const { processImage } = useOCRHook();
  const navigation = useNavigation();

  const handleImageSelection = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        if (imageUri) {
          setSelectedImage(imageUri);
        } else {
          throw new Error('Image URI is null or undefined');
        }
      } else {
        throw new Error('Image selection was cancelled or no assets found');
      }
    } catch (error) {
      console.error('Image selection failed: ', error);
      Alert.alert('Image Selection Error', error.message, [{ text: 'OK' }]);
    }
  };

  const handleGenerateQuiz = async () => {
    try {
      const base64Image = await FileSystem.readAsStringAsync(selectedImage, { encoding: FileSystem.EncodingType.Base64 });
      const imageBase64 = `data:image/png;base64,${base64Image}`;
      setProcessing(true);
      const extractedText = await processOCR(imageBase64);
      await generateQuestionsFromText(extractedText, numQuestions);
      setProcessing(false);
    } catch (error) {
      console.error('Quiz generation failed: ', error);
      Alert.alert('Quiz Generation Error', error.message, [{ text: 'OK' }]);
    }
  };

  const processOCR = async (imageBase64) => {
    try {
      const result = await processImage(imageBase64);
      const extractedText = result.ParsedResults[0].ParsedText;
      console.log('Extracted Text:', extractedText);
      return extractedText;
    } catch (error) {
      console.error('OCR Processing Error:', error);
      Alert.alert('OCR Processing Error', error.message, [{ text: 'OK' }]);
    }
  };

  const generateQuestionsFromText = async (text, numQuestions) => {
    const options = {
      method: 'POST',
      url: 'https://open-ai21.p.rapidapi.com/conversationgpt35',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': '6bec99d57fmsh2dc1f817b91f344p1571b9jsndc8c97fa21fb',
        'X-RapidAPI-Host': 'open-ai21.p.rapidapi.com'
      },
      data: {
        messages: [
          {
            role: 'user',
            content: `Generate ${numQuestions} quiz questions from the following text: ${text}`
          }
        ],
        web_access: false
      }
    };

    try {
      const response = await axios.request(options);
      console.log('Full Response from ChatGPT:', response.data);

      if (response.data && response.data.result) {
        const questions = parseQuestions(response.data.result.trim());
        console.log('Generated Questions:', questions);
        
        if (questions.length > 0) {
          navigation.replace('Quiz', { questions, timeDuration });
        } else {
          throw new Error('No questions generated');
        }
      } else {
        console.error('Unexpected response structure:', response.data);
        throw new Error('Unexpected response structure from ChatGPT API');
      }
    } catch (error) {
      console.error('Question Generation Error:', error);
      Alert.alert('Question Generation Error', error.message, [{ text: 'OK' }]);
    }
  };

  const parseQuestions = (text) => {
    const lines = text.split('\n');
    const questions = [];
    let currentQuestion = null;

    lines.forEach(line => {
      if (/^\d+\.\s/.test(line)) {
        if (currentQuestion) {
          questions.push(currentQuestion);
        }
        currentQuestion = {
          question: line.replace(/^\d+\.\s/, '').trim(),
          options: [],
          correctAnswer: ''
        };
      } else if (/^[A-D]\)/.test(line)) {
        if (currentQuestion) {
          currentQuestion.options.push(line.trim());
        }
      } else if (line.startsWith('Answer:')) {
        if (currentQuestion) {
          currentQuestion.correctAnswer = line.substring(7).trim();
        }
      }
    });

    if (currentQuestion) {
      questions.push(currentQuestion);
    }

    // Ensure there are exactly 4 options per question
    questions.forEach(question => {
      if (question.options.length < 4) {
        while (question.options.length < 4) {
          question.options.push('Option missing');
        }
      } else if (question.options.length > 4) {
        question.options = question.options.slice(0, 4);
      }
    });

    return questions;
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
        <Text style={styles.title}>Upload your Quiz image</Text>
        <TouchableOpacity style={styles.customQuizButton} onPress={handleImageSelection}>
          <Text style={styles.customQuizButtonText}>Select Image</Text>
        </TouchableOpacity>
        {selectedImage && (
          <Image source={{ uri: selectedImage }} style={styles.image} resizeMode="contain" />
        )}
        {selectedImage && !processing && (
          <>
            <ScrollView style={styles.optionsContainer}>
              <Text style={styles.optionTitle}>Number of Questions</Text>
              <View style={styles.optionsRow}>
                {[10, 20, 30, 40, 50].map(num => renderOptionButton(`${num}`, num, numQuestions, setNumQuestions))}
              </View>

              <Text style={styles.optionTitle}>Time Duration</Text>
              <View style={styles.optionsRow}>
                {[10, 20, 30, 40, 50, 60].map(num => renderOptionButton(`${num} minutes`, num, timeDuration, setTimeDuration))}
              </View>
            </ScrollView>
            <TouchableOpacity style={styles.customQuizButton} onPress={handleGenerateQuiz}>
              <Text style={styles.customQuizButtonText}>Generate Quiz</Text>
            </TouchableOpacity>
          </>
        )}
        {processing && <Text>Processing image...</Text>}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 20,
    width: '100%',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: 'black',
  },
  image: {
    width: 300,
    height: 300,
    marginVertical: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#FFD700',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
    backgroundColor: '#fff',
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
    textAlign: 'center',
  },
});

export default CustomQuizScreen;
