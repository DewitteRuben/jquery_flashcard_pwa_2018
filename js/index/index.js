import {init as initIndex} from "./indexPage";
import {init as initStorage} from "../data"

$(document).ready(function () {
    initStorage();
    initIndex();
});