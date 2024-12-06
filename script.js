const titleSection = document.querySelector("#title");
const cardSection = document.querySelector("#card");
const startButton = document.querySelector("#start");
const playAgainButton = document.querySelector("#playagain");

let questions = [];
let currentQuestionIndex = 0;
let incorrectCount = 0;
let correctCount = 0;
let answerCount;

function capitalize(s) {
  return s.substring(0, 1).toUpperCase() + s.substring(1);
}

function createDiv(className, textContent) {
  const div = document.createElement("div");
  div.className = className;
  div.textContent = decodeURIComponent(textContent);
  return div;
}

async function newGame() {
  questions = [];
  currentQuestionIndex = 0;
  incorrectCount = 0;
  correctCount = 0;
  playAgainButton.style.display = "none";
  cardSection.textContent = "Loading...";
  const url =
    "https://opentdb.com/api.php?amount=10&type=multiple&encode=url3986";
  const response = await fetch(url);
  const payload = await response.json();
  if (payload.response_code !== 0) {
    cardSection.textContent = "Unable to load questions from Open TDB";
    return;
  }
  questions = payload.results;
  showQuestion();
}

function showQuestion() {
  const question = questions[currentQuestionIndex];
  titleSection.style.letterSpacing = 0;
  titleSection.textContent = `Question ${currentQuestionIndex + 1}/${
    questions.length
  }`;
  cardSection.textContent = "";
  const category = createDiv("category", question.category);
  const difficulty = createDiv(
    "difficulty",
    `Difficulty: ${capitalize(question.difficulty)}`
  );
  const ask = createDiv("ask", question.question);
  answerCount = createDiv(
    "answerCount",
    `Correct Answers: ${correctCount} Incorrect Answers: ${incorrectCount}`
  );
  const answers = question.incorrect_answers.map((a) =>
    createDiv("incorrect", a)
  );
  answers.splice(
    Math.floor(Math.random() * answers.length),
    0,
    createDiv("correct", question.correct_answer)
  );
  for (const div of [category, difficulty, ask, ...answers, answerCount]) {
    cardSection.appendChild(div);
  }
}

function gameOver() {
  cardSection.textContent = "";
  const message = createDiv("winner", "YOU WIN");
  cardSection.appendChild(message);
  message.animate(
    [
      { fontSize: "5px", rotate: "0deg" },
      { fontSize: "6em", rotate: "720deg" },
    ],
    { fill: "forwards", duration: 5000 }
  );
  playAgainButton.style.display = "block";
}

startButton.addEventListener("click", newGame);

cardSection.addEventListener("click", (e) => {
  if (e.target.matches("div.correct")) {
    correctCount += 1;
    answerCount.textContent = `Correct Answers: ${correctCount} Incorrect Answers: ${incorrectCount}`;
    for (const e of document.querySelectorAll(".ask,.incorrect")) {
      e.remove();
    }
    e.target.style.fontSize = "300%";
    e.target.addEventListener("transitionend", (e) => {
      if (currentQuestionIndex === questions.length - 1) {
        gameOver();
      } else {
        currentQuestionIndex += 1;
        showQuestion();
      }
    });
  }
  if (e.target.matches("div.incorrect")) {
    incorrectCount += 1;
    answerCount.textContent = `Correct Answers: ${correctCount} Incorrect Answers: ${incorrectCount}`;
    e.target.style.opacity = 0;
  }
});

playAgainButton.addEventListener("click", newGame);
