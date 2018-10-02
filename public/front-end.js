const defaultRandomFunc = () => {
  return Math.round(Math.random())
}
const World = function (nrRows, nrColumns, args) {
  args = args || {}
  const randomFunc = args.randomFunc !== undefined? args.randomFunc : defaultRandomFunc
  this.getNrRows = () => nrRows
  this.getNrColumns = () => nrColumns

  this.villages = []

  this.getFamilies = () => {
    return this.villages
  }

  this.tick = () => {
    const oldFamilies = this.getFamilies()
    const newFamilies = oldFamilies.map(family => {
      const nrDeadNeighbours = countDeadNeighbours(family, oldFamilies)
      const nrAliveNeighbours = countAliveNeighbours(family, oldFamilies)
      if(nrDeadNeighbours === 2){
        family.kill()
      }
      if(nrAliveNeighbours ===3 ){
        family.restore()
      }
      return family
    })
    const world = new World()
    world.setVillages(newFamilies)

    return world
  }
  this.countAliveFamilies = () => {
    const families = this.getFamilies()
    const nrDead = this.countDead()
    return families.length - nrDead
  }

  this.countDead = () => {
    const families = this.getFamilies()
    const allDeadFamilies = families.filter((family)=>{
      return family.areWeDead()
    })

    return allDeadFamilies.length
  }

  this.setVillages = (input) => {
    this.villages = input
  }

  this.spawnWorld = () => {
    const villages = []
    const nrRows = this.getNrRows()
    const nrColumns = this.getNrColumns()
    for(let i = 0; i<nrRows; i++){
      const rowVillages = []
      for(let j = 0; j < nrColumns; j++){
        const destiny = randomFunc() === 1? 'alive' : 'dead'
        const streetNumber = i
        const houseNumber = j
        villages.push(new Family(destiny, streetNumber, houseNumber))
      }
    }
    this.setVillages(villages)
  }
  this.getCurrentState = () => {

    return this.getFamilies()
  }
  this.visualizeInDom = (args) => {
    args = args || {}
    const document = args.document !== undefined? args.document : document
    const div = document.createElement('div')
    const families = this.getFamilies()
    families.forEach((family)=> {
      const style = family.areWeDead()? 'alive' : 'dead'
      const button = document.createElement('button')
      console.log('button', button)
      button.setAttribute('style', style)
      div.appendChild(button)
    })
    return div
  }

  this.spawnWorld()
}
const Family = function (livingCondition, streetNumber, houseNumber ) {
  this.streetNumber = streetNumber
  this.houseNumber = houseNumber
  if(livingCondition === 'dead'){
    this.isDead = true
  }
  else{
    this.isDead = false
  }

  this.areWeDead = () => {
    return this.isDead
  }
  this.kill = () => {
    this.isDead = true
  }
  this.restore = () => {
    this.isDead = false
  }
}

const isSame = (val1, val2) => {
  return val1 === val2
}
const isNextTo = (val1, val2) => {

  return Math.abs(val1 - val2) === 1
}

const getNeighbours = (family, families) => {
  return  families.filter(nextFamily => {
    const sameStreet = isSame(nextFamily.streetNumber, family.streetNumber)
    const streetNextTo = isNextTo(nextFamily.streetNumber, family.streetNumber) 
    const sameHouseNumber = isSame(nextFamily.houseNumber, family.houseNumber)
    const houseNextTo = isNextTo(nextFamily.houseNumber, family.houseNumber)

    // todo can we remove parenthesis?
    return (sameStreet && houseNextTo) || (streetNextTo && sameHouseNumber)
  })
  return neighbours
}
const countAliveNeighbours = (family, families) => {
  const neighbours = getNeighbours(family, families)
  return neighbours.filter(family=> !family.areWeDead()).length
}
const countDeadNeighbours = (family, families) => {
  const neighbours = getNeighbours(family, families)
  return neighbours.length - countAliveNeighbours(family, families)
}

module.exports = {
  World,
  __test__: {
    Family,
    countDeadNeighbours,
    countAliveNeighbours
  }
}
