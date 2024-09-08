/// reference path="angular.min.js" />

import { DefaultQuestions } from "./services/questions.js";
import { shuffleArray, htmlDecode } from "./modules/utils.js";
import { TriviaService } from "./services/triviaService.js";
import { QuizResult } from "./modules/quizResult.js";

var app = angular
  .module("trivium", [])
  .service("TriviaApiService", function () {
    return new TriviaService();
  });

app.controller("MetaTagsController", function ($scope) {
  $scope.meta = {
    title: "Trivium",
    description: "An HTML, CSS, and Javascript trivia game.",
    keyWords: "trivia, game, html, css, javascript",
    author: "Bacardi Bryant",
    date: "2020-06-03",
    version: "4.1.1", // versioning: milestone.feature.fix (a spin-off of semantic versioning taken from https://semver.org/)
  };
});

/********************************************************************
 * AppController | void: This controller manages the application.
 * @param: $scope, TriviaApiService
 * @returns: void
 * ********************************************************************/
app.controller("AppController", async function ($scope, TriviaApiService) {
  // Application resources.
  $scope.htmlDecode = htmlDecode;
  $scope.shuffleArray = shuffleArray;
  $scope.service = TriviaApiService;
  $scope.appTitle = "Trivium";
  $scope.appDescription = "An HTML, CSS, and Javascript trivia game.";

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
  $scope.numberIncorrect = 0;
  $scope.score = ($scope.numberCorrect / $scope.questions.length) * 100;
  $scope.quizOver = false;
  $scope.quizResults = new Array(new QuizResult(0, $scope.questions, 0, 0));
  $scope.gameOver = false;

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

      // if the quiz is over, create a new QuizResult object and add it to the quizResults array.
      let quizResult = new QuizResult(
        $scope.currentQuestionSet,
        $scope.questions,
        $scope.numberCorrect,
        $scope.numberIncorrect
      );

      $scope.addQuizResult(quizResult);

      console.log("Quiz Results", $scope.quizResults);

      $scope.showResults();
    }

    if ($scope.currentQuestionSet >= $scope.questionSets.length) {
      $scope.showGameResults();
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
      $scope.showCorrect(true);
    } else {
      $scope.numberIncorrect++;
      $scope.showCorrect(false);
    }
    $scope.nextQuestion();
  };

  $scope.showCorrect = function (correct) {
    let element = document.getElementById("response-alert");
    element.style.display = "block";
    if (correct) {
      element.innerHTML =
        "<div id='correctResponseAlert' class='alert alert-success hide' role='alert'><strong>Awesome!</strong> that's correct.</div>";
      //element.style.backgroundColor = "green";
      //element.innerHTML = "Correct!";
    } else {
      element.innerHTML =
        "<div id='incorrectResponseAlert' class='alert alert-danger hide' role='alert'><strong>Oops!</strong> that's incorrect.</div>";
      //element.style.backgroundColor = "red";
      //element.innerHTML = "Incorrect!";
    }
    setTimeout(() => {
      element.style.display = "none";
    }, 1000);
  };

  $scope.addQuizResult = function (quizResult) {
    // if the quizResult already exists in the quizResults array, remove it.
    let id = parseInt(quizResult.id);
    let quizResultId = $scope.quizResults.findIndex(
      (result) => result.id === id
    );
    if (quizResultId >= 0) {
      $scope.quizResults.splice(quizResultId, 1);
    }
    // add the quizResult to the quizResults array.
    $scope.quizResults.push(quizResult);
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

    return $scope.quizOver === true && $scope.gameOver === false;
  };

  $scope.endGame = function () {
    $scope.gameOver = true;
  };

  $scope.endQuizAndGame = function () {
    let quizResult = new QuizResult(
      $scope.currentQuestionSet,
      $scope.questions,
      $scope.numberCorrect,
      $scope.numberIncorrect
    );
    $scope.addQuizResult(quizResult);
    $scope.quizOver = true;
    $scope.gameOver = true;
  };

  $scope.showGameResults = function () {
    return $scope.gameOver === true;
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
    $scope.numberIncorrect = 0;
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
    $scope.quizResults = new Array(new QuizResult(0, $scope.questions, 0, 0));
    $scope.gameOver = false;
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
