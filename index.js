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
  owner: {type: mongoose.Types.ObjectId},
  createdAt: Date,
  updateAt: Date
})

const Kitten = mongoose.model('kitten', kittySchema)

const ownerSchema = new mongoose.Schema({
  name: String,
  kitten: {type: mongoose.Types.ObjectId},
  createdAt: Date,
  updateAt: Date
})

const Owner = mongoose.model('owner', ownerSchema)

async function ownerList() {
  await server()
  const ownerGetted = await Owner.find({}).populate({path: "kitten", model: "kitten"})
  return ownerGetted
}

async function createOwner (ownerName) {
  const owner = new Owner(
    {
      name: ownerName,
      kitten: null,
      createdAt: new Date, 
      updateAt: new Date 
    }
  )
  await owner.save()
}

async function createKitten (kittenName) {

  const kitten = new Kitten(
    {
     name: kittenName,
     age: 1,
     createdAt: new Date,
     updateAt: new Date 
    },
  )
  await kitten.save()
}

async function getOwner(Id) {
  await server()
  const getId = await Owner.findById(Id).populate({path: "kitten", model: "kitten"})
  return getId
}

async function getKitten(Id) {
  await server()
  const getId = await Kitten.findById(Id).populate({path: "owner", model: "owner"})
  return getId
}

async function createRelations(kittenId, ownerId) {
  await server()

  const addRelations = async () => {
    await Kitten.findByIdAndUpdate(kittenId, {owner: ownerId}, { 
      new: true,
    },)
    await Owner.findByIdAndUpdate(ownerId, {kitten: kittenId}, { 
      new: true,
    })
  }
  return await addRelations()
}

app.get('/news-api/v1/owners', async (req, res) => {
  res.status(200).json(await ownerList())
})

app.get('/news-api/v1/owner/:ownerId', async (req, res) => {
  const ownerId = req.params.ownerId
  res.status(200).json({ msg: await getOwner(ownerId)})
})

app.get('/news-api/v1/kitten/:kittenId', async (req, res) => {
  const kittenId = req.params.kittenId

  res.status(200).json({ msg: await getKitten(kittenId)})
})

app.post('/news-api/v1/kitten/create/:kittenName', async (req, res) => {
  const kittenName = req.params.kittenName

  res.status(201).json({msg: await createKitten(kittenName)})
})

app.post('/news-api/v1/owner/create/:ownerName', async (req, res) => {
  const ownerName = req.params.ownerName

  res.status(201).json({ msg: await createOwner(ownerName)})
})

app.post('/news-api/v1/kitten/addRelation/:ownerId/:kittenId', async (req, res) => {
  const ownerId = req.params.ownerId
  const kittenId = req.params.kittenId

  res.status(201).json(await createRelations(kittenId, ownerId))
})

app.listen(port, hostname, () => {
  console.log('Estou ouvindo!')
})