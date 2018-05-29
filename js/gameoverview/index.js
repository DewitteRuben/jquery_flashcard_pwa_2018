import {init} from "./gameoverview";
import {init as initStorage} from "../data"

$(document).ready(function() {
    initStorage();
    init();
});