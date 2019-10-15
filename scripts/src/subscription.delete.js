const api = require("./api");

function run() {
  const userId = process.env.TWITTER_ACCESS_TOKEN.split("-")[0];

  api
    .deleteSubscription(userId)
    .then(response => {
      console.log("Successfully remove subscription.");
    })
    .catch(error => {
      console.log(error.message);
    });
}

run();
