const ProgressBar = require('progress');

const tasks = [
  // {
  //   task: () => require('./clean-dist'),
  //   description: 'cleaned ./dist',
  // },
  {
    task: () => require('./transpile-src'),
    description: '.js src => dist/src',
  },
];

const STEPS = tasks.length;
const TOTAL_STEPS_WIDTH = 20;
const START_TIME = new Date();
const STEP_WIDTH = TOTAL_STEPS_WIDTH / STEPS;

const progress = new ProgressBar(
  'Transpiling `src` -> `dist` :bar :percent :dir',
  {
    total: STEP_WIDTH * STEPS,
  },
);

tasks
  .reduce(
    (promise, { task, description, folder }) =>
      promise
        .then(() => task()({ folder }))
        .then(() => progress.tick(STEP_WIDTH, { dir: description }))
        .catch(e => {
          progress.interrupt('Error');
          console.error(e);
        }),
    Promise.resolve(),
  )
  .then(() =>
    console.log(`🚀 Done in ${Math.round(new Date() - START_TIME) / 1000}s`),
  );
