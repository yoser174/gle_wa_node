const router = require('express').Router();
const { MessageMedia } = require("whatsapp-web.js");

router.get('/getchats', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    client.getChats().then((chats) => {
        res.send(JSON.stringify({ success: true, message: chats}, null, 4));
    }).catch((e) => {
        res.send(JSON.stringify({ success: false,message: e.message }, null, 4))
    })
});

router.post('/sendmessage', async (req,res) => {
    let phone = req.body.phone;
    let message = req.body.message;
    console.log(phone);
    console.log(message);

    if (phone == undefined || message == undefined || ready == false) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ success:false, message:"Either whatsapp client not ready or not valid phone / message" }, null, 4))
    } else {
        client.sendMessage(phone + '@c.us', message).then((response) => {
            if (response.id.fromMe) {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ success:true, message: `Message successfully sent to ${phone}` }, null, 4))
            }
        });
    }
});

router.post('/sendpdf', async (req,res) => {
    var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

    let phone = req.body.phone;
    let pdf = req.body.pdf;
    let filename = req.body.filename;

    res.setHeader('Content-Type', 'application/json');

    if (phone == undefined || pdf == undefined || ready == false) {
        res.send(JSON.stringify({ success:false, message: "Eihter not ready or not valid phone and base64/url of pdf" }))
    } else {
        if (base64regex.test(pdf)) {
            let media = new MessageMedia('application/pdf', pdf,filename);
            client.sendMessage(`${phone}@c.us`, media).then((response) => {
                if (response.id.fromMe) {
                    res.send(JSON.stringify({ success:true, message: `MediaMessage successfully sent to ${phone}` }))
                }
            });
        } else if (vuri.isWebUri(pdf)) {
            if (!fs.existsSync('./temp')) {
                await fs.mkdirSync('./temp');
            }

            var path = './temp/' + pdf.split("/").slice(-1)[0]
            mediadownloader(pdf, path, () => {
                let media = MessageMedia.fromFilePath(path);
                client.sendMessage(`${phone}@c.us`, media).then((response) => {
                    if (response.id.fromMe) {
                        res.send(JSON.stringify({ success:true, message: `MediaMessage successfully sent to ${phone}` }))
                        fs.unlinkSync(path)
                    }
                });
            })
        } else {
            res.send(JSON.stringify({ success:false, message: 'Invalid URL/Base64 Encoded Media' }))
        }
    }
});

module.exports = router;