#!/usr/bin/env mode

import inquirer from "inquirer";
import notifier from 'node-notifier';
import ora from 'ora';
// import ansiEscapes from "ansi-escapes";

let workDuration = 0;
let breakDuration = 0;

async function startPomodoro() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'work',
      message: 'Enter work duration',
      default: '25',
      validate(answer) {
        if (answer.match('[0-9]+')) {
          return true;
        }

        return 'Must be a number'
      },
    },
    {
      type: 'input',
      name: 'break',
      message: 'Enter break duration',
      default: '5',
      validate(answer) {
        if (answer.match('[0-9]+')) {
          return true;
        }

        return 'Must be a number'
      },
    },
  ]).then((answers) => {
    console.clear();
    inquirer.prompt({
      type: 'input',
      name: 'starter',
      message: '>',
      default: 'type "start" when ready',
      validate(answer) {
        if (answer !== 'start') {
          return 'enter "start" to start the clock'
        }

        return true;
      }
    }).then(({ starter }) => {
      console.clear();
      workDuration = Number(answers.work);
      breakDuration = Number(answers.break);
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


  const workOra = ora(`flow state until ${workEndHours}:${(workEndMinutes < 10) ? '0' + workEndMinutes : workEndMinutes}`).start();

  setTimeout(() => {
    workOra.stop();
    cycles += 1;
    notifier.notify({
      title: 'Pomodoro',
      message: 'Take a break!',
      icon: './icon.png',
    });
    let breakOra = ora(`taking a break until ${breakEndHours}:${(breakEndMinutes < 10) ? '0' + breakEndMinutes : breakEndMinutes}`).start();
    setTimeout(() => {
      breakOra.stop();
      notifier.notify({
        title: 'Pomodoro',
        message: 'Get ready for work!',
        icon: './icon.png',
      });
      inquirer.prompt({
        type: 'input',
        name: 'starter',
        message: '>',
        default: 'type "start" when ready',
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
  //   icon: './icon.png',
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
  //     icon: './icon.png',
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


await startPomodoro();

