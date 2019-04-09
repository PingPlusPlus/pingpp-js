var utils = require('../utils');

module.exports = {
    handleCharge: function(charge) {
        var credential = charge.credential[charge.channel];
        utils.formSubmit(credential.request_url, 'post', credential.request_data);
    }
};
