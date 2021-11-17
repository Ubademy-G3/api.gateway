var axios = require('axios');
var MockAdapter = require("axios-mock-adapter");
const supertest = require('supertest');
const app = require('../app');
const mock = new MockAdapter(axios);

const authResponseOk = { message: "User created successfully" };
const fakeLogUser = {
  email: 'test@email.com',
  password: 'pwd123'
}

const fakeAuthUser = {
  id: '00000000-feed-0000-0000-c0ffee000000',
  email: 'test@email.com',
  password: 'HASHEDPASSWORD',
  token: 'TOKEN'
}

const fakeUser = [{
  id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  email: "string",
  firstName: "string",
  lastName: "string",
  rol: "string",
  location: "string",
  interests: [
    "string"
  ],
  profilePictureUrl: "string",
  subscription: "string",
  subscriptionExpirationDate: "2021-11-17T00:21:26.828Z",
  favoriteCourses: [
    "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  ],
  description: [
    "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  ]
}]

const fakeLoggedUser = {
  token: 'TOKEN',
  id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  firstName: "string",
  lastName: "string",
  rol: "string"
}

const fakeInvalidUser = {
  email: "test@email.com"
}

const badRequestResponse = { response: {status: 400, data: "Bad request"}}

request = supertest(app);

describe('authController', () => {
    test
    ('valid sign up should return success code 200', async () => {
      mock.onPost(`${process.env.AUTH_SERVICE_URL}/authorization`, fakeLogUser).reply(200);
      mock.onPost(`${process.env.USERS_SERVICE_URL}/users`, fakeLogUser).reply(200);
      await request.post('/authorization').send(fakeLogUser).expect(200, authResponseOk);
    })
    test('invalid credentials sign up should return bad request code 400', async () => {
      mock.onPost(`${process.env.AUTH_SERVICE_URL}/authorization`, fakeInvalidUser).reply(400, badRequestResponse);
      await request.post('/authorization').send(fakeInvalidUser).expect(400);
    })
    test('unexpected error sign up should return code 500', async () => {
      mock.onPost(`${process.env.AUTH_SERVICE_URL}/authorization`, fakeLogUser).reply(500);
      await request.post('/authorization').send(fakeLogUser).expect(500);
    })
    test('valid login should return success code 200 and user information on success', async() => {
      mock.onPost(`${process.env.AUTH_SERVICE_URL}/authentication`, fakeLogUser).reply(200, fakeAuthUser);
      mock.onGet(`${process.env.USERS_SERVICE_URL}/users`, fakeLogUser).reply(200, fakeUser);
      await request.post('/authentication').send(fakeLogUser).expect(200, fakeLoggedUser);
    })
    test('invalid credentials login should return bad request code 400', async () => {
      mock.onPost(`${process.env.AUTH_SERVICE_URL}/authentication`, fakeInvalidUser).reply(400, badRequestResponse);
      await request.post('/authentication').send(fakeInvalidUser).expect(400);
    })
    test('unexpected error login should return code 500', async () => {
      mock.onPost(`${process.env.AUTH_SERVICE_URL}/authentication`, fakeLogUser).reply(500);
      await request.post('/authentication').send(fakeLogUser).expect(500);
    })
    test('valid password reset should return success code 200 and user information on success', async() => {
      mock.onPost(`${process.env.AUTH_SERVICE_URL}/authentication/password`, { email: fakeLogUser.email }).reply(200);
      await request.post('/authentication/password').send({ email: fakeLogUser.email }).expect(200);
    })
    test('invalid email password reset should return bad request code 400', async () => {
      mock.onPost(`${process.env.AUTH_SERVICE_URL}/authentication/password`, fakeInvalidUser).reply(400, badRequestResponse);
      await request.post('/authentication/password').send(fakeInvalidUser).expect(400);
    })
    test('unexpected error password reset should return code 500', async () => {
      mock.onPost(`${process.env.AUTH_SERVICE_URL}/authentication/password`, fakeLogUser).reply(500);
      await request.post('/authentication/password').send(fakeLogUser).expect(500);
    })
})


