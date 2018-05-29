import {updateGameCardLayout, generateModal} from "../gui";
import {Game, Highscore} from "../domain";
import Timer from "../libraries/easytimer.min"
import {getCurrentGame, pGetCardset} from "../data";

let timer = new Timer();
let gamehandler = null;

const URL = {
    HOME: "index.html",
    HIGHSCORES: "gameoverview.html"
};

function GameHandler(game) {
    this.game = game;
    this.game.reset();
    gamehandler = this;
}

function getGame() {
    return gamehandler.game;
}

function updateGameCard(e) {
    if (e.data.prev) {
        gamehandler.game.prevCard();
    } else {
        gamehandler.game.nextCard();
    }
    gamehandler.game.isFront = true;
    updateGameCardLayout(gamehandler.game);
}

function flipGameCard(e) {
    gamehandler.game.isFront = !gamehandler.game.isFront;
    updateGameCardLayout(gamehandler.game);
}

function initTimer() {
    timer.start();
    timer.addEventListener('secondsUpdated', function (e) {
        $('#gameTimer').html(timer.getTimeValues().toString());
    });
}

function getTime() {
    return timer.getTimeValues().toString();
}

function stopAndSaveTime() {
    gamehandler.game.timeFinished = getTime();
    timer.stop();
}

function showStatsModal() {
    let modalContent = `<h5>Game Finished!</h5>
                            <p>Current Game: ${gamehandler.game.cardset.name}</p>
                            <ul>
                                <li>Time: ${gamehandler.game.timeFinished}</li>
                                <li>Correct: ${gamehandler.game.getAmountCorrectAnswers()}</li>
                                <li>Wrong: ${gamehandler.game.getAmountWrongAnswers()}</li>
                                <li>Accuracy: ${gamehandler.game.getAnswerAccuracy()}%</li>
                            </ul>
                            <p>Note: A detailed overview will be saved in the highscores!</p>`;

    generateModal("finishedGameModal", modalContent, "Home", "Save",
        evSaveHighscores, evCloseHighscoreModal);
}

function evSaveHighscores(e) {
    e.preventDefault();
    let date = new Date();
    let realTime = date.toLocaleTimeString();
    let realDate = date.toLocaleDateString();
    let highscore = new Highscore(gamehandler.game, getTime(), realDate, realTime);
    highscore.save(e => window.location.href = URL.HIGHSCORES);
}

function evCloseHighscoreModal(e) {
    e.preventDefault();
    window.location.href = URL.HOME;
}


function finishGame() {
    stopAndSaveTime();
    showStatsModal();
}

function answer(e) {
    e.preventDefault();

    let answer;
    switch (e.data.type) {
        case "SA":
            let realAnswer = gamehandler.game.getCurrentCard().answer;
            answer = e.data.correct ? realAnswer : `Not ${realAnswer}`;
            if (gamehandler.game.getCurrentCard().typeAnswer)
                answer = $("#game-type-answer").val();
            break;
        case "TF":
            answer = e.data.answer;
            break;
        case "MC":
            answer =
                $.trim(gamehandler.game.getCurrentCard()
                    .answerChoices[$("input[name='radioAnswer']:checked").val()]);
            break;
    }

    gamehandler.game.answer(answer);
    updateGameCardLayout(gamehandler.game);

    if (gamehandler.game.isFinished()) {
        finishGame();
    }
}

export function init() {
    initGame();
    initTimer();
    $(".btn-correct-sa").on("click", createAnswerObject(true, null, "SA"), answer);
    $(".btn-wrong-sa").on("click", createAnswerObject(false, null, "SA"), answer);
    $(".btn-true-tf").on("click", createAnswerObject(null, true, "TF"), answer);
    $(".btn-false-tf").on("click", createAnswerObject(null, false, "TF"), answer);
    $(".btn-game-flip-card").on("click", flipGameCard);
    $(".btn-game-next").on("click", {prev: false}, updateGameCard);
    $(".btn-game-prev").on("click", {prev: true}, updateGameCard);
    $(".typeAnswerControls").on("submit", createAnswerObject(null, null, "SA"), answer);
    $(".multipleChoiceControls").on("submit", createAnswerObject(null, null, "MC"), answer);
}

function initGame() {
    getCurrentGame().then(function (name) {
        return name;
    }).then(function (name) {
        pGetCardset(name).then(function (cardset) {
            new GameHandler(new Game(cardset));
            updateGameCardLayout(getGame());
        })
    })
}

function createAnswerObject(correct, answer, type) {
    return {correct: correct, type: type, answer: answer};
}

