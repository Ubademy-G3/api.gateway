const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const supertest = require("supertest");
const app = require("../app");

const mock = new MockAdapter(axios);

const microservicePostBody = {
  name: "hola",
  apikey: "asd"
};

const microserviceBody = {
  id: "76965938-55ca-42b9-8244-977152d2e593",
  name: "hola",
  apikey: "asd",
  state: "active",
  description: "Non descriptive text"
};

const microserviceList = {
  amount: 1,
  microservices: {
    id: "76965938-55ca-42b9-8244-977152d2e593",
    name: "hola",
    apikey: "asd",
    state: "active",
    description: "Non descriptive text"
  }
};

const badRequestResponse = { response: { status: 400, data: "Bad request" } };


const request = supertest(app);

describe("adminController", () => {
    test("valid microservice creation should return success code 200", async () => {
      mock.onPost(`${process.env.AUTH_SERVICE_URL}/authorization`).reply(200);
      mock.onPost(`${process.env.ADMIN_SERVICE_URL}/microservices/`).reply(200, microserviceBody);
      await request.post(`/microservices/`).send(microservicePostBody).expect(200, microserviceBody);
    });

    test("invalid microservice creation should return success code 400", async () => {
      mock.onPost(`${process.env.AUTH_SERVICE_URL}/authorization`).reply(200);
      mock.onPost(`${process.env.ADMIN_SERVICE_URL}/microservices/`).reply(400, badRequestResponse);
      await request.post(`/microservices/`).send(microservicePostBody).expect(400, badRequestResponse);
    });

    test("valid get microservice should return success code 200", async () => {
      mock.onPost(`${process.env.AUTH_SERVICE_URL}/authorization`).reply(200);
      mock.onGet(`${process.env.ADMIN_SERVICE_URL}/microservices/${microserviceBody.id}`).reply(200, microserviceBody);
      await request.get(`/microservices/${microserviceBody.id}`).expect(200, microserviceBody);
    });

    test("invalid get microservice should return success code 400", async () => {
      mock.onPost(`${process.env.AUTH_SERVICE_URL}/authorization`).reply(200);
      mock.onGet(`${process.env.ADMIN_SERVICE_URL}/microservices/${microserviceBody.id}`).reply(400, badRequestResponse);
      await request.get(`/microservices/${microserviceBody.id}`).expect(400, badRequestResponse);
    });

    test("valid patch microservice should return success code 200", async () => {
      mock.onPost(`${process.env.AUTH_SERVICE_URL}/authorization`).reply(200);
      mock.onPatch(`${process.env.ADMIN_SERVICE_URL}/microservices/${microserviceBody.id}`).reply(200, microserviceBody);
      await request.patch(`/microservices/${microserviceBody.id}`).send(microservicePostBody).expect(200, microserviceBody);
    });

    test("invalid patch microservice should return success code 400", async () => {
      mock.onPost(`${process.env.AUTH_SERVICE_URL}/authorization`).reply(200);
      mock.onPatch(`${process.env.ADMIN_SERVICE_URL}/microservices/${microserviceBody.id}`).reply(400, badRequestResponse);
      await request.patch(`/microservices/${microserviceBody.id}`).send({hola:"hola"}).expect(400, badRequestResponse);
    });

    test("valid delete microservice should return success code 200", async () => {
      mock.onPost(`${process.env.AUTH_SERVICE_URL}/authorization`).reply(200);
      mock.onDelete(`${process.env.ADMIN_SERVICE_URL}/microservices/${microserviceBody.id}`).reply(200);
      await request.delete(`/microservices/${microserviceBody.id}`).send(microservicePostBody).expect(200);
    });

    test("invalid delete microservice should return success code 200", async () => {
      mock.onPost(`${process.env.AUTH_SERVICE_URL}/authorization`).reply(200);
      mock.onDelete(`${process.env.ADMIN_SERVICE_URL}/microservices/${microserviceBody.id}`).reply(400, badRequestResponse);
      await request.delete(`/microservices/${microserviceBody.id}`).send(microservicePostBody).expect(400, badRequestResponse);
    });

    test("valid get all microservices should return success code 200", async () => {
      mock.onPost(`${process.env.AUTH_SERVICE_URL}/authorization`).reply(200);
      mock.onGet(`${process.env.ADMIN_SERVICE_URL}/microservices/`).reply(200, microserviceList);
      await request.get(`/microservices/`).expect(200, microserviceList);
    });

    test("invalid get all microservices should return success code 400", async () => {
      mock.onPost(`${process.env.AUTH_SERVICE_URL}/authorization`).reply(200);
      mock.onGet(`${process.env.ADMIN_SERVICE_URL}/microservices/`).reply(400, badRequestResponse);
      await request.get(`/microservices/`).expect(400, badRequestResponse);
    });
});

/*
router.route("/microservices/").post(AdminController.createMicroservice);
router.route("/microservices/:id").get(AdminController.getMicroservice);
router.route("/microservices/:id").patch(AdminController.updateMicroservice);
router.route("/microservices/:id").delete(AdminController.deleteMicroservice);
router.route("/microservices/").get(AdminController.getAllMicroservices);
*/
