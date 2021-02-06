const { describe, it } = require('mocha')
const request = require('supertest')
const app = require('./api')
const assert = require('assert')

describe('API Suite test', () => {
  describe('/contact', () => {
    it('should request the contact page and return HTTP Status 200', async() => {
      const response = await request(app)
          .get('/contact')
          .expect(200)

      const expectedReturnText = 'contact us page';
      assert.deepStrictEqual(response.text, expectedReturnText);
    })
  })

  describe('/contact', () => {
    it('should request an inexistent route /hi and redirect to /hello', async() => {
      const response = await request(app)
          .get('/hi')
          .expect(200)

      const expectedReturnText = 'Hello World!';
      assert.deepStrictEqual(response.text, expectedReturnText);
    })
  })

  describe('/login', () => {
    it('should login successfully on the login route and return HTTP status 200', async() => {
      const response = await request(app)
          .post('/login')
          .send({username: 'LarissaPissurno', password: '123'})
          .expect(200)

      const expectedReturnText = 'Login has succeeded!';
      assert.deepStrictEqual(response.text, expectedReturnText);
    })

    it('should unauthorize a request when requesting it using wrong credentials', async() => {
      const response = await request(app)
          .post('/login')
          .send({username: 'LarissaPissurno', password: 'senhaErrada'})
          .expect(401)

      const expectedReturnText = 'Login has failed!';
      assert.deepStrictEqual(response.text, expectedReturnText);
      assert.deepStrictEqual(response.unauthorized, true);
    })
  })
})