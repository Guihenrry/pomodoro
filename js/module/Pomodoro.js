export default class Pomodoro {
  constructor(timerStart) {
    this.timerStart = timerStart;
    this.currentMinute = timerStart;
    this.currentSecond = 0;

    this.elements = document.querySelectorAll('[data-pomodoro]');
    this.buttonsPomodoro = [...this.elements].filter(e => !isNaN(+e.getAttribute('data-pomodoro')));

    this.buttonStart = document.querySelector('[data-pomodoro="start"]');
    this.buttonStop = document.querySelector('[data-pomodoro="stop"]');
    this.buttonReset = document.querySelector('[data-pomodoro="reset"]');
    this.display = document.querySelector('[data-pomodoro="display"]');
    this.progressBar = document.querySelector('[data-pomodoro="progress"]');
    this.audio = document.querySelector('[data-pomodoro="audio"]');
  }

  formatTimer() {
    const minute = this.currentMinute.toString().padStart(2, '0');
    const second = this.currentSecond.toString().padStart(2, '0');
    return `${minute}:${second}`;
  }

  updateDisplay() {
    this.display.innerText = this.formatTimer();
  }

  updateTitle() {
    document.title = `${this.formatTimer()}`;
  }

  pushNotification() {
    Push.create('Pomodoro', {
      body: 'Acabou o Tempo',
      icon: '/img/icon-push.png',
      timeout: 4000,
      onClick() {
        window.focus();
        this.close();
      }
    });
  }

  timeIsUp() {
    this.audio.play();
    document.title = 'Acabou o Tempo!';
    this.pushNotification();
  }

  updateProgressBar() {
    const totalSeconds = (this.currentMinute * 60) + this.currentSecond;
    const percentage = totalSeconds / (this.timerStart * 60) * 100;
    this.progressBar.style.width = `${percentage}%`;
  }

  decreasesTime() {
    if (this.currentMinute === 0 & this.currentSecond === 0) {
      this.stop();
      this.timeIsUp();
    } else {

      if (this.currentSecond === 0 & this.currentMinute > 0) {
        this.currentMinute--;
        this.currentSecond = 59;
      } else {
        this.currentSecond--;
      }

      this.updateDisplay();
      this.updateProgressBar()
      this.updateTitle();
    }
  }

  toggleButtonsActions() {
    this.buttonStart.classList.toggle('hide');
    this.buttonStop.classList.toggle('hide');
  }

  start() {
    if (!this.started) {
      this.timer = setInterval(this.decreasesTime, 1000);
      this.started = true;
      this.toggleButtonsActions();
    }
  }

  stop() {
    if (this.started) {
      clearInterval(this.timer);
      this.started = false;
      this.toggleButtonsActions();
    }
  }

  reset() {
    this.stop();
    this.currentMinute = this.timerStart;
    this.currentSecond = 0;
    this.updateDisplay();
    document.title = 'Pomodoro';
  }

  updateTimerStart(timer) {
    this.timerStart = timer;
    this.reset();
    this.start();
  }

  handleButtonsPomodoro({ target }) {
    this.updateTimerStart(target.getAttribute('data-pomodoro'));

    this.buttonsPomodoro.forEach((button) => {
      button.classList.remove('active');
    });

    target.classList.add('active');
  }

  getTimerStartByActiveClass() {
    this.buttonsPomodoro.forEach((button) => {
      if (button.classList.contains('active'))
        this.timerStart = button.getAttribute('data-pomodoro');
      this.currentMinute = this.timerStart;
    });
  }

  bindMethods() {
    this.decreasesTime = this.decreasesTime.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.reset = this.reset.bind(this);
    this.handleButtonsPomodoro = this.handleButtonsPomodoro.bind(this);
  }

  addPomodoroEvents() {
    this.buttonStart.addEventListener('click', this.start);
    this.buttonStop.addEventListener('click', this.stop);
    this.buttonReset.addEventListener('click', this.reset);

    this.buttonsPomodoro.forEach((button) => {
      button.addEventListener('click', this.handleButtonsPomodoro);
    })
  }

  init() {
    this.getTimerStartByActiveClass();
    this.bindMethods();
    this.addPomodoroEvents();
    this.updateDisplay();
    return this;
  }
}
