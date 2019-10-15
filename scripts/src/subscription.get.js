const api = require("./api");

function run() {
  api
    .getSubscription()
    .then(response => {
      console.log("The subscription is active.");
    })
    .catch(error => {
      console.log(error.message);
      console.log("The subscription is NOT active.");
    });
}

run();
