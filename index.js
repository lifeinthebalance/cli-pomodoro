#!/usr/bin/env mode

import inquirer from "inquirer";
import ansiEscapes from "ansi-escapes";

let time = {
  work: 25,
  break: 5,
};


let cycleHandler = 0; //amount of cycles completed
let stateHandler = 1; //current sstate

function workCountdown(num1, num2) {
  let work = num1 - 1;
  let rest = num2 - 1;
  let sec = 60;

  setInterval(() => {


    if (stateHandler) {
      process.stdout.write(ansiEscapes.eraseLines(1) + `${work}:${sec <= 10 ? "0" + (sec -= 1) : (sec -= 1)}`);

      if (work === 0 && sec === 0) {
        sec = 60;
        stateHandler = 0;
      } else if (sec === 0) {
        work -= 1;
        sec = 60;
      }
    }

    if (!stateHandler) {
      process.stdout.write(ansiEscapes.eraseLines(1) + `${rest}:${sec <= 10 ? "0" + (sec -= 1) : (sec -= 1)}`);

      if (rest === 0 && sec === 0) {
        sec = 60;
        stateHandler = 1;
        cycleHandler += 1;
      } else if (sec === 0) {
        rest -= 1;
        sec = 60;
      }
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
  console.clear();

  workCountdown(Number(result[0]), Number(result[1]));
}




await start();
