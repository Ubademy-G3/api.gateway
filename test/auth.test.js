const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const supertest = require("supertest");
const app = require("../app");

const mock = new MockAdapter(axios);

const getDate = (offset) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString();
};

const authResponseOk = { message: "User created successfully" };
const fakeLogUser = {
  email: "test@email.com",
  password: "pwd123",
};

const fakeAuthUser = {
  id: "00000000-feed-0000-0000-c0ffee000000",
  email: "test@email.com",
  password: "HASHEDPASSWORD",
  token: "TOKEN",
};

const fakeUser = [{
  id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  email: "string",
  firstName: "string",
  lastName: "string",
  rol: "string",
  location: "string",
  interests: [
    "string",
  ],
  profilePictureUrl: "string",
  subscription: "free",
  subscriptionExpirationDate: getDate(20),
  favoriteCourses: [
    "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  ],
  description: [
    "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  ],
}];

const fakeLoggedUser = {
  token: "TOKEN",
  id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  firstName: "string",
  lastName: "string",
  rol: "string",
  subscriptionState: "active",
};

const fakeLoggedUserExpiredSubscription = {
  token: "TOKEN",
  id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  firstName: "string",
  lastName: "string",
  rol: "string",
  subscriptionState: "expired",
};

const fakeLoggedUserAboutToExpireSubscription = {
  token: "TOKEN",
  id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  firstName: "string",
  lastName: "string",
  rol: "string",
  subscriptionState: "about_to_expire",
};

const fakeUserExpiredSubscription = [{
  id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  email: "string",
  firstName: "string",
  lastName: "string",
  rol: "string",
  location: "string",
  interests: [
    "string",
  ],
  profilePictureUrl: "string",
  subscription: "gold",
  subscriptionExpirationDate: getDate(-1),
  favoriteCourses: [
    "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  ],
  description: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
}];

const fakeUserAboutToExpireSubscription = [{
  id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  email: "string",
  firstName: "string",
  lastName: "string",
  rol: "string",
  location: "string",
  interests: [
    "string",
  ],
  profilePictureUrl: "string",
  subscription: "gold",
  subscriptionExpirationDate: getDate(2),
  favoriteCourses: [
    "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  ],
  description: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
}];

const fakeInvalidUser = {
  email: "test@email.com",
};

const badRequestResponse = { response: { status: 400, data: "Bad request" } };

const request = supertest(app);

describe("authController", () => {
  test("valid sign up should return success code 200", async () => {
    mock.onPost(`${process.env.AUTH_SERVICE_URL}/authorization`).reply(200);
    mock.onPost(`${process.env.USERS_SERVICE_URL}/users`).reply(200);
    mock.onGet(`${process.env.ADMIN_SERVICE_URL}/name/?name_list=auth&name_list=users`).reply(200, { data: { microservices: [ { state: "active", apikey: "asd" } , { state: "active", apikey: "asd" } ] } });
    await request.post("/authorization").send(fakeLogUser).expect(200, authResponseOk);
  });

  test("invalid credentials sign up should return bad request code 400", async () => {
    mock.onPost(`${process.env.AUTH_SERVICE_URL}/authorization`).reply(400, badRequestResponse);
    mock.onGet(`${process.env.ADMIN_SERVICE_URL}/name/?name_list=auth&name_list=users`).reply(200, { data: { microservices: [ { state: "active", apikey: "asd" } , { state: "active", apikey: "asd" } ] } });
    await request.post("/authorization").send(fakeInvalidUser).expect(400);
  });

  test("unexpected error sign up should return code 500", async () => {
    mock.onPost(`${process.env.AUTH_SERVICE_URL}/authorization`).reply(500);
    mock.onGet(`${process.env.ADMIN_SERVICE_URL}/name/?name_list=auth&name_list=users`).reply(200, { data: { microservices: [ { state: "active", apikey: "asd" } , { state: "active", apikey: "asd" } ] } });
    await request.post("/authorization").send(fakeLogUser).expect(500);
  });

  test("valid login should return success code 200 and user information on success", async () => {
    mock.onPost(`${process.env.AUTH_SERVICE_URL}/authentication`).reply(200, fakeAuthUser);
    mock.onGet(`${process.env.USERS_SERVICE_URL}/users`).reply(200, fakeUser);
    mock.onGet(`${process.env.ADMIN_SERVICE_URL}/name/?name_list=auth&name_list=users`).reply(200, { data: { microservices: [ { state: "active", apikey: "asd" } , { state: "active", apikey: "asd" } ] } });
    await request.post("/authentication").send(fakeLogUser).expect(200, fakeLoggedUser);
  });

  test("login by user with about to expire subscription should update about_to_expire state", async () => {
    mock.onPost(`${process.env.AUTH_SERVICE_URL}/authentication`).reply(200, fakeAuthUser);
    mock.onGet(`${process.env.USERS_SERVICE_URL}/users`).reply(200, fakeUserAboutToExpireSubscription);
    mock.onGet(`${process.env.ADMIN_SERVICE_URL}/name/?name_list=auth&name_list=users`).reply(200, { data: { microservices: [ { state: "active", apikey: "asd" } , { state: "active", apikey: "asd" } ] } });
    await request.post("/authentication").send(fakeLogUser).expect(200, fakeLoggedUserAboutToExpireSubscription);
  });

  test("login by user with expired subscription should return expired state and change subscription to Free", async () => {
    mock.onPost(`${process.env.AUTH_SERVICE_URL}/authentication`).reply(200, fakeAuthUser);
    mock.onGet(`${process.env.USERS_SERVICE_URL}/users`).reply(200, fakeUserExpiredSubscription);
    mock.onPatch(`${process.env.USERS_SERVICE_URL}/users/${fakeUserExpiredSubscription[0].id}`).reply(200);
    mock.onGet(`${process.env.ADMIN_SERVICE_URL}/name/?name_list=auth&name_list=users`).reply(200, { data: { microservices: [ { state: "active", apikey: "asd" } , { state: "active", apikey: "asd" } ] } });
    await request.post("/authentication").send(fakeLogUser).expect(200, fakeLoggedUserExpiredSubscription);
  });

  test("invalid credentials login should return bad request code 400", async () => {
    mock.onPost(`${process.env.AUTH_SERVICE_URL}/authentication`).reply(400, badRequestResponse);
    mock.onGet(`${process.env.ADMIN_SERVICE_URL}/name/?name_list=auth&name_list=users`).reply(200, { data: { microservices: [ { state: "active", apikey: "asd" } , { state: "active", apikey: "asd" } ] } });
    await request.post("/authentication").send(fakeInvalidUser).expect(400);
  });

  test("unexpected error login should return code 500", async () => {
    mock.onPost(`${process.env.AUTH_SERVICE_URL}/authentication`).reply(500);
    mock.onGet(`${process.env.ADMIN_SERVICE_URL}/name/?name_list=auth&name_list=users`).reply(200, { data: { microservices: [ { state: "active", apikey: "asd" } , { state: "active", apikey: "asd" } ] } });
    await request.post("/authentication").send(fakeLogUser).expect(500);
  });

  test("valid password reset should return success code 200 and user information on success", async () => {
    mock.onPost(`${process.env.AUTH_SERVICE_URL}/authentication/password`).reply(200);
    mock.onGet(`${process.env.ADMIN_SERVICE_URL}/name/auth`).reply(200, { state: "active", apikey: "asd" });
    await request.post("/authentication/password").send({ email: fakeLogUser.email }).expect(200);
  });

  test("invalid email password reset should return bad request code 400", async () => {
    mock.onPost(`${process.env.AUTH_SERVICE_URL}/authentication/password`).reply(400, badRequestResponse);
    mock.onGet(`${process.env.ADMIN_SERVICE_URL}/name/auth`).reply(200, { state: "active", apikey: "asd" });
    await request.post("/authentication/password").send(fakeInvalidUser).expect(400);
  });

  test("unexpected error password reset should return code 500", async () => {
    mock.onPost(`${process.env.AUTH_SERVICE_URL}/authentication/password`).reply(500);
    mock.onGet(`${process.env.ADMIN_SERVICE_URL}/name/auth`).reply(200, { state: "active", apikey: "asd" });
    await request.post("/authentication/password").send(fakeLogUser).expect(500);
  });
});
