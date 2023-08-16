const { expect } = require('chai');
const request = require('supertest');
const { users, transaction } = require("./seed/seed")
const service = require("../services/users");
const server = require("../../single-server")
const transactionService = require("../services/transaction")

describe('POST /users/login', () => {
  it('Should login user and return auth token', (done) => {
    request(server)
      .post('/api/v1/user/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).to.not.be.null;
      })
      .end(async (err, res) => {
        if (err) return done(err);

        try {
          
          expect(res.body).to.have.property('data'); // Check if 'data' property exists
          const data = res.body.data; 
          expect(data.Authorization).to.exist
          done(); // Call done() once at the end
        } catch (err) {
          done(err); // Call done(err) if an error occurs
        }
      });
  }).timeout(10000)

  it('Should reject invalid login', (done) => {
    request(server)
      .post('/api/v1/user/login')
      .send({
        email: users[1].email,
        password: users[1].password + '1'
      })
      .expect(400)
      .end(async (err, res) => {
        if (err) return done(err);

        try {
          const user = await service.getUser(users[1]._id);
          expect(user).to.exist
          done(); 
        } catch (err) {
          done(err); 
        }
      });
  }).timeout(10000)
});


describe('POST /transaction', () => {
  it('should create a new transaction', (done) => {

    request(server)
      .post('/api/v1/transaction')
      .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGQ4NTM1OGQxNWRhZDYxMGMzYmE1NjQiLCJlbWFpbCI6InNodWJoYW1AZmxhZ3JpZ2h0LmNvbSIsImZ1bGxOYW1lIjoiU2h1YmhhbSBUaXdhcmkiLCJpYXQiOjE2OTIxOTc3MDMsImV4cCI6MTcyMzczMzcwM30.ktpBvk5VVBK4V2MYubpilrsW7YIQZBbWO8sJ5f1IXWo`)
      .send(transaction)
      .expect(200)
      .expect((res) => {
        expect(res.body).to.be.an('object');
      })
      .end( async (err, res) => {
        if(err) return done(err);

        try {
          expect(res.body).to.have.property('data'); // Check if 'data' property exists
          const data = res.body.data; 
          const responseTransaction = await transactionService.find({ID: data.ID});
          expect(responseTransaction).to.have.length(1)
          expect(responseTransaction[0].ID).to.be.string
          done(); 
        } catch (err) {
          done(err); 
        }
      });
  });

  it('should not create transaction with invaild data', (done) => {
    request(server)
      .post('/api/v1/transaction')
      .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGQ4NTM1OGQxNWRhZDYxMGMzYmE1NjQiLCJlbWFpbCI6InNodWJoYW1AZmxhZ3JpZ2h0LmNvbSIsImZ1bGxOYW1lIjoiU2h1YmhhbSBUaXdhcmkiLCJpYXQiOjE2OTIxOTc3MDMsImV4cCI6MTcyMzczMzcwM30.ktpBvk5VVBK4V2MYubpilrsW7YIQZBbWO8sJ5f1IXWo`)
      .send({})
      .expect(422)
      .end( async (err, res) => {
        if(err) return done(err);

        try {
          const responseTransaction = await transactionService.find({});
          expect(responseTransaction).to.have.lengthOf.above(1);
          done(); 
        } catch (err) {
          done(err); 
        }
        
      })
  });
});