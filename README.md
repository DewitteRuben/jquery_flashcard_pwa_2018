# Holo's Flashcards

### What?
Holo's flashcards is an app that allows users to create their own stack of flashcards. The user can group these cards into cardset which each have an unique name and category.

Users have the ability to choose from three types of cards:
- Single answer cards
- Multiple Choice cards
- True / False cards

All of which a picture can be added to, to for example help clarify a card question. 

After the user has created a cardset with cards, he or she has the option to playtest this cardset. Based on the cardtype chosen by the user he or she will have the ability to answer to these cards in different ways.

When the player is done playtesting he or she will be prompted with a dialog that allows them to save their results in an overview table. This table allows users to see which cards they answered correctly and also what answer they entered or selected, together with the time they took to finish the cardset and when they played the cardset.

In the settings menu users also have the ability to enable a more compact card view, which makes it a lot easier to manage bigger cardsets.

# Technologies / APIs

- For functionality and looks the framework MaterializeCSS was used
https://materializecss.com/ together with jQuery
- To store the cardsets, cards and highscores localforage was used, smaller variables were stored in localstorage/sessionstorage
    - Localforage was done with the use of Promises
- ES6 modules were used to structure the program and were bundled together using WebPack, the JS was also transpiled using Babel with WebPack to ES5.
- The Yandex API was used to implement the translation feature https://tech.yandex.com/translate/doc/dg/concepts/About-docpage/
- The EasyTimer library was used to implement the countdown timer
https://albert-gonzalez.github.io/easytimer.js/

# Github / Host
The github repository is available here:
https://github.com/DewitteRuben/2018_SSE_Dewitte_Ruben

The actual application is hosted using Github Pages here:
https://dewitteruben.github.io/2018_SSE_Dewitte_Ruben/

# Screencast
Available on youtube here:
//

As well as inside the .zip file under the name "screencast-demo".