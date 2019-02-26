const express = require("express");
const router = express.Router();
const R = require("ramda");
const nodemailer = require("nodemailer");
path = require("path");
//const fileUpload = require('express-fileupload');
var fs = require("fs");
require("dotenv").config();

//router.use(fileUpload());
router.post("/", (req, res) => {

   /*  const tempFolderExcel = './xlsx/';
    const tempFolderPdf = './pdfs/'; */
    const tempFolderExcel = path.join(__dirname, '../xlsx/');
    const tempFolderPdf = path.join(__dirname, '../pdfs/');

    (async function () {
        try {
            let urlFile = req.files.urlFile;
            //console.log(urlFile);
            await urlFile.mv(tempFolderExcel + urlFile.name);
            var XLSX = require("xlsx");
            //   let urlFile = req.files.urlFile;
            var workbook = XLSX.readFile(tempFolderExcel + urlFile.name);
            var sheet_name_list = workbook.SheetNames;
            //  console.log(sheet_name_list);
            var ArrBefor = [];
            sheet_name_list.forEach(function (y) {
                var worksheet = workbook.Sheets[y];
                // console.log(worksheet);
                var headers = {};
                var data = [];
                for (z in worksheet) {
                    if (z[0] === "!") continue;

                    var col = z.substring(0, 1);
                    var row = parseInt(z.substring(1));
                    var value = worksheet[z].v;

                    if (row == 1) {
                        headers[col] = value;
                        continue;
                    }
                    if (!data[row]) data[row] = {};
                    data[row][headers[col]] = value;
                }
                data.shift();
                data.shift();
                //drop those first two rows which are empty

                // console.log(data);
                ArrBefor = data;
            });
         //   console.log(ArrBefor);


        //    console.log(ArrBefor);

            var num1 = ["I", "II", "III"];
            var num2 = ["1", "2", "3"];

            ArrMain = [];
            //console.log(ArrChange);
            ArrBefor.forEach(function (element) {
                //console.log("test 1");
                var ArrChange = [];
                if (R.equals(ArrBefor[0], element)) {
                    return;
                }
                // if (R.equals(ArrBefor[0], element)) {
                //     // bold1 = true;
                //     // bold2 = true;
                //     // bold3 = true;
                //     // f_color = '#7b7f82'
                //     // f_color2 = '#7b7f82'
                //     // f_color3 = '#7b7f82'
                //     continue;
                // }
                // let bold1 = false,
                //     bold2 = false,
                //     bold3 = false;
                // let italics1 = false,
                //     italics2 = false,
                //     italics3 = false;
                // let f_color = '',
                //     f_color2 = '',
                //     f_color3 = '';

                // if (R.includes(element.ITEM, num1)) {
                //     bold1 = true;
                //     bold2 = true;

                // }
                // if (R.includes(element.ITEM, num2)) {
                //     italics1 = true
                //     italics2 = true;
                //     italics3 = true;
                // }
                // if (R.includes(element.ITEM, num2)) {
                //     italics1 = true
                //     italics2 = true;
                //     italics3 = true;
                // }

                //   console.log("test 2");
                for (var i = 0; i < Object.keys(element).length; i++) {
                    var ArrRam = [];

                    ArrRam = [{
                            text: "1",
                            //   bold: bold3,
                            // italics: italics3,
                            color: "black"
                            // fillColor: f_color3
                        },
                        {
                            text: ArrBefor[0][Object.keys(ArrBefor[0])[i]],
                            //  bold: bold1,
                            //  italics: italics1,
                            color: "red"
                            //  fillColor: f_color
                        },
                        {
                            text: element[Object.keys(ArrBefor[0])[i]],
                            // bold: bold2,
                            //  italics: italics2,
                            color: "black"
                            // fillColor: f_color2
                            // style: ['hid', 'anotherStyle']
                        }
                    ];
                    // console.log(ArrRam);
                    ArrChange = ArrChange.concat(R.append(ArrRam, []));

                    //  console.log("ArrChange");
                }
                //  console.log(ArrChange);
                ArrMain = ArrMain.concat(R.append(ArrChange, []));
                R.append("R001", ArrMain);
                //  R.append[ArrChange,ArrMain]

                //  });

                // R.prepend(ArrRam,ArrChange);
            });

            //Create PDF
            var fonts = {
                Roboto: {
                    normal: "fonts/Roboto-Regular.ttf",
                    bold: "fonts/Roboto-Medium.ttf",
                    italics: "fonts/Roboto-Italic.ttf",
                    bolditalics: "fonts/Roboto-MediumItalic.ttf"
                }
            };

            const pdfMake = require("pdfmake");
            var printer = new pdfMake(fonts);

            var cpdf = 0;
            ArrBefor.forEach(element => {
                if (R.equals(element, ArrBefor[0])) {
                    return;
                }
                var docDefinition = {
                    userPassword: "123",
                    ownerPassword: element[Object.keys(element)[5]],
                    permissions: {
                        printing: "highResolution", //'lowResolution'
                        modifying: false,
                        copying: false,
                        annotating: true,
                        fillingForms: true,
                        contentAccessibility: true,
                        documentAssembly: true
                    },
                    content: [{
                        style: "tableExample",
                        table: {
                            widths: [50, 300, "*"],
                            body: ArrMain[cpdf]
                        }
                    }]
                };
                //   console.log(element);
                var pdfDoc = printer.createPdfKitDocument(docDefinition);
                //   console.log("loi roi");
                pdfDoc.pipe(fs.createWriteStream(tempFolderPdf + 'document' + cpdf + ".pdf"));
                cpdf++;
                pdfDoc.end();
                //console.log("loi roi 2");
            });


            //  Send Mail
            var cmail = 0;
            ArrBefor.forEach(element => {
                if (R.equals(element, ArrBefor[0])) {
                    return;
                }
                var transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.DB_USER,
                        pass: process.env.DB_PASS
                    }
                });

                var mailOption = {
                    from: '"Minh Tuan Nguyen" <dev.nmtuan@gmail.com>',
                    to: element[Object.keys(element)[4]],
                    subject: "hello",
                    //text: req.body.content,
                    attachments: [{
                        filename: "Payslip.pdf",
                        path: tempFolderPdf + 'document' + cmail + ".pdf",
                        content: "hello world!"
                    }],
                };

                transporter.sendMail(mailOption, function (err, res) {
                    if (err) {
                        console.log("Error can't send mail");
                    } else {
                        console.log("Email Sent");
                    }

                    cmail++;
                    if (cmail == ArrBefor.length - 1) {
                        fs.readdir(tempFolderPdf, (err, files) => {
                            if (err) throw err;
                            for (const file of files) {
                                fs.unlink(path.join(tempFolderPdf, file), err => {
                                    if (err) throw err;
                                });
                            }
                        });
                    }
                    //console.log(res);
                });

            });

        } catch (error) {
            return res.status(500).send('Error processing files.');
        } finally {
            fs.readdir(tempFolderExcel, (err, files) => {
                if (err) throw err;
                for (const file of files) {
                    fs.unlink(path.join(tempFolderExcel, file), err => {
                        if (err) throw err;
                    });
                }
            });
        }
    })();
    res.redirect("/");
});

module.exports = router;