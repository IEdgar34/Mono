import "../sass/style.scss";
import { yMapsInit } from "./modules/ymap";
import { mask } from "./modules/phonemask";

window.addEventListener("DOMContentLoaded", () => {
    yMapsInit();
    mask();
});
