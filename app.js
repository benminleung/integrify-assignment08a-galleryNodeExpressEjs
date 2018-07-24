const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser')

const os = require('os');

const data = require('./src/photosInfo.json');

const port = process.env.PORT || 8080;

data.forEach(profile => {
    profile.id = createId(profile);
})

// console.log('rawData: ' , rawData)
// const data = require('./src/photosInfo').photosInfo;

// const data = rawData.map(profile => {
//     const newProfile = profile;
//     newProfile.id = (newProfile.firstName + newProfile.lastName).replace(/[^\w]/g, '').toLowerCase();
//     return newProfile;
// })


const ipAddress = (() => {
    let ad = ''
    Object.keys(os.networkInterfaces()).forEach(key => {
        os.networkInterfaces()[key].forEach(item => {
            if(item.family === 'IPv4' && !item.internal){
                ad = item.address
            }
        })
    })
    return ad
})()

const nav = {
    images: '/images/',
    defaultImg: '/default-user-image.jpg',
    home: '/',
    student: '/student/',
    api: '/api/',
    addStudent: '/addStudent',
}

const formTemp = {
    firstName: 'Firstname',
    lastName: 'Lastname',
    title: 'Title',
    nationality: 'Nationality',
    skills: 'Skills',
    whySofterDeveloper: 'Why software development?',
    longTermVision: 'What is your goal in the long run?',
    motivatesMe: 'What motivates you?',
    favoriteQuote: "What's your favorite quote?",
    joinedOn: 'When did you join Integrify?',
}

function createId (profile){
    return (profile.firstName + profile.lastName).replace(/[^\w]/g, '').toLowerCase();
}

server = express();

server.set('view engine', 'ejs');
//telling express that we are using ejs as view engine

server.use(express.static("views"));
//we are giving the path for view folder so that we don't have ot use __dirname + '/views/index.html'
server.use(express.static("src"));
server.use(express.static("css"));

server.use(bodyParser.urlencoded({ extended: false }))

server.get('/', (req,res) => {
    res.render('index', {
        data: data,
        nav,
    });
})

server.get(nav.student + ':id', (req,res) => {
    let flag = false;
    const student = data.find(student => student.id === req.params.id);
    if (student) {
        res.render('profile', {
            student: student,
            nav,
            formTemp,
        });
        flage = true;
    }
    !flag && res.send(`Student not found.`);
    // res.render('profile', {data: data});
})

server.get(nav.api + ':id', (req,res) => {
    let flag = false;
    const student = data.find(student => student.id === req.params.id);
    if (student) {
        res.json(student);
        flage = true;
    }
    !flag && res.send(`Student JSON not found.`);
})

server.get(nav.api, (req,res) => {
    res.json(data);
})

server.get(nav.addStudent, (req,res) => {
    res.render('addStudent', {
        oneData: data[0],
        formTemp,
        nav,
    });
})

server.post(nav.addStudent, (req,res) => {
    console.log('POOOOST');
    console.log(req.body);
    const newStudent = Object.assign(req.body);
    newStudent.id = createId(newStudent);
    newStudent.src = '';
    newStudent.alt = newStudent.firstName;
    newStudent.skills = [req.body.skills];
    data.push(newStudent);
    res.send('New student added.')
})

server.listen(8080, ()=>{
    console.log(`Server is running on 8080 at ip:${ipAddress}`);
});