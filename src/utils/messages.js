const generateLocationMessage = (username, url) => {
  return {
    createdAt: new Date().getTime(),
    url,
    username,
  };
};

const generateMessage = (username, text) => {
  return {
    createdAt: new Date().getTime(),
    text,
    username,
  };
};

module.exports = {
  generateLocationMessage,
  generateMessage,
};
