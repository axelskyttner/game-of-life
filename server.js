const express = require('express')
const app = express()


app.get('/gameoflife', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.use(express.static('./public'))
// const port = 80
// app.listen(port, () => {
//   console.log('listening on port ', port)
// })

module.exports = {
  app: app,
}
