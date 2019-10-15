const api = require("./api");

function run() {
  api
    .createSubscription()
    .then(response => {
      console.log("Successfully subscribe the app owner user to webhook.");
    })
    .catch(error => {
      console.log(error.message);
    });
}

run();
