const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')
const xoauth2 = require('xoauth2');

require('dotenv').config()

router.post('/', (req, res) => {
   

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            // xoauth2: xoauth2.createXOAuth2Generator({
            //     user: 'dev.dounets.nmtuan@gmail.com',
            //     clientId: '830124461541-ttr30jg6tfl7m1j7j0t3odor2vock389.apps.googleusercontent.com',
            //     ClientSecret: '3x6rWbt8uyLj7km2CrcZ1w79',
            //     refreshToken: '1/URXPjDeDfn-QzgOrObonerKND_PBddTM0iQm1dBNBW0'
            // })
            user: process.env.DB_USER,
            pass: process.env.DB_PASS
        }
    });

    var mailOption = {
        from: '"Minh Tuan Nguyen" <dev.nmtuan@gmail.com>',
        to: req.body.email,
        subject: "hello",
        text: req.body.content
    };

    transporter.sendMail(mailOption, function (err, res) {
        if (err) {
            console.log("Error can't send mail");
        } else {
            console.log("Email Sent");
        }
      //  console.log(res);
    });
})

module.exports = router