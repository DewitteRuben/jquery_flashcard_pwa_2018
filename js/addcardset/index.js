import {init} from "./addcardset"
import {init as initStorage} from "../data"


$(document).ready(function () {
    initStorage();
    init();
});