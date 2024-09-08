export class QuizResult {
  constructor(id, questions, numberCorrect, numberIncorrect) {
    this.id = id;
    this.questions = questions;
    this.numberCorrect = numberCorrect;
    this.numberIncorrect = numberIncorrect;
    this.score = this.getScore();
  }

  getScore() {
    return (this.numberCorrect / this.questions.length) * 100;
  }

  //   constructor(quizContainer, quizData) {
  //     this.quizContainer = quizContainer;
  //     this.quizData = quizData;
  //     this.quizResult = this.quizData.filter((item) => item.isCorrect === true);
  //     this.quizResultPercentage = Math.round((this.quizResult.length / this.quizData.length) * 100);
  //     this.quizResultContainer = document.createElement('div');
  //     this.quizResultContainer.classList.add('quiz-result');
  //     this.quizResultContainer.innerHTML = `
  //       <h2>Quiz Result</h2>
  //       <p>You got ${this.quizResult.length} out of ${this.quizData.length} questions correct.</p>
  //       <p>Your score: ${this.quizResultPercentage}%</p>
  //       <button class="btn btn-primary">Try Again</button>
  //     `;
  //     this.quizContainer.appendChild(this.quizResultContainer);
  //   }

  //   init() {
  //     this.quizResultContainer.querySelector('button').addEventListener('click', () => {
  //       this.quizContainer.innerHTML = '';
  //       new Quiz(this.quizContainer, this.quizData).init();
  //     });
  //   }
}
