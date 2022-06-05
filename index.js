const qrcode = require('qrcode-terminal');
const express = require("express");
const bodyParser = require("body-parser");

const { Client,LocalAuth } = require('whatsapp-web.js');

const config = require("./config.json");

global.client = new Client({ authStrategy: new LocalAuth() });

const app = express();

const port = process.env.PORT || config.port;
//Set Request Size Limit 50 MB
app.use(bodyParser.json({ limit: "50mb" }));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

global.ready = false;

client.on('message', message => {
	console.log(message.body);
});

client.on('ready', () => {
    console.log('Client is ready!');
    global.ready = true;
});

client.on("disconnected", () => {
    console.log("disconnected");
    global.ready = false;
  });

client.initialize();

const authRoute = require("./components/auth");
const chatRoute = require("./components/chatting");
const contactRoute = require("./components/contact");
const mailerRoute = require("./components/mailer");

app.use("/auth", authRoute);
app.use("/chat", chatRoute);
app.use("/contact", contactRoute);
app.use("/mailer", mailerRoute);

app.listen(port, () => {
    console.log("Server Running Live on Port : " + port);
  });  