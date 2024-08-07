import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground, BackHandler } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

interface Question {
    question: string;
    options: string[];
    answer: string;
}

interface IncorrectAnswer {
    question: string;
    correctAnswer: string;
    selectedOption: string;
}

interface QuizScreenProps {
    navigation: StackNavigationProp<any>;
    route: RouteProp<{ params: { questions: Question[]; timeDuration: number } }, 'params'>;
}

interface QuizScreenState {
    currentQuestionIndex: number;
    score: number;
    timer: number;
    incorrectAnswers: IncorrectAnswer[];
}

class QuizScreen extends Component<QuizScreenProps, QuizScreenState> {
    private interval: NodeJS.Timeout | null = null;

    constructor(props: QuizScreenProps) {
        super(props);
        const { timeDuration } = props.route.params;
        this.state = {
            currentQuestionIndex: 0,
            score: 0,
            timer: timeDuration * 60,
            incorrectAnswers: [],
        };
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            this.setState(
                (prevState) => ({ timer: prevState.timer - 1 }),
                () => {
                    if (this.state.timer <= 0) {
                        if (this.interval) {
                            clearInterval(this.interval);
                        }
                        this.props.navigation.replace('QuizResult', {
                            score: this.state.score,
                            total: this.props.route.params.questions.length,
                            incorrectAnswers: this.state.incorrectAnswers,
                        });
                    }
                }
            );
        }, 1000);

        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval);
        }
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        return true;
    };

    handleAnswer = (answer: string) => {
        const currentQuestion = this.props.route.params.questions[this.state.currentQuestionIndex];
        if (answer === currentQuestion.answer) {
            this.setState((prevState) => ({ score: prevState.score + 1 }));
        } else {
            this.setState((prevState) => ({
                incorrectAnswers: [
                    ...prevState.incorrectAnswers,
                    {
                        question: currentQuestion.question,
                        correctAnswer: currentQuestion.answer,
                        selectedOption: answer,
                    },
                ],
            }));
        }

        if (this.state.currentQuestionIndex < this.props.route.params.questions.length - 1) {
            this.setState((prevState) => ({ currentQuestionIndex: prevState.currentQuestionIndex + 1 }));
        } else {
            this.props.navigation.replace('QuizResult', {
                score: this.state.score,
                total: this.props.route.params.questions.length,
                incorrectAnswers: this.state.incorrectAnswers,
            });
        }
    };

    render() {
        const { questions } = this.props.route.params;
        const { currentQuestionIndex, timer } = this.state;

        if (!questions || questions.length === 0) {
            return (
                <View style={styles.container}>
                    <Text style={styles.errorText}>Error: Question data is missing or malformed.</Text>
                </View>
            );
        }

        const currentQuestion = questions[currentQuestionIndex];

        return (
            <ImageBackground source={require('./assets/login_background.jpg')} style={styles.background}>
                <View style={styles.container}>
                    <Text style={styles.timer}>
                        Time Left: {Math.floor(timer / 60)}:{('0' + (timer % 60)).slice(-2)}
                    </Text>
                    <Text style={styles.question}>{currentQuestion.question}</Text>
                    <FlatList
                        data={currentQuestion.options}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.option} onPress={() => this.handleAnswer(item)}>
                                <Text style={styles.optionText}>{item}</Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        padding: 20,
        width: '100%',
    },
    timer: {
        fontSize: 18,
        marginBottom: 10,
        color: 'red',
        fontWeight: 'bold',
    },
    question: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
    },
    option: {
        backgroundColor: '#f7b731',
        padding: 15,
        marginVertical: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
    optionText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
    },
});

export default QuizScreen;
