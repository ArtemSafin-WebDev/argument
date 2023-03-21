import "virtual:svg-icons-register";
import reviewsSlider from "./reviewsSlider";
import tariffsSlider from "./tariffsSlider";
import setScrollbarWidth from "./setScrollbarWidth";
import modals from "./modals";
import "../css/style.css";

document.addEventListener("DOMContentLoaded", () => {
  console.log("Hello world");
  setScrollbarWidth();
  reviewsSlider();
  tariffsSlider();
  modals();
});
