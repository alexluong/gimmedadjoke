function getHandler(event, context, callback) {
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      method: "GET"
    })
  });
}

function postHandler(event, context, callback) {
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      method: "POST"
    })
  });
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
