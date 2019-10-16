const crypto = require("crypto");
const request = require("request-promise");

const TWITTER_API = "https://api.twitter.com/1.1";
const TWITTER_USERNAME = "@gimmedadjoke";
const GITHUB_URL = "https://github.com/alexluong/gimmedadjoke";

function createCrcResponseToken(crcToken) {
  const hmac = crypto
    .createHmac("sha256", process.env.TWITTER_CONSUMER_SECRET)
    .update(crcToken)
    .digest("base64");

  return `sha256=${hmac}`;
}

function getHandler(req, res) {
  const crcToken = req.query.crc_token;

  if (crcToken) {
    res.status(200).send({
      response_token: createCrcResponseToken(crcToken)
    });
  } else {
    res.status(400).send({
      message: "Error: crc_token missing from request."
    });
  }
}

function postHandler(req, res) {
  const body = req.body;

  // If not a tweet event, we're not doing anything
  if (!body.tweet_create_events) {
    res.status(200).send();
    return;
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
        console.log(`Joke: ${joke}`);
        request
          .post({
            url: `${TWITTER_API}/statuses/update.json`,
            oauth: {
              consumer_key: process.env.TWITTER_CONSUMER_KEY,
              consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
              token: process.env.TWITTER_ACCESS_TOKEN,
              token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
            },
            form: {
              status: `${joke}\n#dadjoke`,
              in_reply_to_status_id: tweet.id_str,
              auto_populate_reply_metadata: true
            }
          })
          .then(response => {
            console.log("Tweeted");
            console.log(response);
            res.status(200).send();
          })
          .catch(error => {
            console.log(error.message);
            res.status(500).send();
          });
      });
  }
}

module.exports = (req, res) => {
  try {
    switch (req.method) {
      case "GET":
        return getHandler(req, res);
      case "POST":
        return postHandler(req, res);
      default:
        return res.status(410).json({ message: "Unsupported Request Method" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send();
  }
};
