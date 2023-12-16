import inquirer from 'inquirer';
// const notifier = require('node-notifier');

let timerId;

async function startPomodoro() {
    const workDuration = 25 * 60 * 1000;  // 25 minutes in milliseconds
    const breakDuration = 5 * 60 * 1000;   // 5 minutes in milliseconds

    console.log('Pomodoro started!');

    // Work
    await runTimer('Work', workDuration);

    // Break
    console.log('Take a break!');
    await runTimer('Break', breakDuration);

    // Restart for the next Pomodoro
    startPomodoro();
}

async function runTimer(type, duration) {
    console.log(`Focus on ${type}!`);

    return new Promise((resolve) => {
        let remainingTime = duration;

        const showTimer = setInterval(() => {
            console.clear();
            const minutes = Math.floor(remainingTime / 60000);
            const seconds = ((remainingTime % 60000) / 1000).toFixed(0);
            console.log(`Time left: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);

            remainingTime -= 1000;

            if (remainingTime < 0) {
                clearInterval(showTimer);
                console.log(`${type} completed!`);
                // notifier.notify({
                //     title: 'Pomodoro',
                //     message: `${type} completed!`,
                // });
                resolve();
            }
        }, 1000);

        // Allow interruption
        inquirer
            .prompt({
                type: 'input',
                name: 'interrupt',
                message: 'Type "pause" to interrupt the timer. Press Enter to resume.',
            })
            .then(({ interrupt }) => {
                if (interrupt.toLowerCase() === 'pause') {
                    clearInterval(showTimer);
                    console.log('Timer paused. Press Enter to resume.');
                    inquirer.prompt({ type: 'input', name: 'resume', message: '' }).then(() => {
                        console.log('Timer resumed.');
                        runTimer(type, remainingTime).then(resolve);
                    });
                }
            });
    });
}

startPomodoro();
