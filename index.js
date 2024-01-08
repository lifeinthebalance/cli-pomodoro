#!/usr/bin/env mode

import inquirer from "inquirer";
import ansiEscapes from "ansi-escapes";
import notifier from 'node-notifier';

let workDuration = 0;
let breakDuration = 0;

async function startPomodoro() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'work',
      message: 'Enter work duration',
      default: '25',
    },
    {
      type: 'input',
      name: 'break',
      message: 'Enter break duration',
      default: '5',
    },
  ]).then((answers) => {
    console.clear();
    inquirer.prompt({
      type: 'input',
      name: 'start',
      message: '>',
      default: 'type "start" when ready'
    }).then(({ start }) => {
      if (start == 'start') {
        console.clear();
        workDuration = Number(answers.work);
        breakDuration = Number(answers.break);
        workCountdown(workDuration, breakDuration);
      }
    })

  })


}

await startPomodoro();

let state = 1; //current sstate
let cycles = 0; //amount of cycles completed


function workCountdown(num1, num2) {
  let work = num1 - 1;
  let rest = num2 - 1;
  let sec = 60;

  const timer = setInterval(() => {


    if ((work >= 0) && (sec > 0)) {
      process.stdout.write(ansiEscapes.eraseLines(2) + `flow state \r\n${work}:${sec <= 10 ? "0" + (sec -= 1) : (sec -= 1)}`);

      if (sec === 0) {
        work -= 1;
        sec = 60;
      }
    } else {
      process.stdout.write(ansiEscapes.eraseLines(1) + `taking a break ${rest}:${sec <= 10 ? "0" + (sec -= 1) : (sec -= 1)}`);

      if (sec === 0) {
        rest -= 1;
        sec = 60;
      }
    }



    // if ((work === 0 && sec === 55 && state === 1)
    //   || (rest === 0 && sec === 55 && state === 0)) {
    //   clearInterval(timer);
    //   console.clear();
    //   notifier.notify({
    //     title: 'Pomodoro',
    //     message: "Time's up!",

    //   })
    //   inquirer.prompt({
    //     type: 'input',
    //     name: 'period',
    //     message: '>',
    //     default: 'work / break'
    //   }).then(({ period }) => {
    //     if (period === 'break') {
    //       state = 0;
    //       workCountdown(workDuration, breakDuration);
    //     } else if (period === 'work') {
    //       state = 1;
    //       workCountdown(workDuration, breakDuration);
    //     } else {
    //       console.log('kekw');
    //       process.stdout.write(ansiEscapes.eraseLines(1));
    //     }
    //   })
    // }

  }, 1000);
}



