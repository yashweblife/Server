const express = require('express');
const fs = require('fs');
const path = require('path')
const port = 3000
const app = express();
const parser = require('body-parser')
app.use(express.static(path.join(__dirname, 'public')))
app.use(parser.json())

app.get('/',(req,res)=>{
    res.sendFile('index.html');
})
app.post('/login_check',(req, res)=>{
    console.log(res.body);
})
app.get('/home',(req, res)=>{
    res.sendFile(path.join(__dirname,'public/home.html'))
})

app.post('/add_item',(req, res)=>{
    const data = JSON.parse(fs.readFileSync('todo.json','utf8'));
    data.push(req.body)
    console.log("Add Data: ", data);
    fs.writeFileSync('todo.json', JSON.stringify(data))
    res.end();
})

app.post('/remove_item', (req, res)=>{
    const data = req.body;
    console.log("Remove Data: ",data);
    const file = JSON.parse(fs.readFileSync('todo.json','utf8'))
    const todo = file.find((val)=>val.id==data.id)
    const todos = file.filter((val)=>val.id!= data.id);
    fs.writeFileSync('todo.json', JSON.stringify(todos))
    console.log("REMOVE: ", todo)
    res.end();
})

app.get('/get_todo_data',(req,res)=>{
    const data= JSON.stringify(fs.readFileSync('todo.json','utf8'))
    res.json(data);
})

app.post('/toggle_todo_complete',(req, res)=>{
    const data = req.body;
    const file = JSON.parse(fs.readFileSync('todo.json','utf8'))
    const todo = file.find((val)=>val.id==data.id)
    todo.completed = data.completed;
    console.log("TOGGLE: ", todo)
    console.log(file)
    fs.writeFileSync('todo.json', JSON.stringify(file));
    res.end();
})

app.listen(port, ()=>{
    console.log("Started Serving at Port: ", port)
})