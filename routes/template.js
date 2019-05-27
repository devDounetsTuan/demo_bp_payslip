const express = require('express')
const router = express.Router()
const fs = require('fs')
let jsonData = {}

router.post('/', function (req, res, next) {
  jsonData = fs.readFileSync('./dataconfig/columnList.json', 'utf-8')
  console.log(JSON.parse(jsonData));
  res.render('template',{array:JSON.parse(jsonData)} );
  })
  
  module.exports = router