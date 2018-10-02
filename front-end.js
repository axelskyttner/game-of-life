
const World = function (nrRows, nrColumns) {
  this.getNrRows = () => nrRows
  this.getNrColumns = () => nrColumns
  this.villages = []
  this.getVillages = () => {
    return this.villages
  }
  this.setVillages = (input) => {
    this.villages = input
  }
  this.init = () => {
    const villages = []
    const nrRows = this.getNrRows()
    const nrColumns = this.getNrColumns()
    for(let i = 0; i<nrRows; i++){
      const rowVillages = []
      for(let j = 0; j < nrColumns; j++){
        rowVillages.push(new Village('dead'))
      }
      villages.push(rowVillages)
    }
    this.setVillages(villages)
  }
  this.getCurrentState = () => {

    return this.getVillages()
  }
  this.visualizeInDom = (args) => {
    args = args || {}
    const document = args.document !== undefined? args.document : document
    const div = document.createElement('div')
    const villages = this.getVillages()
    villages.forEach((villageStreet)=> {
      villageStreet.forEach(()=> {

        const button = document.createElement('button')
        div.appendChild(button)
      })
    })
    return div
  }

  this.init()
}
const Village = function (livingCondition) {
  if(livingCondition === 'dead'){
    this.isDead = true
    }
    else{
      this.isDead = false
    }

  this.areWeDead = () => {
    return this.isDead
  }
}




module.exports = {
  Village,
  World
}
