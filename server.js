const express = require('express')
const app = express()


app.get('/gameoflife', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.use(express.static('./public'))
const port = 3000
app.listen(port, () => {
  console.log('listening on port ', port)
})
if(typeof module !== undefined){
  module.exports = {
    app: app,
  }
}
