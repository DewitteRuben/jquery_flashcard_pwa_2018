let gamePageModule = (function() {

    function init() {
        initGame();
        GameModule.initTimer();
        $(".btn-correct-sa").on("click", createAnswerObject(true, null, "SA"), GameModule.answer);
        $(".btn-wrong-sa").on("click", createAnswerObject(false, null, "SA"), GameModule.answer);
        $(".btn-true-tf").on("click", createAnswerObject(null, true, "TF"), GameModule.answer);
        $(".btn-false-tf").on("click", createAnswerObject(null, false, "TF"), GameModule.answer);
        $(".btn-game-flip-card").on("click", GameModule.flipGameCard);
        $(".btn-game-next").on("click", {prev: false}, GameModule.updateGameCard);
        $(".btn-game-prev").on("click", {prev: true}, GameModule.updateGameCard);
        $(".typeAnswerControls").on("submit", createAnswerObject(null, null, "SA"), GameModule.answer);
        $(".multipleChoiceControls").on("submit", createAnswerObject(null, null, "MC"), GameModule.answer);
    }

    function initTest() {
        let cardSet = new DomainModule.CardSet("Hoofdsteden");
        let card1 = new DomainModule.Card("Hoofdstad", "SA", "Hoofdstand van Duitsland?", "Berlijn");
        card1.id = 1;
        let card2 = new DomainModule.Card("Hoofdstad", "MC", "Hoofdstand van België?",  "Brussel");
        card2.answerChoices = ["Brussel", "Anderlecht", "Zedelgem", "Torhout"];
        card2.id = 2;
        let card3 = new DomainModule.Card("Hoofdstad", "SA", "Hoofdstand van Nederland?", "Amsterdam");
        card3.id = 3;
        let card4 = new DomainModule.Card("Hoofdstad", "TF", "De hoofdstad van Engeland is het Londen", true);
        card3.id = 4;
        cardSet.addCard(card1);
        cardSet.addCard(card2);
        cardSet.addCard(card3);
        cardSet.addCard(card4);

        GameModule.initGame(new DomainModule.Game(cardSet));
    }

    function initGame() {
        DataModule.getCurrentGame().then(function (name) {
            DataModule.getCardSet(name, function (cardSet) {
                console.log(cardSet);
                GameModule.initGame(new DomainModule.Game(cardSet));
                GuiModule.updateGameCardLayout(GameModule.getGame());
            });
        })
    }

    function createAnswerObject(correct, answer, type) {
        return {correct: correct, type: type, answer: answer};
    }

    return {
        init:init
    }
})();

$(document).ready(function () {
    gamePageModule.init();

});