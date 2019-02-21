const R = require('ramda');
var ArrBefor = [{
        column1: '',
        column2: 'DESCRIPTION',
        column3: 'AMOUNT'
    },
    {
        column1: 'I',
        column2: 'Trial period',
        column3: ''
    },
    {
        column1: '1',
        column2: 'Trial Salary (or before date review salary)',
        column3: '7,430,900'
    }
]
var num1 = ['I', 'II', 'III']
var num2 = ['1', '2', '3']
var ArrChange = [];

ArrBefor.forEach(function (element) {
    var ArrRam = []
    let bold1 = false,
        bold2 = false,
        bold3 = false;
    let italics1 = false,
        italics2 = false,
        italics3 = false;
    let f_color = '',
        f_color2 = '',
        f_color3 = '';

    if (R.includes(element.column1, num1)) {
        bold1 = true;
        bold2 = true;
        console.log(R.includes(element.column1, num1));
        console.log(element.column1);
        console.log(num1);
    }
    if (R.includes(element.column1, num2)) {
        italics1 = true
        italics2 = true;
        italics3 = true;
    }
    if (R.includes(element.column1, num2)) {
        italics1 = true
        italics2 = true;
        italics3 = true;
    }
    if (R.equals(ArrBefor[0], element)) {
        bold1 = true;
        bold2 = true;
        bold3 = true;
        f_color = '#7b7f82'
        f_color2 = '#7b7f82'
        f_color3 = '#7b7f82'
    }

    ArrRam = [{
        text: element.column1,
        bold: bold1,
        italics: italics1,
        color: 'black',
        fillColor: f_color
    }, {
        text: element.column2,
        bold: bold2,
        italics: italics2,
        color: 'black',
        fillColor: f_color2

    }, {
        text: element.column3,
        bold: bold3,
        italics: italics3,
        color: 'black',
        fillColor: f_color3

    }]
    // R.prepend(ArrRam,ArrChange);
    ArrChange = ArrChange.concat(R.append(ArrRam, []));
});
//console.log(ArrChange);

module.exports = ArrChange;