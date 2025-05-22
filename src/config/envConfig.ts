import { StringValue } from "ms";
import * as process from "node:process";

export const config = {
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN || "localhost",
  SERVER_URL: process.env.SERVER_URL || "http://localhost:5000",
  SERVER_PORT: process.env.SERVER_PORT || "5000",
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "secret",
  JWT_ACCESS_EXPIRES_IN:
    (process.env.JWT_ACCESS_EXPIRES_IN as StringValue) || "1h",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN:
    (process.env.JWT_REFRESH_EXPIRES_IN as StringValue) || "24h",
  JWT_REFRESH_LONG_TERM_EXPIRES_IN:
    (process.env.JWT_REFRESH_LONG_TERM_EXPIRES_IN as StringValue) || "30d",
  JWT_RESET_SECRET: process.env.JWT_RESET_SECRET || "secret",
  JWT_RESET_EXPIRES_IN:
    (process.env.JWT_RESET_EXPIRES_IN as StringValue) || "1h",
  JWT_CONFIRM_SECRET: process.env.JWT_CONFIRM_SECRET || "secret",
  JWT_CONFIRM_EXPIRES_IN:
    (process.env.JWT_CONFIRM_EXPIRES_IN as StringValue) || "24h",
  GOOGLE_MAP_API_KEY: process.env.GOOGLE_MAP_API_KEY,
};

export const gmailCredentials = {
  user: process.env.MAIL_USER,
  clientId: process.env.GMAIL_CLIENT_ID,
  clientSecret: process.env.GMAIL_CLIENT_SECRET,
  refreshToken: process.env.GMAIL_REFRESH_TOKEN,
  redirectUri: process.env.GMAIL_REDIRECT_URI,
};

export const awsCredentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  bucketName: process.env.AWS_BUCKET_NAME,
};
