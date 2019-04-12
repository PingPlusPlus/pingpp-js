var error = function PingppError(message, extra) {
  this.message = message;
  this.extra = extra;
};

module.exports = {
  Error: error,
};
