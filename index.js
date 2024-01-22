#!/usr/bin/env mode

import inquirer from "inquirer";
import notifier from 'node-notifier';
import cliProgress from 'cli-progress';
import chalk from "chalk";
import gradient from "gradient-string";
// import ansiEscapes from "ansi-escapes";

let workDuration = 0;
let breakDuration = 0;

function startPomodoro() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'work',
      message: 'Enter work duration:',
      default: '25',
      validate(answer) {
        if (!answer.match('[0-9]+')) {
          return 'Must be a number';
        }

        return true;
      },
    },
    {
      type: 'input',
      name: 'break',
      message: 'Enter break duration:',
      default: '5',
      validate(answer) {
        if (!answer.match('[0-9]+')) {
          return 'Must be a number';
        }

        return true;
      },
    },
  ]).then((answers) => {
    workDuration = Number(answers.work);
    breakDuration = Number(answers.break);
    console.clear();
    inquirer.prompt({
      type: 'input',
      name: 'starter',
      message: '>',
      validate(input) {
        if (input !== 'start') {
          return 'type "start" when ready';
        }

        return true;
      }
    }).then(() => {
      pomodoroTimer(workDuration, breakDuration);
    })
  })
}


let cycles = 0; //amount of cycles completed

function pomodoroTimer(workD, breakD) {

  if ((cycles > 0) && !(cycles % 4)) {
    breakD *= 4;
  }

  function showOutput(num, state) {
    let workTimestamp = Date.now() + (workD) * 60000;
    let breakTinestamp = Date.now() + (workD + breakD) * 60000;
    let workEndHours = new Date(workTimestamp).getHours();
    let workEndMinutes = new Date(workTimestamp).getMinutes();
    let breakEndHours = new Date(breakTinestamp).getHours();
    let breakEndMinutes = new Date(breakTinestamp).getMinutes();

    console.clear();


    if (state === 'work') {
      process.stdout.write(gradient('EA5A6F', 'DE791E', 'FCCF3A')(`FOCUSING UNTIL ${workEndHours}:${(workEndMinutes < 10) ? '0' + workEndMinutes : workEndMinutes} 🐒 \n \n`));
    } else {
      process.stdout.write(gradient('274B74', '8233C5', 'E963FD')(`TAKING A BREAK UNTIL ${breakEndHours}:${(breakEndMinutes < 10) ? '0' + breakEndMinutes : breakEndMinutes} 🐒 \n \n`));
    }

    const bar = new cliProgress.SingleBar({
      format: chalk.bgMagenta('{bar}') + '  {percentage}%',
    }, cliProgress.Presets.shades_grey);
    bar.start(num, 0);
    const int = setInterval(() => {
      bar.increment(1000);
      // if (bar.getProgress() === 1) {
      //   bar.removeListener();
      // }
    }, 1000);

  };
  showOutput(workD * 60000, 'work');


  setTimeout(() => {
    cycles += 1;
    showOutput(breakD * 60000, 'break');

    notifier.notify({
      title: 'Pomodoro',
      message: 'Take a break!',
      icon: './icon_70.png',
    });

    setTimeout(() => {

      notifier.notify({
        title: 'Pomodoro',
        message: 'Get ready for work!',
        icon: './icon_70.png',
      });

      console.clear();

      inquirer.prompt({
        type: 'input',
        name: 'starter',
        message: '>',
        validate(input) {
          if (input !== 'start') {
            return 'type "start" when ready';
          }

          return true;
        }
      }).then(() => {
        pomodoroTimer(workDuration, breakDuration);
      });
    }, breakD * 60000 + 1000);
  }, workD * 60000);
}


startPomodoro();

