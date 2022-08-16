const { connect, connection } = require('mongoose');

const connectionString = process.env.MONOGDB_URI || 'mongodb://localhost:27017/snDB';

connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

module.exports = connection;