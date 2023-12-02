#!/usr/bin/env mode

import inquirer from "inquirer";
import ansiEscapes from "ansi-escapes";

let time = {
  work: 25,
  break: 5,
};

function workCountdown(num1, num2) {
  let minutes = Number(num1) - 1;
  let seconds = 60;

  setInterval(() => {
    process.stdout.write(
      ansiEscapes.eraseLines(1) + `${minutes}:${(seconds < 10) ? "0" + (seconds -= 1) : seconds -= 1}`
    );

    if (minutes === 0 & seconds === 0) {
      minutes = Number(num2);
    }

    if (seconds === 0) {
      minutes -= 1;
      seconds = 60;
    }


  }, 1000);
}

async function start() {
  const schedule = await inquirer.prompt({
    name: "method",
    type: "input",
    message: "work time?",
    default() {
      return "25-5";
    },
  });
  const result = schedule.method.split("-");
  time.work = Number(result[0]);
  time.break = Number(result[1]);

  console.clear();

  console.log('working')
  workCountdown(time.work, time.break);
}




await start();
