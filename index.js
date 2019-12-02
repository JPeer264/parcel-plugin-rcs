const rcs = require('rename-css-selectors');
const prettyMs = require('pretty-ms');
const chalk = require('chalk');
const ora = require('ora');

module.exports = (bundler) => {
  bundler.on('buildEnd', async () => {
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    console.log('');
    const spinner = ora(chalk.grey('Renaming css selectors')).start();
    const start = Date.now();

    try {
      await rcs.process.auto(['**/*.js', '**/*.html', '**/*.css'], {
        overwrite: true,
        cwd: bundler.options.outDir,
        newPath: bundler.options.outDir,
      });

      const end = Date.now();

      spinner.stopAndPersist({
        symbol: '✨ ',
        text: chalk.green(`Renamed css selectors in ${prettyMs(end - start)}.`),
      });
    } catch (err) {
      spinner.stopAndPersist({
        symbol: '❌ ',
        text: chalk.red("Couldn't rename css selectors:"),
      });

      console.error(err);
    }
  });
};
