const api = require("./api");

const WEBHOOK_URL = process.env.WEBHOOK_URL;

function run() {
  api
    .createWebhook(WEBHOOK_URL)
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error.message);
    });
}

run();
