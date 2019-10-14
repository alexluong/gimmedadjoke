const api = require("./api");

function run() {
  api
    .getBearerToken()
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error.message);
    });
}

run();
