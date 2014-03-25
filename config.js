module.exports = {
  server: {
    url: 'localhost', // The URL where the server is deployed to.  Typically localhost for development.
    port: 3000, // The port on which the ssl protected server will listen, or the unencrypted server if ssl is disabled.
    logging: 'dev', // Sets logging levels for server, can be either 'dev' or 'prod'.
    session: {
      name: 'phix.session', // The name of the cookie used to pass session information to the client.
      key: 'test' // The secret key used to generate unique session identifiers.  Should be complex string in production.
    }
  },
  database: {
    url: 'localhost', // The URL where the database server is deployed.
    port: 12345, // The port on which the database server is deployed.
    name: 'raccoon' // Name of the database.
  }
};