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
      return tickFamily(family, oldFamilies)
    })
    const world = new World()
    world.setFamilies(newFamilies)

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

  this.setFamilies = (input) => {
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
    this.setFamilies(villages)
  }
  this.getCurrentState = () => {

    return this.getFamilies()
  }
  this.visualizeInDom = (args) => {
    args = args || {}
    const domDocument = args.document !== undefined? args.document : document
    const div = domDocument.createElement('div')
    const families = this.getFamilies()
    families.forEach((family)=> {
      element = family.toDomElement()
      div.appendChild(element)
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
  this.getClassName = () => {
    return this.areWeDead()? 'dead' : 'alive'
  }
  this.clone = () => {
    const livingCondition = this.isDead? 'dead' : 'alive'
    const streetNumber = this.streetNumber
    const houseNumber = this.houseNumber
    return new Family(livingCondition, streetNumber, houseNumber)

  }

  this.toDomElement = () => {
    const street = this.streetNumber
    const houseNumber = this.houseNumber
    const className = this.getClassName()
    const button = document.createElement('button')
    button.innerHTML = className
    button.setAttribute('class', className)
    button.setAttribute('style', 
      `position: absolute; left: ${street*50}px; top: ${houseNumber*50}px`)
    return button
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
    return (sameStreet && houseNextTo) 
      || (streetNextTo && sameHouseNumber)
      || (streetNextTo && houseNextTo)
  })
}
const countAliveNeighbours = (family, families) => {
  const neighbours = getNeighbours(family, families)
  return neighbours.filter(family=> !family.areWeDead()).length
}

const tickFamily = (family, families) => {

  const nrDeadNeighbours = countDeadNeighbours(family, families)
  const nrAliveNeighbours = countAliveNeighbours(family, families)
  const newFamily = family.clone()
  if(!family.areWeDead() && nrAliveNeighbours < 2 ||
    !family.areWeDead() && nrAliveNeighbours > 3){
    newFamily.kill()
  }
  else if(family.areWeDead() && nrAliveNeighbours ===3 ){
    newFamily.restore()
  }
  return newFamily

}
const countDeadNeighbours = (family, families) => {
  const neighbours = getNeighbours(family, families)
  return neighbours.length - countAliveNeighbours(family, families)
}
if(typeof module !== 'undefined'){
  module.exports = {
    World,
    __test__: {
      Family,
      countDeadNeighbours,
      countAliveNeighbours
    }
  }

}
