const api = require("./api");

function run() {
  api
    .getWebhook()
    .then(response => {
      const webhookId = response[0].id;
      api
        .deleteWebhook(webhookId)
        .then(response => {
          console.log("Successfully delete webhook");
        })
        .catch(error => {
          console.log(error);
        });
    })
    .catch(error => {
      console.log(error.message);
    });
}

run();
