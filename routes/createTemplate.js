const express = require('express')
const router = express.Router()
const fs = require('fs')
let jsonData = {}

router.post('/', function (req, res, next) {
    var tempListJson = fs.readFileSync('./dataconfig/templateList.json', 'utf-8')
    var tempList = [];
    var tempObj = req.body;
    console.log(!tempListJson);

    if(!tempListJson){   
        tempList.concat(tempObj);
        fs.writeFileSync('./dataconfig/templateList.json',JSON.stringify(tempList) , 'utf-8')    
    }else{
        if(!Array.isArray(tempList)){
          var a = ([].concat(tempList));
           fs.writeFileSync('./dataconfig/templateList.json',JSON.stringify(([].concat(tempList)).push(tempObj)) , 'utf-8')   
        }
        tempList = JSON.parse(tempListJson);
        console.log(tempList);
        tempList.push(tempObj);
        console.log(tempList);
        fs.writeFileSync('./dataconfig/templateList.json',JSON.stringify(tempList) , 'utf-8')     
  }
  res.render('index');

})
 
  module.exports = router;