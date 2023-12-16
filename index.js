#!/usr/bin/env mode

import inquirer from "inquirer";
import ansiEscapes from "ansi-escapes";

let workDuration = 0;
let breakDuration = 0;

async function startPomodoro() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'work',
      message: 'work tiem?',
      default: '25',
    },
    {
      type: 'input',
      name: 'break',
      message: 'break time?',
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

function workCountdown(num1, num2) {
  let work = num1 - 1;
  let rest = num2 - 1;
  let sec = 60;
  let stateHandler = 1; //current sstate
  let cycleHandler = 0; //amount of cycles completed

  const timer = setInterval(() => {


    if (stateHandler) {
      process.stdout.write(ansiEscapes.eraseLines(1) + `${work}:${sec <= 10 ? "0" + (sec -= 1) : (sec -= 1)}`);

      if (sec === 0) {
        work -= 1;
        sec = 60;
      }
    }

    if (!stateHandler) {
      process.stdout.write(ansiEscapes.eraseLines(1) + `${rest}:${sec <= 10 ? "0" + (sec -= 1) : (sec -= 1)}`);

      if (sec === 0) {
        rest -= 1;
        sec = 60;
      }
    }

    if ((work === 0 && sec === 55)) {
      clearInterval(timer);
      console.clear();
      inquirer.prompt({
        type: 'input',
        name: 'period',
        message: '>'
      }).then(({ period }) => {
        if (period === 'break') {
          workCountdown(workDuration, breakDuration)
        }
      })
    }

  }, 1000);
}

// async function start() {
//   const schedule = await inquirer.prompt({
//     name: "method",
//     type: "input",
//     message: "work time?",
//     default() {
//       return "25-5";
//     },
//   });
//   const result = schedule.method.split("-");
//   console.clear();

//   workCountdown(Number(result[0]), Number(result[1]));
// }

// await start();


