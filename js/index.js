import { initReserve } from "./modules/initReverse.js";
import { initService } from "./modules/initService.js";
import { initSlider } from "./modules/initSlider.js";


const init = () => {
    initSlider();
    initService();
    initReserve();
}

window.addEventListener('DOMContentLoaded', init)