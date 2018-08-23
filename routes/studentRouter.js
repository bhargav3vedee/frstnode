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
        
        var last_id;

        if(j.student.length>0)
        {
            last_id = j.student[j.student.length-1].id;
        }
        else
        {
            last_id = 0;
        }

        req.body.id = last_id+1;
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

router.get('/edit/:id', (req, res)=>{
    var d = fs.readFileSync('public/stud.json', 'utf8');
    var j = JSON.parse(d);
    
    var sid = req.params.id;
    var obj;

    for(var i=0; i<j.student.length; i++){
        if(j.student[i].id == sid)
        {
            obj = j.student[i];
            break;
        }
    }
    console.log(obj);
    res.render('edtStud', {data : obj, msg : ""});
});

router.post('/edit/:id', (req, res)=>{
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
        
        var sid = req.params.id;
        var obj;

        for(var i=0; i<j.student.length; i++){
            if(j.student[i].id == sid)
            {
                obj = i;
                break;
            }
        }

        j.student[i].name = req.body.name;
        j.student[i].age = req.body.age;

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

router.get('/delete/:id',(req, res)=>{
    var id = req.params.id;

    var d = fs.readFileSync('public/stud.json', 'utf8');
    var j = JSON.parse(d);
    
    var sid = req.params.id;
    var obj;

    for(var i=0; i<j.student.length; i++){
        if(j.student[i].id == sid)
        {
            obj = j.student[i];
            break;
        }
    }
    
    res.render('delStud', {data : obj});

});

router.post('/delete/:id', (req, res)=>{
    
    
        console.log("No Error");
        
        var d = fs.readFileSync('public/stud.json', 'utf8');
        var j = JSON.parse(d);
        
        var sid = req.params.id;
        var obj;

        for(var i=0; i<j.student.length; i++){
            if(j.student[i].id == sid)
            {
                obj = i;
                break;
            }
        }

        delete j.student[obj];

        var strjf = JSON.stringify(j);
        var reslt = strjf.replace('null,', '');
        reslt = reslt.replace(',null', '');
        reslt = reslt.replace('null', '');
        fs.writeFileSync('public/stud.json', reslt);
        res.redirect('/student');
    
});

router.use(function (req, res, next) {
    console.log("In Middleware");
    next();
});

module.exports = router;