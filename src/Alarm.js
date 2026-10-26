
export default class Alarm extends HTMLElement {
  #intervalCallback;
  #intervalId = 0;

  constructor() {
    super();

    this.addEventListener("click", this);
    this.duration = 60 * 1000;

    // Obtiene el sonido del HTML
    this.audio = this.querySelector(".alarm-sound");

    // Comprueba las alarmas cada segundo
    this.#intervalCallback = () => {
      this.alarms.forEach((alarm) => {

        // Si está pausada, no comprueba la alarma
        if (alarm.hasAttribute("paused")) {
          alarm.removeAttribute("ringing");
          return;
        }

        // Obtiene la hora introducida
        const { value } = alarm.querySelector("input");

        if (!value) {
          alarm.removeAttribute("ringing");
          return;
        }

        // Separa horas, minutos y segundos
        const [horas, minutos, segundos = "0"] = value.split(":");

        // Crea una fecha con la hora de la alarma
        const date = new Date();
        date.setHours(
          Number(horas),
          Number(minutos),
          Number(segundos),
          0
        );

        // Calcula la diferencia con la hora actual
        const delta = Date.now() - date.getTime();

        // Comprueba si ha llegado la hora
        if (delta >= 0 && delta < this.duration) {

          if (!alarm.hasAttribute("ringing")) {
            alarm.setAttribute("ringing", "");

            // Lanza el evento de alarma
            this.dispatchEvent(
              new CustomEvent("ring", {
                bubbles: true,
                detail: alarm
              })
            );
          }

        } else {
          alarm.removeAttribute("ringing");
        }
      });

      // Reproduce el sonido si alguna alarma está sonando
      this.actualizarSonido();
    };
  }

  // Obtiene todas las alarmas
  get alarms() {
    return [...this.querySelector(".items").children];
  }

  // Duración de la alarma
  get duration() {
    return Number(this.getAttribute("duration"));
  }

  set duration(value) {
    this.setAttribute("duration", value);
  }

  // Añade una alarma
  add() {
    const alarm = this.querySelector("template").content.cloneNode(true);
    this.querySelector(".items").appendChild(alarm);
  }

  // Inicia la comprobación automática
  connectedCallback() {
    if (!this.#intervalId) {
      this.#intervalId = setInterval(this.#intervalCallback, 1000);
    }
  }

  // Elimina una alarma
  delete(alarm) {
    if (alarm && this.alarms.includes(alarm)) {
      this.querySelector(".items").removeChild(alarm);
      this.actualizarSonido();
    }
  }

  // Detiene la comprobación al eliminar el componente
  disconnectedCallback() {
    clearInterval(this.#intervalId);
    this.#intervalId = 0;

    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }

  // Detecta los botones pulsados
  handleEvent(event) {
    const button = event.target.closest("button");

    if (!button || !this.contains(button)) {
      return;
    }

    const alarm = this.alarms.find((item) => item.contains(button));

    if (button.classList.contains("add")) {
      this.add();

    } else if (button.classList.contains("delete")) {
      this.delete(alarm);

    } else if (button.classList.contains("pause")) {
      this.pause(alarm);

    } else if (button.classList.contains("start")) {
      this.start(alarm);
    }
  }

  // Pausa una alarma
  pause(alarm) {
    if (this.alarms.includes(alarm)) {
      alarm.setAttribute("paused", "");
      alarm.removeAttribute("ringing");
      this.actualizarSonido();
    }
  }

  // Activa una alarma
  start(alarm) {
    if (this.alarms.includes(alarm)) {
      alarm.removeAttribute("paused");
    }
  }

  // Comprueba si hay alguna alarma sonando y controla el audio
  actualizarSonido() {
    const algunaSonando = this.alarms.some((alarm) =>
      alarm.hasAttribute("ringing")
    );

    if (algunaSonando) {
      if (this.audio && this.audio.paused) {
        this.audio.play().catch(() => {
          console.log("No se ha podido reproducir el sonido.");
        });
      }
    } else if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }
}
