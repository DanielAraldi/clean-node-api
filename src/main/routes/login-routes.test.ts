import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongodb-helper'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'

let accountCollection: Collection

describe('Login Routes', () => {
  beforeAll(async () => {
    // Before all tests connect to mongodb
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    // After all tests disconnect to mongodb
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({}) // Delete all register of the table
  })

  describe('POST /signup', () => {
    test('Should return 200 on signup', async () =>
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Daniel',
          email: 'daniel@gmail.com',
          password: '123',
          passwordConfirmation: '123'
        })
        .expect(200))
  })

  describe('POST /login', () => {
    test('Should return 200 on login', async () => {
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        name: 'Daniel',
        email: 'daniel@gmail.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'daniel@gmail.com',
          password: '123'
        })
        .expect(200)
    })

    test('Should return 401 on login', async () =>
      await request(app)
        .post('/api/login')
        .send({
          email: 'daniel@gmail.com',
          password: '123'
        })
        .expect(401))
  })
})
