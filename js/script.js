import Pomodoro from './module/Pomodoro.js';

const pomodoro = new Pomodoro(1);
pomodoro.init()

const buttonTeste = document.querySelector('[data-pomodoro="teste"]');
buttonTeste.addEventListener('click', () => {
  pomodoro.currentMinute = 0;
  pomodoro.currentSecond = 3;

  pomodoro.start();
});