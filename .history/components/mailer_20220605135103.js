const router = require("express").Router();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
require('dotenv').config();


router.post('/sendmailpdf', async (req, res) => {
    let subject = req.body.subject;
    let text = req.body.text;
    let to = req.body.to;
    let attachments = req.body.attachments;
    let filename = req.body.filename;
    let content = req.body.content;


    console.log('/sendmailpdf');
    

    

    if (subject == undefined || text == undefined || to == undefined || attachments == undefined) {
        res.send(JSON.stringify({ success: false, message: 'all fied madatory: subject,text,to & attachments' }, null, 4));
    } else {

        const createTransporter = async () => {
            const oauth2Client = new OAuth2(
                process.env.CLIENT_ID,
                process.env.CLIENT_SECRET,
                "https://developers.google.com/oauthplayground"
            );

            oauth2Client.setCredentials({
                refresh_token: process.env.REFRESH_TOKEN
            });

            const accessToken = await new Promise((resolve, reject) => {
                oauth2Client.getAccessToken((err, token) => {
                    if (err) {
                        reject("Failed to create access token :(");
                    }
                    resolve(token);
                });
            });

            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    type: "OAuth2",
                    user: process.env.EMAIL,
                    accessToken,
                    clientId: process.env.CLIENT_ID,
                    clientSecret: process.env.CLIENT_SECRET,
                    refreshToken: process.env.REFRESH_TOKEN
                }
            });

            return transporter;
        };

        const sendEmail = async (emailOptions) => {
            let emailTransporter = await createTransporter();
            await emailTransporter.sendMail(emailOptions);
        };

        sendEmail({
            subject: subject,
            text: text,
            to: to,
            from: process.env.EMAIL,
            attachments: attachments,
        }).then(() => {
            res.send(JSON.stringify({ success: true, message: `Message successfully sent to ${to}` }, null, 4));
        }).catch((reason) => {
            res.send(JSON.stringify({ success: false, message: `${reason}` }, null, 4));
        });
    }

});

module.exports = router;