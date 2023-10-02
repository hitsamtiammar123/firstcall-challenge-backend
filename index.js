const express = require('express')
const fs = require('fs')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()

const port = process.env.PORT || 3001
let DATA = [];

function fetchData(){
  const check = fs.existsSync('./data.json');
  if(check){
    const content = fs.readFileSync('./data.json', 'utf-8')
    DATA = JSON.parse(content);

  }else{
    const initData = [
      {
        "id": "483048903284",
        "username" :"hitsam",
        "firstname": "Tiammar"
      }
    ]

    fs.writeFileSync('./data.json', JSON.stringify(initData))
    DATA = initData
  }

}

function writeData(){
  console.log('written file', {d: JSON.stringify(DATA)})
  fs.writeFileSync('./data.json', JSON.stringify(DATA))
}

app.use(express.json())
app.use(cors())
app.use(bodyParser.json())

app.use((req, res, next) => {
  console.log('go in middleware')
  fetchData();
  next()
})

app.get('/', (req, res, next) => {
  try{
    const id = req.query.id;

    if(id){
      const data = DATA.find((item) => item.id === id)
      if(!data){
        return res.status(404).json({ status: 404, message: 'Data not found' })
      }
      return res.status(200).json({ status: 200, data })
    }
    return res.status(200).json({ status: 200, data: DATA })
  }catch(e){
    console.log('An erro occured on GET', { e })
    return next(e)
  }
})

app.post('/', (req,res) => {
  try{
    const body = req.body;
    console.log({ body })

    DATA.push({
      id: new Date().getTime().toString(),
      firstname: body.firstname,
      username: body.username,
      lastname: body.lastname
    })
    writeData()
    return res.status(200).json({ status: 200, message: 'new Data Added' })
  }catch(e){
    return next(e)
  }
})

app.put('/', (req,res) => {
  try{
    const body = req.body

    const id = body.id
    const searchedData = DATA.find((item) => item.id === id);
    if(searchedData){
      searchedData.firstname = body.firstname;
      searchedData.lastname = body.lastname;
      writeData()
      return res.status(200).json({ status: 200, message: 'Data has been updated' })
    }else{
      return res.status(404).json({ status: 404, message: 'Data not found' })
    }
  }catch(e){
    return next(e)
  }
})

app.delete('/', (req,res) => {
  try{
    const body = req.body

    const id = body.id;

    if(DATA.findIndex((item) => item.id === id) !== -1){
      DATA = DATA.filter((item) => item.id !== id)
      writeData()
      return res.json({ status: 200, message: 'Data has been deleted'  })
    }else{
      return res.status(404).json({ status: 404, message: 'Data not found'  })
    }
  }catch(e){
    return next(e)
  }
})

app.use((err, req, res, next) => {
  console.log('An server error occured on GET', { e })
  return res.status(500).json({ status: 500, message: 'An error occured ', error: e })
})

app.listen(port, () => {
  console.log(`Api listening  on port ${port}`)
})
