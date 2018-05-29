import {showToast} from "../gui";
import {pGetAllHighscores} from "../data";

const HTML = {
    EMPTY_TABLE: `
        <tr>
            <td>No scores has been added yet!</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
        `,
};

function highscores2HTMLString(highscores) {
    if (highscores.length > 0)
        return highscores.map(score => score.render()).join("");
    else
        return HTML.EMPTY_TABLE;
}

export function init() {
    renderOverview();
}

function renderOverview() {
    pGetAllHighscores().then(function (highscores) {
        return highscores2HTMLString(highscores);
    }).then(function (htmlstring) {
        $("tbody").html(htmlstring);
    }).catch(function (err) {
        showToast(err, "");
    });
}
