!function(t){var e={};function n(r){if(e[r])return e[r].exports;var a=e[r]={i:r,l:!1,exports:{}};return t[r].call(a.exports,a,a.exports,n),a.l=!0,a.exports}n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)n.d(r,a,function(e){return t[e]}.bind(null,a));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=12)}([function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.init=function(){d.getItem(i.CARDSETS).then(function(t){if(!t)return console.log("Cardsets storage doesn't exist, creating new storage space..."),d.setItem(i.CARDSETS,new Map)}).then(function(){d.getItem(i.HIGHSCORES).then(function(t){if(!t)return console.log("Highscores storage spaces doesn't exist, creating storage space..."),d.setItem(i.HIGHSCORES,[])})}).catch(function(t){throw Error("Failed to initialize cardset storage space")})},e.setHighscoresArr=function(t){return d.setItem(i.HIGHSCORES,t)},e.pGetAllCardsets=l,e.pUpdateCardset=u,e.pRenameCardset=function(t,e){return l().then(function(t,e){return function(n){if(!e.isValid())throw Error(c.INVALID_NAME_CATEGORY);var r=n.get(t);return n.delete(t),n.set(e.name,r),n.forEach(function(n){n.name===t&&(n.name=e.name,n.category=e.category,n.cards.forEach(function(t){t.id=e.name+"-"+t.id.split("-")[1]}))}),n}}(t,e)).then(function(t){return f(t)}).then(function(e){return Promise.resolve("Successfully edited the cardset ".concat(t,"!"))}).catch(function(e){throw console.error(e),Error("Failed to update name and category of the cardset ".concat(t))})},e.pAddHighscore=function(t){return d.getItem(i.HIGHSCORES).then(function(e){if(!e)throw Error("There is no highscore object in the database!");return e.push(t),e}).then(function(t){return d.setItem(i.HIGHSCORES,t)}).then(function(){return Promise.resolve("Successfully added highscore entry!")})},e.rebuildHighscores=h,e.pGetAllHighscores=function(){return d.getItem(i.HIGHSCORES).then(function(t){return h(t)}).catch(function(t){throw Error("Failed to get all highscores!")})},e.pSetCardsetMap=f,e.pAddUpdateCardset=p,e.pAddCardset=function(t){return l().then(function(e){if(!t.isValid())throw Error(c.INVALID_CARDSET);var n,a,s=e.values(),i=!0,o=!1,d=void 0;try{for(var l,u=s[Symbol.iterator]();!(i=(l=u.next()).done);i=!0){var h=l.value;if(n=h,a=t,(0,r.isEqualToCaseInsensitive)(n.name,a.name))throw Error(c.CARDSET_ALREADY_EXISTS)}}catch(t){o=!0,d=t}finally{try{i||null==u.return||u.return()}finally{if(o)throw d}}return t}).then(function(t){return p(t)})},e.pDeleteCardFromCardset=function(t){return g(t.split("-")[0]).then(function(e){return e.cards=e.cards.filter(function(e){return e.id!==t}),e}).then(function(t){return p(t)}).catch(function(t){throw Error(c.DELETE_CARD_FROM_CARDSET_FAIL)})},e.pDeleteCardset=function(t){return l().then(function(e){return e.delete(t),d.setItem(i.CARDSETS,e),e})},e.pAddCardToCardset=function(t,e){return g(e).then(function(e){if(!t.isValid())throw Error(c.INVALID_CARD_DETAILS);return t.id=e.name+"-"+e.cards.length,e.addCard(t),e}).then(function(t){return p(t)}).then(function(){return Promise.resolve("Sucessfully added card to the ".concat(e," cardset!"))})},e.pUpdateCard=function(t){if(!t.id)throw Error("Card does not have an ID set!");return g(t.id.split("-")[0]).then(function(e){return e.cards=e.cards.filter(function(e){return e.id!==t.id}),e.cards.push(t),e}).then(function(t){return u(t)}).then(function(){return Promise.resolve("Successfully updated the card ".concat(t.title,"!"))}).catch(function(t){throw Error("Failed to update card!")})},e.pGetCardByID=function(t){return g(t.split("-")[0]).then(function(e){return e.cards.filter(function(e){return e.id===t})[0]}).catch(function(t){throw Error(c.GET_CARD_BY_ID_FAIL)})},e.pGetCardset=g,e.postData=function(t){return fetch(t,{headers:{"content-type":"application/x-www-form-urlencoded"},method:"POST"}).then(function(t){return t.json()})},e.pFileReader=function(t){var e=this;return new Promise(function(n,r){var a=new FileReader;a.onload=function(e){t.data=e.target.result,n(t)},a.onerror=function(){return r(e)},/^image/.test(t.type)?a.readAsDataURL(t):a.readAsText(t)})},e.storageSavePicture=function(t){try{localStorage.setItem(o.PICTURE,JSON.stringify(t))}catch(t){if(1014===t.code||22===t.code)throw Error("File size too big, please upload a smaller file!");throw Error("Failed to upload file, please try again!")}},e.storageGetLoadedPicture=function(){try{return JSON.parse(localStorage.getItem(o.PICTURE))}catch(t){throw new Error("Failed to get picture!")}},e.storageClearPictureData=function(){try{localStorage.removeItem(o.PICTURE)}catch(t){throw Error("Failed to remove the picture from storage!")}},e.startCurrentGame=function(t){return g(t.toString()).then(function(e){if(0===e.cards.length)throw Error("Cardset ".concat(t," has no cards!"));return t}).then(function(e){return d.setItem(o.GAME,t.toString())})},e.getCurrentGame=function(){return d.getItem(o.GAME)},e.getCurrentCard=function(){return d.getItem(o.CARD)},e.getSettings=function(){return window.localStorage?JSON.parse(localStorage.getItem(o.SETTINGS)):null},e.saveSettings=function(t){window.localStorage?(localStorage.setItem(o.SETTINGS,JSON.stringify(t)),(0,a.showToast)("Successfully saved settings!","")):(0,a.showToast)("Settings are not supported by your browser!","")},e.setCurrentEditedCardset=function(t){sessionStorage.setItem(o.CURRENT_CARDSET,t)},e.KEYS=void 0;var r=n(2),a=n(1),s=n(3),i={STORE:"cardStorage",CARDSETS:"cardSets",HIGHSCORES:"highscores"},o={PICTURE:"cardPicture",GAME:"currentGame",CARD:"editCard",SETTINGS:"settings",USERNAME:"username",CURRENT_CARDSET:"currentCardset"};e.KEYS=o;var c={INVALID_NAME_CATEGORY:"Please enter a valid name and category!",INVALID_CARDSET:"The cardset name or category is not valid!",INVALID_CARD_DETAILS:"The card details are not valid!",CARDSET_ALREADY_EXISTS:"A cardset with the same name already exists!",CARD_DB_FAIL:"Failed to get card from the database!",CARD_ADD_FAIL:"Failed to add card to cardset!",CARDSET_ADD_FAIL:"Failed to add cardset to the database!",DELETE_CARD_FROM_CARDSET_FAIL:"Failed to delete card from the cardset!",STORE_SETTINGS:"Failed to store settings!",LOAD_SETTINGS:"Failed to load settings from the database!",GET_CARD_BY_ID_FAIL:"Failed to get card by ID!"},d=localforage.createInstance({name:i.STORE});function l(){return d.getItem(i.CARDSETS).then(function(t){return t?(t.forEach((e=t,function(t,n){var r=Object.assign(new s.CardSet,t);r.cards=r.cards.map(function(t){return Object.assign(new s.Card,t)}),e.set(n,r)})),t):new Map;var e})}function u(t){return l().then(function(e){return e.set(t.name,t),e}).then(function(t){return f(t)}).then(function(e){return Promise.resolve("Successfully updated the cardset ".concat(t.name,"!"))}).catch(function(e){throw console.error(e),Error("Failed to update the cardset ".concat(t.name,"!"))})}function h(t){return t.map(function(t){return Object.assign(new s.Highscore,t)})}function f(t){return d.setItem(i.CARDSETS,t)}function p(t){return l().then(function(e){return e.set(t.name,t),d.setItem(i.CARDSETS,e)}).then(function(){return Promise.resolve("Successfully added the ".concat(t.name," cardset!"))}).catch(function(t){throw console.log(t),Error(c.CARDSET_ADD_FAIL)})}function g(t){return l().then(function(e){return e.get(t)?e.get(t):null}).catch(function(t){throw Error(c.CARD_DB_FAIL)})}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.loadingSpinner=function(){return $('<div class="preloader-background">\n        <div class="preloader-wrapper active">\n            <div class="spinner-layer spinner-blue-only">\n                <div class="circle-clipper left">\n                    <div class="circle"></div>\n                </div>\n                <div class="gap-patch">\n                    <div class="circle"></div>\n                </div>\n                <div class="circle-clipper right">\n                    <div class="circle"></div>\n                </div>\n            </div>\n        </div>\n    </div>')},e.generateModal=function(t,e,n,r,a,i){(function(t,e,n,r){var a='<div id="'.concat(t,'" class="modal">\n                    <div class="modal-content">\n                        ').concat(e,'\n                    </div>\n                    <div class="modal-footer">\n                        <a href="#/" id="modal-').concat(t,"-").concat(n,'" class="modal-close waves-effect waves-green btn-flat btn1">').concat(n,'</a>\n                        <a href="#/" id="modal-').concat(t,"-").concat(r,'" class="modal-close waves-effect waves-green btn-flat btn2">').concat(r,"</a>\n                    </div>\n                </div>");$("body").append($(a))})(t,e,n,r),$("#modal-".concat(t,"-").concat(r)).on("click",a),$("#modal-".concat(t,"-").concat(n)).on("click",i);var o=$("#".concat(t));M.Modal.init(o[0],{onCloseEnd:s,preventScrolling:!0}),o.modal("open")},e.object2options=function(t){var e="";for(var n in t)t.hasOwnProperty(n)&&(e+='<option value="'.concat(n,'">').concat(t[n],"</option>"));return e},e.updateGameCardLayout=function(t){var e=t.getCurrentCard();$(".card-name").text(e.title),$(".card-qa").text(t.isFront?e.question:e.answer),$(".card-side").text(t.isFront?r.FRONT:r.BACK),$(".gameCardsAnswered").text("Answered: ".concat(t.getAnsweredCards().length,"/").concat(t.cardset.cards.length)),$(".gameCardsCorrectlyAnswered").text("Correct: ".concat(t.getCorrectCards().length,"/").concat(t.cardset.cards.length)),$(".currentCard").text("".concat(t.currentCardIndex+1,"/").concat(t.cardset.cards.length)),function(t){var e=t.getCurrentCard(),n=$(".smiley");n.removeClass("faint-black").removeClass("green-text").removeClass("red-text");var r="faint-black",a="sentiment_neutral";t.hasBeenAnswered(e)&&t.hasBeenCorrectlyAnswered(e)?(a="sentiment_very_satisfied",r="green-text"):t.hasBeenAnswered(e)&&(a="sentiment_very_dissatisfied",r="red-text");n.text(a).addClass(r)}(t),i=t.hasBeenAnswered(e),$(".answerControls").find(".btn").each(function(){i?$(this).addClass("disabled"):$(this).removeClass("disabled")}),$("#game-type-answer").prop("disabled",i),function(t){var e=t.getCurrentCard();$(".card-play-image").remove();var n=$(".card-content .img-wrapper");e.image&&t.isFront&&n.append(function(t){return $('<img class="card-play-image responsive-img" src="'.concat(t.image?t.image.data:"",'" alt="').concat(t.title,'-image">'))}(e))}(t),n=e,s=$(".answerControls"),s.find(".control").addClass("hidden"),s.find(a[n.typeAnswer?"TA":n.type]).removeClass("hidden"),"MC"===n.type&&function(t){$(".radioAnswerButtons").html(function(t){var e="";return t.isMultipleChoice()&&t.answerChoices.forEach(function(t,n){e+='<label class="btn-block">\n                            <input value="'.concat(n,'" class="with-gap" name="radioAnswer" type="radio" />\n                            <span>').concat(t,"</span>\n                        </label>")}),e}(t))}(n);var n,s;var i},e.showToast=function(t,e){M.toast({html:t,classes:e})};var r={CHOOSE_CARDSET:"Choose a cardset",NO_CARDSETS:"No cardsets have been created yet!",FRONT:"FRONT",BACK:"BACK",OFFLINE:"Currently working offline!"};var a={SA:".singleAnswerControls",TF:".trueFalseControls",MC:".multipleChoiceControls",TA:".typeAnswerControls"};function s(){$(this)[0].$el.remove()}},function(t,e,n){"use strict";function r(t,e){return"string"==typeof t&&"string"==typeof e?t.toLowerCase()===e.toLowerCase():t===e}function a(t){return"string"==typeof t?t.toLowerCase():t}Object.defineProperty(e,"__esModule",{value:!0}),e.isEmpty=function(t){if(null===t||void 0===t)return!0;if("string"==typeof t)return 0===$.trim(t).length;return!1},e.isEqualToCaseInsensitive=r,e.isInArrayLowerCase=function(t,e){return t.some(function(t){return r(t,e)})},e.removeDuplicatesArray=function(t){return function(t){var e=t.length;for(;e>0;){var n=Math.floor(Math.random()*e),r=t[--e];t[e]=t[n],t[n]=r}return t}(t.map(a).reduce(function(t,e){return t.indexOf(e)<0&&t.push(e),t},[]))},e.getUniqueValuesOfObjectsInMap=function(t,e){var n=[];return t.forEach(function(t){n.indexOf(t[e])<0&&n.push(t[e])}),n},e.scrollToBottom=function(){$("html,body").animate({scrollTop:document.body.scrollHeight},"fast")},e.cardsetNameComparator=function(t,e){return t.name.toLowerCase()<e.name.toLowerCase()?-1:t.name.toLowerCase()>e.name.toLowerCase()?1:0},e.validateSelect=function(){$("select[required]").css({display:"block",height:0,padding:0,width:0,position:"absolute"})},e.getSelectOptionByName=function(t){return $('select[name="'.concat(t,'"]')).find("option:selected").val()},e.isOnline=function(){return navigator.onLine},e.fDefault=function(t){return void t.preventDefault()}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.Card=c,e.Game=d,e.CardSet=l,e.Image=function(t,e){this.name=t,this.data=e},e.Highscore=u;var r=n(2),a=n(1),s=n(0),i=n(4),o={SA:"Single Answer",TF:"True or False",MC:"Multiple Choice"};function c(t,e,n,r){this.id=null,this.title=t,this.type=e,this.question=n,this.image=null,this.answer=r,this.guess=null,this.answerChoices=null,this.typeAnswer=!1}function d(t){this.cardset=t,this.currentCardIndex=0,this.isFront=!0,this.timeFinished=null}function l(t,e){this.name=t,this.category=e,this.cards=[]}function u(t,e,n,r){this.date=n,this.realTime=r,this.game=t}c.prototype.clearGuess=function(){this.guess=null},d.prototype.reset=function(){this.currentCardIndex=0,this.isFront=!0,this.timeFinished=null,this.cardset.cards.forEach(function(t){return t.clearGuess()})},d.prototype.nextCard=function(){this.cardset.cards.length>0&&(this.currentCardIndex+1<=this.cardset.cards.length-1?this.currentCardIndex++:this.currentCardIndex=0)},d.prototype.prevCard=function(){this.cardset.cards.length>0&&(this.currentCardIndex-1>=0?this.currentCardIndex--:this.currentCardIndex=this.cardset.cards.length-1)},d.prototype.answer=function(t){this.getCurrentCard().guess=t},d.prototype.isFinished=function(){return this.getAmountCards()===this.getAnsweredCards().length},d.prototype.getCorrectCards=function(){return this.getAnsweredCards().filter(function(t){return!0===t.isCorrectAnswer()})},d.prototype.getAmountCorrectAnswers=function(){return this.getCorrectCards().length},d.prototype.getAnswerAccuracy=function(){return Math.round(this.getCorrectCards().length/this.cardset.cards.length*100)},d.prototype.getAmountWrongAnswers=function(){return this.getAmountCards()-this.getAmountCorrectAnswers()},d.prototype.getAmountCards=function(){return this.cardset.cards.length},d.prototype.getAnsweredCards=function(){return this.cardset.cards.filter(function(t){return null!==t.guess})},d.prototype.hasBeenCorrectlyAnswered=function(t){return this.getCorrectCards().filter(function(e){return e.id===t.id}).length>0},d.prototype.hasBeenAnswered=function(t){return this.getAnsweredCards().filter(function(e){return e.id===t.id}).length>0},d.prototype.getCurrentCard=function(){return this.cardset.cards[this.currentCardIndex]},c.prototype.renderCompact=function(){return'<div id="'.concat(this.id,'" data-card="').concat(this.id,'" class="card">\n                <a href="#" class="faint-black delete-card-collection-item"><i class="delete material-icons">delete</i></a>\n                <a href="#/" class="faint-black edit-card-collection-item"><i class="edit material-icons">edit</i></a>\n                ').concat(this.image?'<a href="#" class="faint-black image-card-collection-item"><i class="photo material-icons">photo</i></a>':"",'\n                <div class="card-content">\n                    <span class="card-title compact-title">').concat(this.title,"</span>\n                    <p>Q: ").concat(this.question,'</p>\n                    <p class="answer">A: ').concat(this.answer,'</p>\n                    <p class="answers">').concat(this.isMultipleChoice()?'<p class="choices">'.concat(this.answerChoices.join(","),"</p>"):"",'</p>\n                    <p class="type">').concat(o[this.type],'</p>\n                    <p class="typing type keyboard">').concat(this.typeAnswer?'<i class="material-icons">keyboard</i>':"","</p>\n                </div>   \n            </div>")},c.prototype.render=function(){var t='<div id="'.concat(this.id,'" class="card">\n                               <a href="#/" class="faint-black delete-card-collection-item"><i class="delete material-icons">delete</i></a>\n                               <a href="#/" class="faint-black edit-card-collection-item"><i class="edit material-icons">edit</i></a>\n                               <div class="card-content">\n                                    <span class="card-title">').concat(this.title,"</span>");return this.image&&(t+='<div class="center">\n                                  <img class="responsive-img" src="'.concat(this.image.data,'" alt="card-image" title="card-image"">\n                           </div>')),t+="<p>Q: ".concat(this.question,'</p>\n                                </div>\n                                <div class="card-action">\n                                    <p class="answer">A: ').concat(this.answer,'</p>\n                                    <p class="answers">').concat(this.isMultipleChoice()?'<p class="choices">\n                                                                '.concat(this.answerChoices.join(","),"\n                                                                </p>"):"",'</p>\n                                    <p class="type">').concat(o[this.type],'</p>\n                                    <p class="typing type keyboard">').concat(this.typeAnswer?'<i class="material-icons">keyboard</i>':"","</p>\n                                </div>\n                            </div>")},c.prototype.isCorrectAnswer=function(){return(0,r.isEqualToCaseInsensitive)(this.answer,this.guess)},c.prototype.isMultipleChoice=function(){return"MC"===this.type||Array.isArray(this.answerChoices)},c.prototype.isValid=function(){return!((0,r.isEmpty)(this.title)||(0,r.isEmpty)(this.type)||(0,r.isEmpty)(this.question)||(0,r.isEmpty)(this.answer))},l.prototype.addCard=function(t){this.cards.push(t)},l.prototype.render=function(){var t='\n                <section class="cardset" data-cardset="'.concat(this.name,'" data-category="').concat(this.category,'">\n                    <ul class="collapsible">\n                        <li ').concat((0,i.startsCollapsed)()?"":'class="active"','>\n                    <div class="collapsible-header">\n                    <i class="material-icons">folder</i>').concat(this.name,'\n                    <a href="#/" class="faint-black home-hide-cardset"><i class="material-icons">arrow_drop_up</i></a>\n\n                    <div class="collapsible-items">\n                        <a href="#/" class="faint-black home-add-cardset"><i class="material-icons">add</i></a>\n                        <a href="#/" class="faint-black home-edit-cardset"><i class="material-icons">edit</i></a>\n                        <a href="#/" class="faint-black home-delete-cardset"><i class="material-icons">delete</i></a>\n                        <a href="#/" class="faint-black home-play-cardset"><i class="material-icons">play_arrow</i></a>\n                    </div>\n                        \n                  \n                </div>\n                <div class="collapsible-body">');return this.cards.forEach(function(e){return t+=(0,i.isCompactViewEnabled)()?e.renderCompact():e.render()}),0===this.cards.length&&(t+='<span class="center">No cards have been added yet, tap the <i class="material-icons">add</i> button to add a card!</span>'),t+="</div>\n                       </li>\n                    </ul>\n                </section>"},l.prototype.isValid=function(){return!(0,r.isEmpty)(this.name)&&!(0,r.isEmpty)(this.category)},u.prototype.save=function(t){(0,s.pAddHighscore)(this).then(t).catch(function(t){(0,a.showToast)(t,"")})},u.prototype.render=function(){var t="<tr>\n            <td>".concat(this.game.cardset.name,"</td>\n            <td>").concat(this.game.timeFinished,"</td>\n            <td>").concat(this.date.slice(0,-5)," ").concat(this.realTime.slice(0,-3),"</td>\n            <td></td>\n            <td></td>\n            <td></td>\n        </tr>");return this.game.cardset.cards.forEach(function(e){t+="<tr>\n                <td></td>\n                <td>".concat((0,r.isEqualToCaseInsensitive)(e.guess,e.answer)?'<i class="material-icons">check</i>':'<i class="material-icons">close</i>',"</td>\n                <td></td>\n                <td>").concat(e.title,"</td>\n                <td>").concat(e.guess,"</td>\n                <td>").concat(e.answer,"</td>\n            </tr>")}),t}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.init=function(){t=(0,s.getSettings)(),t&&t.forEach(function(t){return $("input[name='".concat(t.name,"']")).prop("checked",t.value)}),$(".form-save-settings").on("submit",p),$(".btn-clear-highscores").on("click",d).next().on("click",l).next().on("click",c);var t},e.startsCollapsed=function(){return(0,s.getSettings)()&&(0,s.getSettings)().filter(function(t){return t.name===i.START_COLLAPSED}).length>0},e.isCompactViewEnabled=function(){return(0,s.getSettings)()&&(0,s.getSettings)().filter(function(t){return t.name===i.COMPACT_VIEW}).length>0};var r=n(1),a=n(2),s=n(0),i={START_COLLAPSED:"startCollapsed",COMPACT_VIEW:"compactViewEnabled"},o={DELETE_ALL_DATA:"Are you sure you wish to clear all data? This includes all highscore data and all card related data such as all cardsets and cards!",DELETE_HIGHSCORE_DATA:"Are you sure you wish to clear all highscore related data?",DELETE_CARD_DATA:"Are you sure you wish to clear all card related data? This includes all cardsets and cards in these cardsets"};function c(t){t.preventDefault();var e="<p>".concat(o.DELETE_ALL_DATA,"</p>");(0,r.generateModal)("clearAllDataModal",e,"Cancel","Confirm",f,a.fDefault)}function d(t){t.preventDefault();var e="<p>".concat(o.DELETE_HIGHSCORE_DATA,"</p>");(0,r.generateModal)("clearAllDataModal",e,"Cancel","Confirm",u,a.fDefault)}function l(t){t.preventDefault();var e="<p>".concat(o.DELETE_CARD_DATA,"</p>");(0,r.generateModal)("clearAllDataModal",e,"Cancel","Confirm",h,a.fDefault)}function u(t){t.preventDefault(),(0,s.setHighscoresArr)([]).then(function(){(0,r.showToast)("Successfully cleared all highscore data!","")}).catch(function(t){(0,r.showToast)("Failed to clear highscore data!","")})}function h(t){t.preventDefault(),(0,s.pSetCardsetMap)(new Map).then(function(){(0,r.showToast)("Successfully cleared all card data!","")}).catch(function(){(0,r.showToast)("Failed to clear card data!","")})}function f(t){t.preventDefault(),h(t),u(t)}function p(t){t.preventDefault(),(0,s.saveSettings)($(this).serializeArray())}},,,,,,,function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.init=function(){(0,a.pGetAllHighscores)().then(function(t){return function(t){return t.length>0?t.map(function(t){return t.render()}).join(""):s.EMPTY_TABLE}(t)}).then(function(t){$("tbody").html(t)}).catch(function(t){(0,r.showToast)(t,"")})};var r=n(1),a=n(0),s={EMPTY_TABLE:"\n        <tr>\n            <td>No scores has been added yet!</td>\n            <td></td>\n            <td></td>\n            <td></td>\n            <td></td>\n            <td></td>\n        </tr>\n        "}},function(t,e,n){"use strict";var r=n(11),a=n(0);$(document).ready(function(){(0,a.init)(),(0,r.init)()})}]);