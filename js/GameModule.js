let GameModule = (function () {
    let _this = this;
    this.game = null;
    let timer = new Timer();

    function initGame(game) {
        _this.game = game;
        _this.game.reset();
    }

    function getGame() {
        return _this.game;
    }

    function updateGameCard(e) {
        if (e.data.prev) {
            _this.game.prevCard();
        } else {
            _this.game.nextCard();
        }
        _this.game.isFront = true;
        GuiModule.updateGameCardLayout(_this.game);
    }

    function flipGameCard(e) {
        _this.game.isFront = !_this.game.isFront;
        GuiModule.updateGameCardLayout(_this.game);
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
        return _this.game.getAnsweredCards().length + 1 === _this.game.cardset.cards.length;
    }

    function showStatsModal() {
        let modalContent = `<h5>Finished!</h5>`
        // GuiModule.generateModal("finishedGameModal", )
    }

    function getScore() {
        return (_this.game.getCorrectCards().length / _this.game.getAnsweredCards().length).toFixed(3) * 100;
    }

    function setScore() {
        let score = _this.game.cardset.bestScore;
        if (!score || getScore() > score) {
            _this.game.cardset.bestScore = getScore();
        }
    }

    function finishGame() {
        _this.game.isFinished = true;
        _this.game.timeFinished = getTime();
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
                answer = e.data.correct ? _this.game.getCurrentCard().answer : "";
                if (_this.game.getCurrentCard().typeAnswer)
                        answer = $("#game-type-answer").val();
                break;
            case "TF":
                answer = e.data.answer;
                break;
            case "MC":
                answer =
                    $.trim(_this.game.getCurrentCard()
                        .answerChoices[$("input[name='radioAnswer']:checked").val()]);
                break;
        }

        _this.game.answer(answer);
        GuiModule.updateGameCardLayout(_this.game);
    }

    return {
        initGame: initGame,
        updateGameCard: updateGameCard,
        flipGameCard: flipGameCard,
        getGame: getGame,
        answer: answer,
        initTimer:initTimer,
    }
})();