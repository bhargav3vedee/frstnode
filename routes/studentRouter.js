var express = require('express');
const router = express.Router();
var fs = require('fs');

router.get('/add', function (req, res) {
    res.render('addstud', {msg : "", data : ""});
});

router.post('/add', (req, res) => {
    req.checkBody("name", "Enter Name").notEmpty();
    req.checkBody('age', "Enter Number only").isNumeric();
    req.checkBody("age", "Enter Age").notEmpty();
    var errors = req.validationErrors();
    console.log(errors);

    if(!errors)
    {
        console.log("No Error");
        var d = fs.readFileSync('public/stud.json', 'utf8');
        var j = JSON.parse(d);
        j.student.push(req.body);
        fs.writeFileSync('public/stud.json', JSON.stringify(j));
        res.redirect('/student');
    }
    else
    {
        var msg = [];
        for(var i=0; i<errors.length; i++){
            msg[errors[i].param] = errors[i].msg;
        }
        console.log(msg);
        // console.log(result.error.details);

        res.render('addstud', {msg : msg, data : req.body});
    }

});

router.get('/', function (req, res) {


    var studData = '';

    if (!fs.existsSync('public/stud.json')) {
        fs.writeFile('public/stud.json', '', function (err) {
            if (err) {
                console.log(err);
            }
        });
    }
    else {
        var d = fs.readFileSync('public/stud.json', 'utf8');
        studData = d;
    }

    // res.send(studData);
    res.render('index', { sd: JSON.parse(studData) });
});

router.use(function (req, res, next) {
    console.log("In Middleware");
    next();
});

module.exports = router;