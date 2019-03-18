const path = require('path')

module.exports = path.dirname(process.mainModule.filename)
//? grabs the root file of the app, 'app.js'
//? makes creating paths elsewhere easier b/c it give universal access to the root of the application (prevents having to use '..' to create relative paths back to the root)

//* SAME AS...

// module.exports = path.dirname(path.join(__dirname, '..', 'app.js'))
