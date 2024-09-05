/// reference path="angular.min.js" />

import { DefaultQuestions } from "./services/questions.js";
import { shuffleArray, htmlDecode } from "./modules/utils.js";
import { TriviaService } from "./services/triviaService.js";

var app = angular
  .module("trivium", [])
  .service("TriviaApiService", function () {
    return new TriviaService();
  });

/********************************************************************
 * AppController | void: This controller manages the application.
 * @param: $scope, TriviaApiService
 * @returns: void
 * ********************************************************************/
app.controller("AppController", async function ($scope, TriviaApiService) {
  // Application properties.
  $scope.appName = "Trivium";
  $scope.appDescription = "A simple trivia app";
  $scope.appVersion = "1.0.0";

  // Application resources.
  $scope.htmlDecode = htmlDecode;
  $scope.shuffleArray = shuffleArray;
  $scope.service = TriviaApiService;

  // Application default data.
  $scope.questionSets = new Array(DefaultQuestions);
  $scope.questions = $scope.shuffleArray($scope.questionSets[0]);
  $scope.questions.forEach((element) => {
    let answers = element.incorrect_answers;
    answers.push(element.correct_answer);
    answers = $scope.shuffleArray(answers);
    element.answers = answers;
  });

  // Application state.
  $scope.currentQuestionSet = 0;
  $scope.currentQuestionIndex = 0;
  $scope.currentQuestion = $scope.questions[$scope.currentQuestionIndex];
  $scope.numberCorrect = 0;
  $scope.score = ($scope.numberCorrect / $scope.questions.length) * 100;
  $scope.quizOver = false;

  // Application methods.

  /********************************************************************
   * nextQuestion() | void: This method advances to the next question.
   * @param: None
   * @returns: void
   * ********************************************************************/
  $scope.nextQuestion = function () {
    $scope.currentQuestionIndex++;
    if ($scope.currentQuestionIndex >= $scope.questions.length) {
      $scope.quizOver = true;
      $scope.showResults();
    }
    $scope.currentQuestion = $scope.questions[$scope.currentQuestionIndex];
  };

  /********************************************************************
   * checkAnswer() | void: This method checks the answer to the current question.
   * @param: string
   * @returns: void
   * ********************************************************************/
  $scope.checkAnswer = function (answer) {
    if (answer === $scope.currentQuestion.correct_answer) {
      $scope.numberCorrect++;
    }
    $scope.nextQuestion();
  };

  /********************************************************************
   * showResults() | boolean: This method shows the results of the quiz.
   * @param: None
   * @returns: boolean
   * ********************************************************************/
  $scope.showResults = function () {
    $scope.score = Math.round(
      ($scope.numberCorrect / $scope.questions.length) * 100
    );

    return $scope.quizOver === true;
  };

  /********************************************************************
   * showQuiz() | boolean: This method shows the quiz.
   * @param: None
   * @returns: boolean
   * ********************************************************************/
  $scope.showQuiz = function () {
    return $scope.quizOver === false;
  };

  /********************************************************************
   * restartQuiz() | void: This method restarts the quiz.
   * @param: None
   * @returns: void
   * ********************************************************************/
  $scope.restartQuiz = function () {
    // current question set remains the same, but the questions are shuffled.
    // $scope.currentQuestionSet = $scope.currentQuestionSet;
    $scope.currentQuestionIndex = 0;
    $scope.score = 0;
    $scope.numberCorrect = 0;
    $scope.questions = $scope.shuffleArray(
      $scope.questionSets[$scope.currentQuestionSet]
    );
    $scope.questions.forEach((element) => {
      let answers = $scope.shuffleArray(element.answers);
      element.answers = answers;
    });
    $scope.currentQuestion = $scope.questions[$scope.currentQuestionIndex];
    $scope.quizOver = false;
  };

  /********************************************************************
   * nextQuiz() | void: This method advances to the next question set.
   * @param: None
   * @returns: void
   * ********************************************************************/
  $scope.nextQuiz = () => {
    $scope.currentQuestionSet =
      $scope.currentQuestionSet < $scope.questionSets.length - 1
        ? $scope.currentQuestionSet + 1
        : 0;
    $scope.restartQuiz();
  };

  /********************************************************************
   * isLastQuiz() | boolean: This method checks if the current question set is the last one.
   * @param: None
   * @returns: boolean
   * ********************************************************************/
  $scope.isLastQuiz = () => {
    return $scope.currentQuestionSet === $scope.questionSets.length - 1;
  };

  /********************************************************************
   * restartGame() | void: This method restarts the game.
   * @param: None
   * @returns: void
   * ********************************************************************/
  $scope.restartGame = () => {
    $scope.currentQuestionSet = 0;
    $scope.shuffleArray($scope.questionSets);
    $scope.restartQuiz();
  };

  // Application service data.

  /********************************************************************
   * fetchQuestionSet() | void: This method fetches a new set of questions from the API.
   * @param: None
   * @returns: void
   * ********************************************************************/
  $scope.fetchQuestionSet = async () => {
    if ($scope.questionSets.length === 10) return;

    let fetchedQuestions = await $scope.service.fetchQuestions();
    if (fetchedQuestions.length > 0) {
      fetchedQuestions.forEach((element) => {
        let answers = element.incorrect_answers;
        answers.push(element.correct_answer);
        answers = $scope.shuffleArray(answers);
        element.answers = answers;
      });
      $scope.questionSets.push(fetchedQuestions);
    }
    console.log("Question Sets", $scope.questionSets);
    setTimeout($scope.fetchQuestionSet, 10000);
  };

  // Initialize the trivia question service.
  await $scope.service.init();

  // begin fetching questions.
  await $scope.fetchQuestionSet();
});
