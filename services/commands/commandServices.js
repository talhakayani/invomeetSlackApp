const axios = require('axios');

exports.sendMessageToSlackUrl = async (responseUrl, message) => {
  try {
    const response = await axios({
      url: responseUrl,
      method: 'post',
      data: message,
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response) throw new Error('Something went wrong');
    return response;
  } catch (err) {
    return err.message;
  }
};
