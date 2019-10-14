const crypto = require("crypto");

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
  console.log(body);
  callback(null, { statusCode: 200 });
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
    console.log(e.message);
    callback(error, { statusCode: 500 });
  }
};
