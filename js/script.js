// AlgoVista - Data Structure Encyclopedia
// Main JavaScript file with interactive visualizations

// Global variables
let currentQuestion = 0;
let score = 0;

// Quiz questions
const quizQuestions = [
    {
        question: "What is the time complexity of inserting an element at the beginning of a linked list?",
        options: ["O(n)", "O(1)", "O(log n)", "O(n²)"],
        correct: 1
    },
    {
        question: "Which data structure follows LIFO principle?",
        options: ["Queue", "Stack", "Linked List", "Tree"],
        correct: 1
    },
    {
        question: "What is the time complexity of searching in a balanced binary search tree?",
        options: ["O(n)", "O(1)", "O(log n)", "O(n²)"],
        correct: 2
    },
    {
        question: "Which algorithm is used for graph traversal?",
        options: ["Quick Sort", "DFS/BFS", "Binary Search", "Merge Sort"],
        correct: 1
    },
    {
        question: "What is the average time complexity of hash table operations?",
        options: ["O(n)", "O(1)", "O(log n)", "O(n²)"],
        correct: 1
    }
];

// Utility functions
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor() {
    const colors = ['#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8', '#6f42c1'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Search functionality
function searchDataStructure() {
    const searchTerm = document.getElementById('heroSearch').value.toLowerCase();
    if (searchTerm) {
        const sections = ['basic', 'linear', 'tree', 'graph', 'hash', 'trie'];
        let found = false;
        sections.forEach(section => {
            const element = document.getElementById(section);
            if (element) {
                const cards = element.querySelectorAll('.card');
                cards.forEach(card => {
                    const title = card.querySelector('.card-header h5').textContent.toLowerCase();
                    if (title.includes(searchTerm)) {
                        element.scrollIntoView();
                        found = true;
                    }
                });
            }
        });
        if (!found) {
            showAlert('Data structure not found!', 'danger');
        }
    }
}

// Alert system
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Quiz functionality
function checkAnswer(selectedIndex) {
    const question = quizQuestions[currentQuestion];
    const buttons = document.querySelectorAll('.quiz-options .btn');
    buttons.forEach((btn, index) => {
        btn.disabled = true;
        if (index === question.correct) {
            btn.classList.add('correct');
        } else if (index === selectedIndex && index !== question.correct) {
            btn.classList.add('incorrect');
        }
    });
    if (selectedIndex === question.correct) {
        score++;
        showAlert('Correct! Well done!', 'success');
    } else {
        showAlert('Incorrect! Try again.', 'danger');
    }
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion >= quizQuestions.length) {
        showQuizResults();
        return;
    }
    loadQuestion();
}

function loadQuestion() {
    const question = quizQuestions[currentQuestion];
    document.getElementById('questionText').textContent = question.question;
    const buttons = document.querySelectorAll('.quiz-options .btn');
    buttons.forEach((btn, index) => {
        btn.textContent = question.options[index];
        btn.className = 'btn btn-outline-primary w-100 mb-2';
        btn.disabled = false;
    });
}

function showQuizResults() {
    const percentage = (score / quizQuestions.length) * 100;
    const quizContainer = document.getElementById('quizContainer');
    quizContainer.innerHTML = `
        <h5>Quiz Complete!</h5>
        <p>Your score: ${score}/${quizQuestions.length} (${percentage.toFixed(1)}%)</p>
        <div class="progress mb-3">
            <div class="progress-bar" style="width: ${percentage}%"></div>
        </div>
        <button class="btn btn-primary" onclick="resetQuiz()">Take Quiz Again</button>
    `;
}

function resetQuiz() {
    currentQuestion = 0;
    score = 0;
    loadQuestion();
}

// Scroll to section function for Explore buttons
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('heroSearch').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchDataStructure();
        }
    });
    loadQuestion();
    initializeVisualizations();
});

function initializeVisualizations() {
    if (typeof arrayVisualizer !== 'undefined') arrayVisualizer.init();
    if (typeof stringVisualizer !== 'undefined') stringVisualizer.init();
    if (typeof linkedList !== 'undefined') linkedList.init();
    if (typeof stack !== 'undefined') stack.init();
    if (typeof queue !== 'undefined') queue.init();
    if (typeof binaryTree !== 'undefined') binaryTree.init();
    if (typeof heap !== 'undefined') heap.init();
    if (typeof graph !== 'undefined') graph.init();
    if (typeof hashTable !== 'undefined') hashTable.init();
    if (typeof trie !== 'undefined') trie.init();
} 