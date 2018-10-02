const expect = require('chai').expect
const request = require('supertest')
const product = require('./server')
const sinon = require('sinon')
const assert = require('assert')

const frontEnd = require('./public/front-end')
describe('server ', () => {
  it('should return index.html', (done)=> {
    request(product.app)
      .get('/gameoflife')
      .expect((res)=>{

        // todo uply fetching..
        const bodyString = res.res.text
        expect(bodyString).to.contain('html')
        done()
      })
      .catch(err=>{done(err)})
  })
})


describe('test of drawBoard', () => {
/*
  it('should create a board from a World', () => {
    const nrRows = 3
    const nrColumns = 4
    const world = new frontEnd.World(nrRows, nrColumns)
    const htmlStub = function () {
      this.appendChild = (element) => {
        this.components.push(element)
      },
        this.components = []
      this.setAttribute = (type, value) => {
        this.style = value
      }
    }

    const createElement = sinon.fake.returns(new htmlStub())
    const document = {
      createElement
    }
    const resultDiv = world.visualizeInDom({document})
    expect(resultDiv.components.length).to.equal(nrRows*nrColumns)
  }) */
  it('should have different css depending if its alive or not', () => {
    const htmlStub = function () {
      this.appendChild = (element) => {
        this.components.push(element)
      },
      this.children = () => this.components
      this.getClass = () => {
        return this.style
      }
      this.setAttribute = (type, value) => {
        this.style = value
      }
      this.components = []
      this.style = ''
    }

    const createElement = () => {
      return new htmlStub()
    }
    const document = {
      createElement
    }
    const nrRows = 3
    const nrColumns = 4
    const world = new frontEnd.World(nrRows, nrColumns)
    const resultDiv = world.visualizeInDom({document})
    const childrens = resultDiv.children()
    console.log('childrens style', childrens.map(a=>a.style))
    const nrFamiliesAlive = world.countAliveFamilies()
    const nrChildrenAlive = childrens.filter(element => {
      return element.getClass()  === 'dead'
    }).length
    expect(nrChildrenAlive).to.equal(nrFamiliesAlive)
  })
  it('should be able to print the state in a list', () => {
    const nrRows = 3
    const nrColumns = 3
    const world = new frontEnd.World(nrRows, nrColumns)

    const currentState = world.getCurrentState()
    expect(currentState.length).to.equal(nrRows * nrColumns)
  })
  it('every tick should kill and spawn families', () => {
    const nrRows = 3
    const nrColumns = 3
    const world = new frontEnd.World(nrRows, nrColumns)
    const nrDeadBefore = world.countDead()
    const newWorld = world.tick()
    const nrDeadAfter = newWorld.countDead()

    expect(nrDeadAfter).to.not.equal(nrDeadBefore)
  })
})

describe('Spawing a random world', () => {
  it('if all is zero then all villages spawn dead', () => {
    const nrRows = 3
    const nrColumns = 3
    const randomFunc = () => 0
    const world = new frontEnd.World(nrRows, nrColumns, {randomFunc})
    const families = world.getFamilies()

    families.forEach(family => {
      expect(family.areWeDead()).to.equal(true)
    });
  })
  it('if all is one then all villages spawn dead', () => {
    const nrRows = 3
    const nrColumns = 3
    const randomFunc = () => 1
    const world = new frontEnd.World(nrRows, nrColumns, {randomFunc})
    const families = world.getFamilies()

    families.forEach(house => {
      expect(house.areWeDead()).to.equal(false)
    });
  })

})

describe('test of Family', () => {
  it('should be dead or alive', () => {
    const deadFamily = new frontEnd.__test__.Family('dead')
    const aliveFamily = new frontEnd.__test__.Family('alive')

    expect(deadFamily.areWeDead()).to.equal(true)
    expect(aliveFamily.areWeDead()).to.equal(false)
  })
})

describe('help functions', () => {
  const Family = frontEnd.__test__.Family
  it('should be there to help finding neighbours', () => {
    const street1 = 1
    const house1 = 1
    const street2 = 2
    const street3 = 3
    const house2 = 2
    const house3 = 3
    const familyList = [
      new Family('dead', street1, house1),
      new Family('alive', street1, house3),
      new Family('alive', street3, house2),
      new Family('dead', street2, house2),
    ]
    const theFamily = new Family('dead', street1, house2)
    const nrDeadNeighbours = frontEnd.__test__.countDeadNeighbours(theFamily, familyList)
    const nrAliveNeighbours = frontEnd.__test__.countAliveNeighbours(theFamily, familyList)
    expect(nrDeadNeighbours).to.equal(2)
    expect(nrAliveNeighbours).to.equal(1)
    

  })

})
