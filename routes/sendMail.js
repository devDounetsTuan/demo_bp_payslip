const express = require("express");
const router = express.Router();
const R = require("ramda");
const nodemailer = require("nodemailer");
path = require("path");
var fs = require("fs");
require("dotenv").config();
const pdfMake = require("pdfmake");

router.post("/", (req, res) => {
  const path_folder_excel = path.join(__dirname, "../xlsx/");
  const path_folder_pdf = path.join(__dirname, "../pdfs/");

  function readExcel(path_file) {
    try {

      clean_folder_xlsx();

      var xlsx = require("xlsx");
      var workbook = xlsx.readFile(path_folder_excel + path_file.name);
      var sheet_name_list = workbook.SheetNames;
      //  console.log(sheet_name_list);
      var arr_raw_data = [];
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

        arr_raw_data = data;
      });
    //  console.log(arr_raw_data);
      return arr_raw_data;
    } catch (error) {
      console.log("Error can't read excel file: " + error);
    }

  }




  function edit_data(arr_raw_data) {
    var num1 = ["I", "II", "III"];
    var num2 = ["1", "2", "3"];

    arr_edited_data_m = [];
    //console.log(ArrChange);
    arr_raw_data.forEach(function (element) {
      //console.log("test 1");
      var arr_edited_data_ch = [];
      if (R.equals(arr_raw_data[0], element)) {
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
        var arr_temp_data = [];

        arr_temp_data = [{
            text: "1",
            //   bold: bold3,
            // italics: italics3,
            color: "black"
            // fillColor: f_color3
          },
          {
            text: arr_raw_data[0][Object.keys(arr_raw_data[0])[i]],
            //  bold: bold1,
            //  italics: italics1,
            color: "red"
            //  fillColor: f_color
          },
          {
            text: element[Object.keys(arr_raw_data[0])[i]],
            // bold: bold2,
            //  italics: italics2,
            color: "black"
            // fillColor: f_color2
            // style: ['hid', 'anotherStyle']
          }
        ];
        arr_edited_data_ch = arr_edited_data_ch.concat(
          R.append(arr_temp_data, [])
        );
      }

      arr_edited_data_m = arr_edited_data_m.concat(
        R.append(arr_edited_data_ch, [])
      );
    });
    return arr_edited_data_m;
  }



 
  function generate_pdf(arr_raw_data, arr_edited_data_m) {
    //Create PDF
    try {

      clean_folder_pdfs();
      
      var fonts = {
        Roboto: {
          normal: "fonts/Roboto-Regular.ttf",
          bold: "fonts/Roboto-Medium.ttf",
          italics: "fonts/Roboto-Italic.ttf",
          bolditalics: "fonts/Roboto-MediumItalic.ttf"
        }
      };
      var printer = new pdfMake(fonts);
      var cpdf = 0;
      arr_raw_data.forEach(element => {
        if (R.equals(element, arr_raw_data[0])) {
          return;
        }

        var docDefinition = {
          userPassword: "admin",
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
              body: arr_edited_data_m[cpdf]
            }
          }]
        };
        var pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(fs.createWriteStream(path_folder_pdf + "document" + cpdf + ".pdf"));
        cpdf++;
        pdfDoc.end();
      });

    } catch (error) {
      console.log("Error can't create pdf file: " + error);
    }
  }


  

  function send_mail(arr_raw_data) {
    //  Send Mail
    var cmail = 0;
    var check_mail_sent = 0;
    arr_raw_data.forEach(element => {
      if (R.equals(element, arr_raw_data[0])) {
        return;
      }
      //  console.log(ArrBefor.length);
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
        attachments: [{
          filename: "Payslip.pdf",
          path: path_folder_pdf + "document" + cmail + ".pdf",
          content: "hello world!"
        }]
      };
      cmail++;
      // console.log(check_mail_sent);
      transporter.sendMail(mailOption, function (err, res) {
        if (err) {
          console.log("Error can't send mail");
        } else {
          console.log("Email Sent");
        }
        check_mail_sent++;
        if (check_mail_sent == arr_raw_data.length - 1) {
          clean_folder_xlsx()
          clean_folder_pdfs();
        }
      });
    });
  }

  function clean_folder_xlsx() {
    fs.readdir(path_folder_excel, (err, files) => {
      if (err) throw err;
      for (const file of files) {
        if (R.equals(file, ".gitignore")) {
          continue;
        }
        fs.unlink(path.join(path_folder_excel, file), err => {
          if (err) throw err;
        });
      }
    });
  }

  function clean_folder_pdfs() {
    fs.readdir(path_folder_pdf, (err, files) => {
      if (err) throw err;
      for (const file of files) {
        if (R.equals(file, ".gitignore")) {
          continue;
        }
        fs.unlink(path.join(path_folder_pdf, file), err => {
          if (err) throw err;
        });
      }
    });
  }


  (async function () {
    try {
      //Upload excel file
      let path_file = req.files.path_file;
      try {
        await path_file.mv((path_folder_excel + path_file.name));
      } catch (error) {
        console.log("Error can't upload excel file");
      }
      //Read excel file
      let excel_data = readExcel(path_file);
      //edit data
      edit_data(excel_data);
      //Create pdf file
      generate_pdf(excel_data, edit_data(excel_data));
      //send mail
      send_mail(excel_data);
    } catch (error) {
      return res.status(500).send("Error processing files.");
    }
  })();
  res.redirect("/");
});

module.exports = router;