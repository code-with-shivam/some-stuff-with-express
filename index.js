const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// this we have created a middle ware, and link it with a path to a folder named public
app.use(express.static(path.join(__dirname, "public")))

app.get('/', function (req, res) {
    // this is used to read a directory 
    fs.readdir(`./files`, function (err, files) {
        // this basically shows the index.ejs file on the url
        res.render("index", { files: files }) // we are sending this data from backend to frontend i.e index.ejs
    })
})

// we are creating this so we can read the data within the files
app.get('/file/:filename', function (req, res) {
    // if we do not put "utf-8" then data will be read in buffer and not english
    fs.readFile(`./files/${req.params.filename}`, "utf-8", function (err, filedata) {
        res.render('show', { filename: req.params.filename, filedata: filedata }) // this will show the data into a new page named show
    })
})

// we are editing the existing filename here
app.get('/edit/:filename', function (req, res) {
    res.render('edit', { filename: req.params.filename })
})

// saving the filename changes
app.post("/edit", function (req, res) {
    fs.rename(`./files/${req.body.previous}`, `./files/${req.body.new}`, function (err) {
        res.redirect("/");
    })
})


// when we will submit our form from frontend, the data will come to this route
app.post("/create", function (req, res) {
    // creating a file into the files folder of whatever title we get from the forn in the frontend
    // this means if the title has space then we are spliting them and crating the file name with no spaces
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.details, function (err) {
        res.redirect("/") // this means after the file is created, we will be back to the original "/" route from the "/create" route
    })
})


app.listen(3000)