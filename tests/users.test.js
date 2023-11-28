const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

const helper = require('./test_helper')
const bcrypt = require('bcrypt')

beforeEach(async () => {
  await User.deleteMany({})
})

describe('4.16: Testing username and password restrictions', () => {
  test('posting a user without username', async () => {
    const response = await api
      .post('/api/users')
      .send({ name: "Caca Bouzet", password: "asdaid23234" })
      .expect(400)
    expect(response.text).toContain('error' && 'username')
  })
  test('posting a user without short username', async () => {
    const response = await api
      .post('/api/users')
      .send({ username: "ca", name: "Caca Bouzet", password: "asdaid23234" })
      .expect(400)
    expect(response.text).toContain('error' && 'username')
  })

  test('posting an existing user to test uniqueness', async () => {
    await api
      .post('/api/users')
      .send({ username: "cacabouzet", name: "Caca Bouzet", password: "asdaid23234" })
    
    const response = await api
      .post('/api/users')
      .send({ username: "cacabouzet", name: "Cacan Bouzoret", password: "32342343" })
      .expect(400)
    expect(response.text).toContain('error' && 'username' && 'unique')
  })
  
  test('posting a user without password', async () => {
    const response = await api
      .post('/api/users')
      .send({ username: "cacabouzet", name: "Caca Bouzet"})
      .expect(400)
    expect(response.text).toContain('error' && 'password')
  })
  
  test('posting a user with short password', async () => {
    const response = await api
      .post('/api/users')
      .send({ username: "cacabouzet", name: "Caca Bouzet" , password: "23"})
      .expect(400)
    expect(response.text).toContain('error' && 'password')
  })
})

afterAll(async() => {
  await mongoose.connection.close()
})