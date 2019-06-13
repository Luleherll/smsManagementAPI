process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const {createInitialQuery} = require('../db');
const {dbConnection} = require('../config');
const {dropDB, createDbQuery} = require('../db/queries');


const should = chai.should();
chai.use(chaiHttp);

describe('User authentication', () => {
  beforeEach(async (done) => {
    await createInitialQuery(dbConnection, createDbQuery, 'createDb', 'test');
      done()       
  });

  afterEach(async (done) => {
    await createInitialQuery(dbConnection, dropDB, 'createDb', 'test');
      done()       
  });

describe('/POST signup', () => {
    it('should be successful', (done) => {
      // chai.request('http://localhost:3000/users')
      //     .post('/signup')
      //     .send({})
      //     .end((err, res) => {
      //           res.should.have.status(201);
      //           res.body.should.be.a('object');
      //           res.body.should.have.property('message');
      //       done();
      //     });
    });
});

describe('/POST signin', () => {
  it('should be successful', (done) => {
    // chai.request('http://localhost:3000/users')
    //     .post('/signin')
    //     .send({phoneNumber: 94949494, password: '474484'})
    //     .end((err, res) => {
    //       console.log(res);
    //           res.should.have.status(200);
    //           res.body.should.be.a('object');
    //           res.body.should.have.property('message');
    //       done();
    //     });
  });
});

});