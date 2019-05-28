const express = require('express')
const router = express.Router()
const fs = require('fs')
let tempList =[];
/* GET home page. */
router.get('/', function (req, res, next) {
 
  fs.readFile('./dataconfig/templateList.json', 'utf-8', function (err, data) {
    if (err) throw err;
    //console.log(data);
    if (data.toString().length != 0) {
       tempList = JSON.parse(data);    
    }
  })
  res.render('index', {
    tempList: tempList
  })
});
module.exports = router