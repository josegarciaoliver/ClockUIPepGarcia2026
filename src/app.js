import Alarm from "./Alarm.js";
import Clock from "./Clock.js";
import Stopwatch from "./Stopwatch.js";
import Timer from "./Timer.js";

// Registra los componentes
customElements.define("x-alarm", Alarm);
customElements.define("x-clock", Clock);
customElements.define("x-stopwatch", Stopwatch);
customElements.define("x-timer", Timer);

document.addEventListener("DOMContentLoaded", () => {

  // Selecciona las pestañas y las secciones
  const tabs = document.querySelectorAll(".tab");
  const sections = document.querySelectorAll("main > section");

  // Muestra la sección seleccionada
  function showSection(hash) {
    sections.forEach((section) => {
      section.style.display = section.id === hash ? "block" : "none";
    });
  }

  // Muestra la pestaña inicial
  const initialTab = document.querySelector(".tab.active");

  const initialHash = initialTab
    ? initialTab.getAttribute("href").replace("#", "")
    : "clock";

  showSection(initialHash);

  // Controla los clics de las pestañas
  tabs.forEach((tab) => {

    tab.addEventListener("click", (event) => {
      event.preventDefault();

      // Desactiva todas las pestañas
      tabs.forEach((t) => {
        t.classList.remove("active");
        t.removeAttribute("aria-current");
      });

      // Activa la pestaña seleccionada
      tab.classList.add("active");
      tab.setAttribute("aria-current", "page");

      // Muestra su sección
      const hash = tab.getAttribute("href").replace("#", "");

      showSection(hash);
    });

  });

});
