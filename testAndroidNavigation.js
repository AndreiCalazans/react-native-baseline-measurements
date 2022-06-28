const {exec} = require('child_process');

const _exec = async command => {
  return new Promise(res => {
    exec(command, (error, stdout) => {
      if (error !== null) {
        console.log(`exec error: ${error}`);
      }
      res(stdout);
    });
  });
};

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

const main = async () => {
  const clear = 'adb logcat -c';
  const stop = 'adb shell am force-stop com.testreactnative';
  const open = 'adb shell monkey -p com.testreactnative 1';
	const press = 'adb shell input tap 739 1527';

  console.log('clearing logs');
  await _exec(clear);

  for (let i = 0; i < 9; i++) {
    console.log('run - ', i);
    await _exec(open);
		await sleep(1500);
		await _exec(press);
		await sleep(1000);
    await _exec(stop);
  }
  console.log('retrieving logs');
  const logs = await _exec('adb logcat -d -s ReactNativeJS');
  console.log('Result', logs.match(/marker:\s.*/g));
  return 0;
};

main();
