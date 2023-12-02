#!/usr/bin/env mode

import inquirer from "inquirer";
import ansiEscapes from "ansi-escapes";

const time = {
  work: 25,
  break: 5,
};

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

  setInterval(() => {
    process.stdout.write(ansiEscapes.eraseLines(1) + (time.work -= 1));
  }, 1000);
}

function timer() {
  return (time.work -= 1);
}

await start();
