const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 3333
const hostname = '127.0.0.1'

async function server() {
  let connectionString = 'mongodb+srv://agendamentos:agendamentos@cluster0.2g19ap7.mongodb.net/?retryWrites=true&w=majority'
  await mongoose.connect(connectionString)
}

const kittySchema = new mongoose.Schema({
  name: String,
  age: Number,
  color: String,
  createdAt: Date,
  updateAt: Date
})

const Kitten = mongoose.model('Kitten', kittySchema)

async function catList() {
  await server()
  const kittenGetted = await Kitten.find({})
  return kittenGetted
}

async function createCat (name, age, color) {

  const cat = new Kitten(
    {
     name: name,
     age: age,
     color: color, 
     createdAt: new Date, 
     updateAt: new Date 
    }
  )
  await cat.save()
}

app.get('/news-api/v1/kittens', async (req, res) => {
  res.json(await catList().catch(err => console.log(err)))
})

app.post('/news-api/v1/kitten/create/:name/:age/:color', async (req, res) => {
  const name = req.params.name
  const age = req.params.age
  const color = req.params.color
  res.status(201).json(await createCat(name, age, color))
})

app.listen(port, hostname, () => {
  console.log('Estou ouvindo!')
})