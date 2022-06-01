const router = require("express").Router();
const fs = require("fs");

router.get("/checkready", async (req,res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ success : true, ready }, null, 4 ));
});


router.get("/getqr", async (req, res) => {
    client
      .getState()
      .then((data) => {
        if (data) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ success:true, message: "Already Authenticated." }, null, 4))
        } else sendQr(res);
      })
      .catch(() => sendQr(res));
  });

  function sendQr(res) {
    fs.readFile("components/last.qr", (err, last_qr) => {
      if (!err && last_qr) {
        var page = `
                      <html>
                          <body>
                              <script type="module">
                              </script>
                              <div id="qrcode"></div>
                              <script type="module">
                                  import QrCreator from "https://cdn.jsdelivr.net/npm/qr-creator/dist/qr-creator.es6.min.js";
                                  let container = document.getElementById("qrcode");
                                  QrCreator.render({
                                      text: "${last_qr}",
                                      radius: 0.5, // 0.0 to 0.5
                                      ecLevel: "H", // L, M, Q, H
                                      fill: "#536DFE", // foreground color
                                      background: null, // color or null for transparent
                                      size: 256, // in pixels
                                  }, container);
                              </script>
                          </body>
                      </html>
                  `;
        res.write(page);
        res.end();
      }
    });
  }

module.exports = router;