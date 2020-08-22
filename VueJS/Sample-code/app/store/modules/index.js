/**
 * Automatically imports all the modules and exports as a single module object
 */
const requireModule = require.context('.', true, /\.module\.js$/);
const modules = {};

requireModule.keys().forEach(filename => {
    // create the module name from fileName
    // remove the module.js extension and capitalize

    let fileNameArr = filename.split('/');

    let name = fileNameArr[fileNameArr.length - 1];

    const moduleName = name
        .replace(/(\.\/|\.module\.js)/g, '');

    modules[moduleName] = requireModule(filename).default || requireModule(filename);
});

console.log(modules);
export default modules;