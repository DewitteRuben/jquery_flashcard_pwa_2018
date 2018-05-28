"use strict";

let GameModule = (function () {
    let timer = new Timer();
    let gamehandler = null;

    const URL = {
        HOME: "index.html",
        HIGHSCORES:"gameoverview.html"
    };

    function GameHandler(game) {
        this.game = game;
        this.game.reset();
        gamehandler = this;
    }

    function showEndGameStats() {
        showStatsModal();
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
        GuiModule.updateGameCardLayout(gamehandler.game);
    }

    function flipGameCard(e) {
        gamehandler.game.isFront = !gamehandler.game.isFront;
        GuiModule.updateGameCardLayout(gamehandler.game);
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

        GuiModule.generateModal("finishedGameModal", modalContent, "Home", "Save",
            evSaveHighscores, evCloseHighscoreModal);
    }

    function evSaveHighscores(e) {
        e.preventDefault();
        let date = new Date();
        let realTime = date.toLocaleTimeString();
        let realDate = date.toLocaleDateString();
        let highscore = new DomainModule.Highscore(gamehandler.game, getTime(), realDate, realTime);
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
        GuiModule.updateGameCardLayout(gamehandler.game);

        if (gamehandler.game.isFinished()) {
            finishGame();
        }
    }


    return {
        initGame: GameHandler,
        updateGameCard: updateGameCard,
        flipGameCard: flipGameCard,
        getGame: getGame,
        answer: answer,
        initTimer: initTimer,
    }
})();