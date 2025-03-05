import nodemailer, { Transporter } from 'nodemailer';
import { google } from 'googleapis';
import {logger} from './logger';
import { createError } from './errorsHelper';
import { errors } from '../consts/errors';
import { gmailCredentials } from "../config/envConfig";

const { API_TOKEN_NOT_RETRIEVED, EMAIL_NOT_SENT } = errors;
const { user, clientId, clientSecret, refreshToken, redirectUri } = gmailCredentials;

const OAuth2 = google.auth.OAuth2;

const getAccessToken = async (): Promise<string> => {
    try {
        const oAuth2Client = new OAuth2(clientId, clientSecret, redirectUri);
        oAuth2Client.setCredentials({ refresh_token: refreshToken });
        const accessTokenResponse = await oAuth2Client.getAccessToken();
        if (!accessTokenResponse.token) {
            throw new Error('Failed to retrieve access token');
        }

        return accessTokenResponse.token;
    } catch (err) {
        logger.error(err);
        throw createError(400, API_TOKEN_NOT_RETRIEVED);
    }
};

const createTransport = async (): Promise<Transporter> => {
    try {
        const accessToken = await getAccessToken();
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: true,
            auth: {
                type: 'OAuth2',
                user,
                clientId,
                clientSecret,
                refreshToken,
                accessToken,
            },
        });

        return transporter;
    } catch (err) {
        logger.error(err);
        throw new Error('Failed to create transport');
    }
};

interface MailOptions {
    from: string;
    to: string;
    subject?: string;
    text?: string;
    html?: string;
}

const sendMail = async (mailOptions: MailOptions): Promise<void> => {
    try {
        const transporter = await createTransport();
        await transporter.verify();
        await transporter.sendMail(mailOptions);
        transporter.close();
    } catch (err) {
        logger.error(err);
        throw createError(400, EMAIL_NOT_SENT);
    }
};

export { getAccessToken, createTransport, sendMail };
