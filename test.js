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

  it('should create a board from a World', () => {
    const nrRows = 3
    const nrColumns = 4
    const world = new frontEnd.World(nrRows, nrColumns)
    const htmlStub = function () {
      this.appendChild = (element) => {
        this.components.push(element)
      },
      this.components = []
    }

    const createElement = sinon.fake.returns(new htmlStub())
    const document = {
      createElement
    }
    // const div = document.createElement('div')
    const resultDiv = world.visualizeInDom({document})
    expect(resultDiv.components.length).to.equal(nrRows*nrColumns)
  })
  it('should be able to print the state in a list', () => {
    const nrRows = 3
    const nrColumns = 3
    const world = new frontEnd.World(nrRows, nrColumns)

    const currentState = world.getCurrentState()
    expect(currentState.length).to.equal(nrRows)
    expect(currentState[0].length).to.equal(nrColumns)
  })


})

describe('Spawing a random world', () => {
  it('if all is zero then all villages spawn dead', () => {
      const nrRows = 3
      const nrColumns = 3
      const world = new frontEnd.World(nrRows, nrColumns)
      const villages = world.getVillages()

      villages.forEach(street => {
        street.forEach(house=> {
          expect(house.isDead()).to.equal(true)
        })

      });

  })
})

describe('test of village', () => {
  it('should be dead or alive', () => {
    const deadVillage = new frontEnd.Village('dead')
    const aliveVillage = new frontEnd.Village('alive')

    expect(deadVillage.areWeDead()).to.equal(true)
    expect(aliveVillage.areWeDead()).to.equal(false)
  })
})
