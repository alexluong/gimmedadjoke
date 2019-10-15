const request = require("request-promise");

request
  .get({
    url: "https://icanhazdadjoke.com",
    headers: {
      Accept: "text/plain",
      "User-Agent": "@GimmeDadJoke (https://github.com/alexluong/gimmedadjoke"
    }
  })
  .then(response => {
    console.log(response);
  });
