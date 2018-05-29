import {init} from "./game"
import {init as initStorage} from "../data"


$(document).ready(function () {
    initStorage();
    init();
});