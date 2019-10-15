const crypto = require("crypto");
const request = require("request-promise");

const TWITTER_URL = "https://api.twitter.com/1.1";
const TWITTER_USERNAME = "@gimmedadjoke";
const GITHUB_URL = "https://github.com/alexluong/gimmedadjoke";

function createCrcResponseToken(crcToken) {
  const hmac = crypto
    .createHmac("sha256", process.env.TWITTER_CONSUMER_SECRET)
    .update(crcToken)
    .digest("base64");

  return `sha256=${hmac}`;
}

function getHandler(event, context, callback) {
  const crcToken = event.queryStringParameters.crc_token;

  if (crcToken) {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        response_token: createCrcResponseToken(crcToken)
      })
    });
  } else {
    callback(null, {
      statusCode: 400,
      body: JSON.stringify({
        message: "Error: crc_token missing from request."
      })
    });
  }
}

function postHandler(event, context, callback) {
  const body = JSON.parse(event.body);

  // If not a tweet event, we're not doing anything
  if (!body.tweet_create_events) {
    callback(null, { statusCode: 200 });
  }

  const tweet = body.tweet_create_events[0];

  // Check if we're mentioned
  if (tweet.text.toLowerCase().includes(TWITTER_USERNAME)) {
    // Fetch a dad joke
    request
      .get({
        url: "https://icanhazdadjoke.com",
        headers: {
          Accept: "text/plain",
          "User-Agent": `${TWITTER_USERNAME} (${GITHUB_URL})`
        }
      })
      .then(joke => {
        // Reply to the tweet
        request
          .post({
            url: `${TWITTER_URL}/statuses/update.json`,
            oauth: {
              consumer_key: process.env.TWITTER_CONSUMER_TOKEN,
              consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
              token: process.env.TWITTER_ACCESS_TOKEN,
              token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
            },
            headers: {
              "Content-Type": "application/json"
            },
            form: {
              status: joke,
              in_reply_to_status_id: tweet.id_str,
              auto_populate_reply_metadata: true
            }
          })
          .then(response => {
            console.log("Tweeted");
            console.log(response);
            callback(null, { statusCode: 200 });
          })
          .catch(error => {
            console.log(error);
            callback(null, { statusCode: 200 });
          });
      });
  }
}

exports.handler = (event, context, callback) => {
  try {
    switch (event.httpMethod) {
      case "GET":
        return getHandler(event, context, callback);
      case "POST":
        return postHandler(event, context, callback);
      default:
        callback(null, {
          statusCode: 410,
          body: JSON.stringify({ message: "Unsupported Request Method" })
        });
    }
  } catch (error) {
    console.log(error.message);
    callback(error, { statusCode: 500 });
  }
};
