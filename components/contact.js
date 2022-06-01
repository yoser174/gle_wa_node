const router = require('express').Router();

router.get('/isregistereduser/:phone', async (req, res) => {
    let phone = req.params.phone;

    res.setHeader('Content-Type', 'application/json');
    
    if (phone != undefined || ready == false) {
        client.isRegisteredUser(`${phone}@c.us`).then((is) => {

            is ? res.send(JSON.stringify({ success:true, message: `${phone} is a whatsapp user` }))
                : res.send(JSON.stringify({ success:false, message: `${phone} is not a whatsapp user` }));
        })
    } else {
        res.send(JSON.stringify({ success:false, message: 'Either not ready or invalid Phone number' }));
    }
});

router.get('/getprofilepic/:phone', async (req, res) => {
    let phone = req.params.phone;

    res.setHeader('Content-Type', 'application/json');

    if (phone != undefined  || ready == false) {
        client.getProfilePicUrl(`${phone}@c.us`).then((imgurl) => {
            if (imgurl) {
                res.send(JSON.stringify({ success:true, message: imgurl }));
            } else {
                res.send(JSON.stringify({ success:false, message: 'Client not ready or Not Found' }));
            }
        })
    }
});

router.get('/getcontact/:phone', async (req, res) => {
    let phone = req.params.phone;

    res.setHeader('Content-Type', 'application/json');

    if (phone != undefined || ready == false) {
        client.getContactById(`${phone}@c.us`).then((contact) => {
            res.send(JSON.stringify({ success:false, contact }));
        }).catch((err) => {
            res.send(JSON.stringify({ success:false, message: 'Not found' }));
        });
    }
});


module.exports = router;