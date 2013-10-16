var request = require('supertest')
  , express = require('express')
  , app = express()
  , routes = require('../config/routes')(app)


describe('GET /users', function(){
  it('respond with json', function(done){
    request(app)
      .get('/user')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  })
});