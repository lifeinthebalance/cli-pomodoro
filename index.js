#!/usr/bin/env mode

import inquirer from "inquirer";
import ansiEscapes from "ansi-escapes";

let time = {
  work: 25,
  break: 5,
};

let cycleHandler = 0; //amount of cycles completed
let stateHandler = 1; //current sstate

function workCountdown(flow, pause) {
  flow = Number(flow) - 1;
  pause = Number(pause) - 1;
  let sec = 60;
  console.log(stateHandler);

  // if ((flow == 0) && (sec == 55)) {
  //   process.exit(1)

  // }


  setInterval(() => {

    if (((flow === 0) && (sec === 55)) && stateHandler) { //changes between states
      stateHandler = 0;
      console.log(stateHandler);
    }

    if (((pause === 0) && (sec === 55)) && !stateHandler) {
      stateHandler = 1;
      console.log(stateHandler);
    }

    if (sec === 55) {
      sec = 60;
    }

    process.stdout.write(
      stateHandler
        ? ansiEscapes.eraseLines(1) +
        `${flow}:${sec <= 10 ? "0" + (sec -= 1) : (sec -= 1)}`
        : ansiEscapes.eraseLines(1) +
        `${pause}:${sec <= 10 ? "0" + (sec -= 1) : (sec -= 1)}`
    );
  }, 1000);//daedaed



  // if ((sec === 55) && stateHandler) {
  //   flow -= 1;
  //   sec = 60;
  // } else {
  //   pause -= 1;
  //   sec = 60;
  // }
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




  workCountdown(time.work, time.break);
}




await start();
