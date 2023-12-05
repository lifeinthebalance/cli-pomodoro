#!/usr/bin/env mode

import inquirer from "inquirer";
import ansiEscapes from "ansi-escapes";

// let time = {
//   work: 25,
//   break: 5,
// };

let cycleHandler = 0; //amount of cycles completed
let stateHandler = 1; //current sstate

function workCountdown(flow, pause) {
  let sec = 60;
  console.log(stateHandler);

  // if ((flow == 0) && (sec == 55)) {
  //   process.exit(1)

  // }


  setInterval(() => {

    if ((flow == 0) && (sec == 55)) {
      stateHandler = 0;
      console.log(stateHandler);
    }



    process.stdout.write(
      stateHandler
        ? ansiEscapes.eraseLines(1) +
        `${flow - 1}:${sec <= 10 ? "0" + (sec -= 1) : (sec -= 1)}`
        : ansiEscapes.eraseLines(1) +
        `${pause}:${sec <= 10 ? "0" + (sec -= 1) : (sec -= 1)}`
    );



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
