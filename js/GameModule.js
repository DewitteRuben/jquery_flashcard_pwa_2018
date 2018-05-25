"use strict";

let GameModule = (function () {
    let timer = new Timer();
    let gamehandler = null;

    function GameHandler(game) {
        this.game = game;
        this.game.reset();
        gamehandler = this;
    }

    function getGame() {
        return gamehandler.game;
    };

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

    function stopTimer() {
        timer.stop();
    }

    function isGameFinishedOnNextAnswer() {
        return gamehandler.game.getAnsweredCards().length + 1 === gamehandler.game.cardset.cards.length;
    }

    function showStatsModal() {
        let modalContent = `<h5>Finished!</h5>`
        // GuiModule.generateModal("finishedGameModal", )
    }

    function getScore() {
        return (gamehandler.game.getCorrectCards().length / gamehandler.game.getAnsweredCards().length).toFixed(3) * 100;
    }

    function setScore() {
        let score = gamehandler.game.cardset.bestScore;
        if (!score || getScore() > score) {
            gamehandler.game.cardset.bestScore = getScore();
        }
    }

    function finishGame() {
        gamehandler.game.isFinished = true;
        gamehandler.game.timeFinished = getTime();
        setScore();
    }

    function answer(e) {
        e.preventDefault();
        if (isGameFinishedOnNextAnswer()) {
            alert("Ja, tis gebeurt!");
        }

        let answer;
        switch (e.data.type) {
            case "SA":
                answer = e.data.correct ? gamehandler.game.getCurrentCard().answer : "";
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