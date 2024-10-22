let player1Name;
let player2Name;
let player1Score = 0;
let player2Score = 0;
let selectedCategory;
let currentQIndex = 0;
let questions = [];
let currentPlayer = 1;
let questionsPerCategory = 6;
let easyQ = 2, mediumQ = 2, hardQ = 2;
let selectedCategories = new Set();

document.getElementById('start').addEventListener('click', startGame);
document.getElementById('select-category-btn').addEventListener('click', selectCategory);
document.getElementById('submit-answer').addEventListener('click', submitAnswer);
document.getElementById('play-again').addEventListener('click', playAgain);
document.getElementById('next-category').addEventListener('click', selectAnotherCategory);
document.getElementById('end-game').addEventListener('click', endGame);

function fetchCategories() {
    fetch('https://the-trivia-api.com/v2/categories')
        .then(response => response.json())
        .then(data => {
            let categoryDropdown = document.getElementById('select-category');
            categoryDropdown.innerHTML = '';
            for (let category of Object.keys(data)) {
                if (!selectedCategories.has(category)) {
                    let option = document.createElement('option');
                    option.value = category;
                    option.text = data[category];
                    categoryDropdown.add(option);
                }
            }
        })
        .catch(error => console.error('Error fetching categories:', error));
}

function startGame() {
    player1Name = document.getElementById('name1').value;
    player2Name = document.getElementById('name2').value;

    if (!player1Name || !player2Name) {
        alert('Please enter both player names.');
        return;
    }

    document.getElementById('player-details').style.display = 'none';
    document.getElementById('category').style.display = 'block';
    fetchCategories();
}

function fetchQuestions() {
    fetch(`https://the-trivia-api.com/v2/questions?categories=${selectedCategory}&limit=${questionsPerCategory}`)
        .then(response => response.json())
        .then(data => {
            questions = data;
            currentQIndex = 0;
            displayQuestion();
        })
        .catch(error => console.error('Error fetching questions:', error));
}

function selectCategory() {
    selectedCategory = document.getElementById('select-category').value;
    selectedCategories.add(selectedCategory);
    document.getElementById('category').style.display = 'none';
    document.getElementById('questions').style.display = 'block';
    document.getElementById('score').style.display = 'block';
    fetchQuestions();
}


function displayQuestion() {
    if (currentQIndex >= questions.length) {
        return;
    }
    let currentQ = questions[currentQIndex];
    let difficulty = currentQIndex < easyQ ? "easy" : currentQIndex < easyQ + mediumQ ? "medium" : "hard";
    let currentPlayerName = currentPlayer === 1 ? player1Name : player2Name;
    document.getElementById('question-text').textContent = `${currentPlayerName}'s turn (${difficulty}): ${currentQ.question.text}`;
    
    let answersContainer = document.getElementById('answers');
    answersContainer.innerHTML = '';
    let answers = [...currentQ.incorrectAnswers, currentQ.correctAnswer].sort(() => Math.random() - 0.5);
    
    answers.forEach((answer, index) => {
        let optionContainer = document.createElement('div');
        optionContainer.classList.add('option');
        let radioButton = document.createElement('input');
        radioButton.type = 'radio';
        radioButton.name = 'answer';
        radioButton.value = answer;
        radioButton.id = `option-${index}`;
        let label = document.createElement('label');
        label.textContent = String.fromCharCode(65 + index) + '. ' + answer;
        label.setAttribute('for', `option-${index}`);

        optionContainer.appendChild(radioButton);
        optionContainer.appendChild(label);
        answersContainer.appendChild(optionContainer);
    });
}

function submitAnswer() {
    let selectedOption = document.querySelector('input[name="answer"]:checked');
    if (!selectedOption) {
        alert('Please select an answer');
        return;
    }
    let currentQ = questions[currentQIndex];
    if (selectedOption.value === currentQ.correctAnswer) {
        let scoreIncrement = currentQIndex < easyQ ? 10 : currentQIndex < easyQ + mediumQ ? 15 : 20;

        if (currentPlayer === 1) {
            player1Score += scoreIncrement;
            document.getElementById('player1-score').textContent = player1Score;
        } else {
            player2Score += scoreIncrement;
            document.getElementById('player2-score').textContent = player2Score;
        }
    }
    currentQIndex++;
    currentPlayer = currentPlayer === 1 ? 2 : 1;

    if (currentQIndex < questions.length) {
        displayQuestion();
    } else {
        document.getElementById('questions').style.display = 'none';
        document.getElementById('post-question-options').style.display = 'block';
    }
}

function selectAnotherCategory() {
    currentQIndex = 0;
    questions = [];
    currentPlayer = 1;
    player1Score = 0;
    player2Score = 0;
    document.getElementById('player1-score').textContent = '0';
    document.getElementById('player2-score').textContent = '0';
    document.getElementById('post-question-options').style.display = 'none';
    document.getElementById('category').style.display = 'block';
    fetchCategories();
}

function endGame() {
    document.getElementById('post-question-options').style.display = 'none';
    document.getElementById('questions').style.display = 'none';
    document.getElementById('end').style.display = 'block';
    let message;
    if (player1Score > player2Score) {
        message = `Congratulations, ${player1Name} wins!`;
    } else if (player1Score < player2Score) {
        message = `Congratulations, ${player2Name} wins!`;
    } else {
        message = "It's a tie!";
    }
    document.getElementById('message').textContent = message;
}

function playAgain() {
    currentQIndex = 0;
    player1Score = 0;
    player2Score = 0;
    currentPlayer = 1;
    selectedAnswer = null;
    selectedCategories.clear();

    document.getElementById('player1-score').textContent = '0';
    document.getElementById('player2-score').textContent = '0';

    document.getElementById('end').style.display = 'none';
    document.getElementById('player-details').style.display = 'block';
}
