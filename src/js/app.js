const game = {

    // the current question index
    currentQuestion: 0,

    // the selected answer text.
    selectedAnswer: '',

    // the correct answer text.
    correctAnswer: '',

    // the id for the question element.
    questionHolder:'',

    // the id for the answer element.
    answerHolder:'',

    // start of new round.
    gameStart:true,

    // collection of question objects.
    questions: [{
            'question': 'how are you?',
            'answers': ['good', 'super', 'okay'],
            'correct': ['good']
        },
        {
            'question': 'Is the earth round?',
            'answers': ['maybe', 'no', 'yes'],
            'correct': ['yes']
        },
        {
            'question': 'Name a bird that can\'t fly.',
            'answers': ['eagle', 'chicken', 'dove'],
            'correct': ['chicken']
        }
    ],

    // load the question details into the display elements.
    start:function(questionElementId,answersElementId,messagesElementId) {

        // obtain a reference to the game elements.
        this.questionHolder = document.getElementById(questionElementId);
        this.answerHolder = document.getElementById(answersElementId);
        this.messagesHolder = document.getElementById(messagesElementId);

        // load the first question.
        this.nextQuestion();
    },

    // load the next question.
    nextQuestion:function(){

        // is the current question the last question in the array?
        let startOver = this.gameStart ? true : this.currentQuestion == this.questions.length-1;

        // set the game start to false for subsequent iterations.
        this.gameStart = false;

        // if we've reached the last question, start over with the first question.
        if(startOver){
            // set currentQuestion to 0 (the first question in the array).
            this.currentQuestion = 0;
        } else {
            // otherwise set the currentQuestion to the next question in the array.
            this.currentQuestion = this.currentQuestion + 1;
        }

        // clear the messages element. This should be passed in and referenced.
        this.messagesHolder.innerHTML = "";

        // set the new question text
        this.questionHolder.innerHTML = this.questions[ this.currentQuestion ].question;

        // clear current answers.
        this.answerHolder.innerHTML = "";

        /*
            Iterate over current answers and add a radio button for each answer.
            set the value of the radio button to the index of the answer in the array.
        */
        for(let i = 0; i < this.questions[ this.currentQuestion ].answers.length; i++){

            this.answerHolder.innerHTML += `<input type='radio' onClick="game.selectAnswer(this.value);" name='answers' value='${i}'>&nbsp;&nbsp;${this.questions[ this.currentQuestion ].answers[i]}</input><br/>`;
        }
    },

    selectAnswer:function( answerIndex ){

        // the selected answer.
        this.selectedAnswer = this.questions[ this.currentQuestion ].answers[ answerIndex ];

        // the correct answer.
        this.correctAnswer = this.questions[ this.currentQuestion ].correct;

        // evaluate whether the selection and the correct answer match.
        if( this.selectedAnswer == this.correctAnswer ){
            // success message
            this.messagesHolder.innerHTML = "<div id='correctResponseAlert' class='alert alert-success hide' role='alert'><strong>Awesome!</strong> that's correct.</div>";
            
        } else {
            // failure message.
            this.messagesHolder.innerHTML = "<div id='incorrectResponseAlert' class='alert alert-danger hide' role='alert'><strong>Oops!</strong> that's incorrect.</div>";
        }
        
        // pause, then proceed to the next question.
        wait(2).then(() => {
           this.nextQuestion();
        });
    }
};

// wait time expects seconds, which are converted to milliseconds.
function wait (time) {
    return new Promise((resolve) => setTimeout(resolve, (time * 1000)));
}

