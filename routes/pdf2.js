const express = require('express')
const router = express.Router()


var fs = require('fs');



router.post('/', (req, res) => {

    var fonts = {
        Roboto: {
            normal: 'fonts/Roboto-Regular.ttf',
            bold: 'fonts/Roboto-Medium.ttf',
            italics: 'fonts/Roboto-Italic.ttf',
            bolditalics: 'fonts/Roboto-MediumItalic.ttf'
        }
    };

    // var PdfPrinter = require('pdfmake');
    const pdfMake = require('pdfmake')
    var printer = new pdfMake(fonts);

    var arr = require("../modules/object_analytics.js");
    console.log(arr);
    var docDefinition = {
        content: [{
            style: 'tableExample',
            table: {
                widths: [50, 300, '*'],
                body: arr 
            }
        }]
    };
    
    var pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(fs.createWriteStream('document.pdf'));
    pdfDoc.end();

    // console.log(docDefinition);
    // res.render('pdf2', { title: 'Express' });
})
module.exports = router