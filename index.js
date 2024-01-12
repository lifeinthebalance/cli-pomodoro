#!/usr/bin/env mode

import inquirer from "inquirer";
import notifier from 'node-notifier';
import cliProgress from 'cli-progress';
import chalk from "chalk";
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
      console.clear();
      pomodoroTimer(workDuration, breakDuration);
    })
  })
}


let cycles = 0; //amount of cycles completed

function pomodoroTimer(workD, breakD) {
  // let rest = ((cycles > 0) && (cycles % 4 === 0)) ? work * 4 - 1 : work - 1;
  // let sec = 60;
  // let state = 1; //current sstate
  if ((cycles > 0) && !(cycles % 4)) {
    breakD *= 4;
  }

  let workTimestamp = Date.now() + (workD) * 60000;
  let breakTinestamp = Date.now() + (workD + breakD) * 60000;
  let workEndHours = new Date(workTimestamp).getHours();
  let workEndMinutes = new Date(workTimestamp).getMinutes();
  let breakEndHours = new Date(breakTinestamp).getHours();
  let breakEndMinutes = new Date(breakTinestamp).getMinutes();
  // let endHours = new Date(timestamp).getHours();
  // let endMinutes = new Date(timestamp).getMinutes();


  process.stdout.write(`flow state until ${workEndHours}:${(workEndMinutes < 10) ? '0' + workEndMinutes : workEndMinutes} \n \n`);
  // let workOra = ora(`flow state until ${workEndHours}:${(workEndMinutes < 10) ? '0' + workEndMinutes : workEndMinutes} \n`).start();
  function progressBar(num) {
    const bar = new cliProgress.SingleBar({
      format: chalk.bgRed('{bar}') + ' {percentage}%',
    }, cliProgress.Presets.shades_grey);
    bar.start(num, 0);
    const int = setInterval(() => {
      bar.increment(1000);
    }, 1000);
  };
  progressBar(workD * 60000);


  setTimeout(() => {
    // workOra.stop();
    cycles += 1;
    notifier.notify({
      title: 'Pomodoro',
      message: 'Take a break!',
      icon: './icon_70.png',
    });
    // let breakOra = ora(`taking a break until ${breakEndHours}:${(breakEndMinutes < 10) ? '0' + breakEndMinutes : breakEndMinutes}`).start();
    setTimeout(() => {
      // breakOra.stop();
      notifier.notify({
        title: 'Pomodoro',
        message: 'Get ready for work!',
        icon: './icon_70.png',
      });
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
      }).then(({ starter }) => {
        if (starter === 'start') {
          console.clear();
          pomodoroTimer(workDuration, breakDuration);
        }
      });
    }, breakD * 60000);
  }, workD * 60000);


  // process.stdout.moveCursor(0, 1);

  // const timer = setInterval(() => {

  //   ansiEscapes.cursorShow;
  //   if (state) {
  //     process.stdout.write(ansiEscapes.eraseLines(1) + ` ${work}:${sec <= 10 ? "0" + (sec -= 1) : (sec -= 1)}`);

  //     if ((sec === 0) && (work > 0)) {
  //       work -= 1;
  //       sec = 60;
  //     }


  //     if ((work === 0) && (sec === 55)) {

  //       cycles += 1;
  //       state = 0;
  //       sec = 60;
  // notifier.notify({
  //   title: 'Pomodoro',
  //   message: 'Take a break!',
  //   icon: './icon.webp',
  // });
  //     }


  //   } else {
  //     process.stdout.write(ansiEscapes.eraseLines(1) + `taking a break until ${endHours}:${endMinutes}`);

  //     if ((sec === 0) && (rest > 0)) {
  //       rest -= 1;
  //       sec = 60;
  //     }
  //   }


  // if ((sec === 55) && !state) {
  //   clearInterval(timer);
  //   console.clear();
  //   notifier.notify({
  //     title: 'Pomodoro',
  //     message: 'Get ready for work!',
  //     icon: './icon.webp',
  //   });
  //   inquirer.prompt({
  //     type: 'input',
  //     name: 'start',
  //     message: '>',
  //     default: 'type "start" when ready',
  //   }).then(({ start }) => {
  //     if (start == 'start') {
  //       console.clear();
  //       pomodoroTimer(workDuration, breakDuration);
  //     }
  //   })
  // }

  // }, 1000);
}


startPomodoro();

