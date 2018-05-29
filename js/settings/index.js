import {init} from "./settings";
import {init as initStorage} from "../data"

$(document).ready(function () {
   initStorage();
   init();
});