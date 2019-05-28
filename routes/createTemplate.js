const express = require('express')
const router = express.Router()
const fs = require('fs')
const R = require('ramda');
let tempList = [];

router.post('/', function (req, res, next) {
 
  fs.readFile('./dataconfig/templateList.json', 'utf-8', function (err, data) {
    if (err) throw err;
    var tempObj = req.body;
    if (data.toString().length == 0) {
      tempList = R.append(tempObj, [])
      fs.writeFile('./dataconfig/templateList.json', JSON.stringify(tempList), 'utf-8', (err) => {
        if (err) throw err;
      });
    } else {
      tempList = JSON.parse(data);
      tempList.push(tempObj);
      fs.writeFile('./dataconfig/templateList.json', JSON.stringify(tempList), 'utf-8',(err) => {
        if (err) throw err;
      });
    }
    res.render('index',{tempList:tempList});
  });
 
})

module.exports = router;