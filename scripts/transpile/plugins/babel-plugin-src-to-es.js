// This plugin transpile xxx/dist/src/SomeFile into xxx/dist/src/SomeFile
// and vice versa.

module.exports = function() {
  return {
    name: 'src-to-es',
    visitor: {
      ImportDeclaration(path, state) {
        const { esToSrc = false, libsName = [] } = state.opts;

        const originalPath = path.node.source.value;

        libsName.forEach(libName => {
          if (originalPath.includes(libName)) {
            const [fromDistPath, toDistPath] = esToSrc
              ? [`${libName}/dist/es/src`, `${libName}/dist/src`]
              : [`${libName}/dist/src`, `${libName}/dist/es/src`];

            path.node.source.value = originalPath.replace(
              fromDistPath,
              toDistPath,
            );
          }
        });
      },
    },
  };
};
