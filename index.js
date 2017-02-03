// This is the app bootstrapper.

// Upgrade slow, buggy native promises
require('creed').shim()

// If we're in dev mode, run from src.
process.env.NODE_ENV === 'dev'
    ? require('./src').main()
    : require('./build').main()
