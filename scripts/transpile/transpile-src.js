const glob = require('glob');
const path = require('path');
const { transformFromAstAsync } = require('@babel/core');

const { writeFileAsync, readFileAst, copyAsync } = require('./utils');

const srcToEsBabelPlugin = path.resolve(
  __dirname,
  './plugins/babel-plugin-src-to-es.js',
);

const sassToES = path.resolve(
  __dirname,
  './plugins/babel-plugin-sass-to-es.js',
);

module.exports = function({ dir = '.' }) {
  const src = path.join(dir, 'src');
  const destSrcDir = path.resolve(`${dir}/dist`);
  const destEsDir = path.resolve(`${dir}/dist/es`);
  // const destSrcDir = path.resolve(`${dir}/dist/src`);
  // const destEsDir = path.resolve(`${dir}/dist/es/src`);

  const esCopied = copyAsync({
    src: `${src}/**/!(*.js)`,
    dist: destEsDir,
  });

  const srcCopied = copyAsync({
    src: `${src}/**/!(*.js)`,
    dist: destSrcDir,
  });

  const files = glob.sync('**/*.js', {
    ignore: [
      '**/*.story.js',
      '**/*.meta.js',
      '**/*.spec.js',
      '**/*.e2e.js',
      '**/*.driver.js',
      '**/test/**/*',
      '**/docs/**/*',
    ],
    cwd: src,
  });

  const es = files.map(async fileName => {
    const ast = await readFileAst(path.join(src, fileName), 'utf8');
    const filePath = path.join(src, fileName);

    const esnext = await transformFromAstAsync(ast, null, {
      babelrc: true,
      ast: false,
      filename: await filePath,
      plugins: [[srcToEsBabelPlugin, { esToSrc: false }]],
    });

    return writeFileAsync(fileName, destEsDir, esnext.code);
  });

  const cjs = files.map(async fileName => {
    const ast = await readFileAst(path.join(src, fileName), 'utf8');
    const filePath = path.join(src, fileName);

    const es5 = await transformFromAstAsync(ast, null, {
      babelrc: false,
      ast: false,
      filename: await filePath,
      plugins: [
        [srcToEsBabelPlugin, { esToSrc: true }],
        sassToES,
        '@babel/plugin-transform-modules-commonjs',
        'babel-plugin-dynamic-import-node',
      ],
    });
    return writeFileAsync(fileName, destSrcDir, es5.code);
  });

  return Promise.all([es, cjs, esCopied, srcCopied]);
}
