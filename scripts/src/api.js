require("dotenv").config();
const request = require("request-promise");

const TWITTER_API_URL = process.env.TWITTER_API_URL;
const TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY;
const TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET;
const TWITTER_ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN;
const TWITTER_ACCESS_TOKEN_SECRET = process.env.TWITTER_ACCESS_TOKEN_SECRET;
const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;
const TWITTER_WEBHOOK_ENV = process.env.TWITTER_WEBHOOK_ENV;

const oauth = {
  consumer_key: TWITTER_CONSUMER_KEY,
  consumer_secret: TWITTER_CONSUMER_SECRET,
  token: TWITTER_ACCESS_TOKEN,
  token_secret: TWITTER_ACCESS_TOKEN_SECRET
};

const authorizationHeaders = {
  authorization: `Bearer ${TWITTER_BEARER_TOKEN}`
};

exports.getBearerToken = function() {
  return request.post({
    url: "https://api.twitter.com/oauth2/token?grant_type=client_credentials",
    auth: {
      user: process.env.TWITTER_CONSUMER_KEY,
      pass: process.env.TWITTER_CONSUMER_SECRET
    },
    json: true
  });
};

exports.getWebhook = function() {
  return request.get({
    url: `${TWITTER_API_URL}/account_activity/all/${TWITTER_WEBHOOK_ENV}/webhooks.json`,
    headers: authorizationHeaders,
    json: true
  });
};

exports.createWebhook = function(webhookUrl) {
  return request.post({
    url: `${TWITTER_API_URL}/account_activity/all/${TWITTER_WEBHOOK_ENV}/webhooks.json`,
    oauth,
    form: {
      url: webhookUrl
    },
    json: true
  });
};

exports.deleteWebhook = function(webhookId) {
  return request.delete({
    url: `${TWITTER_API_URL}/account_activity/all/${TWITTER_WEBHOOK_ENV}/webhooks/${webhookId}.json`,
    oauth
  });
};

exports.getSubscription = function() {
  return request.get({
    url: `${TWITTER_API_URL}/account_activity/all/${this.webhookEnv}/subscriptions.json`,
    oauth,
    json: true
  });
};

exports.createSubscription = function() {
  return request.post({
    url: `${TWITTER_API_URL}/account_activity/all/${this.webhookEnv}/subscriptions.json`,
    oauth,
    json: true
  });
};

exports.deleteSubscription = function(userId) {
  return request.delete({
    url: `${TWITTER_API_URL}/account_activity/all/${this.webhookEnv}/subscriptions/${userId}.json`,
    headers: authorizationHeaders,
    json: true
  });
};
