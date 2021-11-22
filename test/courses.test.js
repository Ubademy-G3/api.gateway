const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const supertest = require("supertest");
const app = require("../app");

const mock = new MockAdapter(axios);
const request = supertest(app);

const fakeCourse = {
  user_id: "5fa85f64-5717-4562-b3fc-2c963f66afa6",
  id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  name: "string",
  description: "string",
  category: 0,
  subscription_type: "string",
  location: "string",
  profile_picture: "string",
};

const freeCourse = {
  id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  name: "string",
  description: "string",
  category: 0,
  subscription_type: "free",
  location: "string",
  profile_picture: "string",
};
const goldCourse = {
  id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  name: "string",
  description: "string",
  category: 0,
  subscription_type: "gold",
  location: "string",
  profile_picture: "string",
};
const premiumCourse = {
  id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  name: "string",
  description: "string",
  category: 0,
  subscription_type: "premium",
  location: "string",
  profile_picture: "string",
};

const freeUser = {
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
  subscriptionExpirationDate: "2021-11-17T00:21:26.828Z",
  favoriteCourses: [
    "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  ],
  description: [
    "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  ],
};
const goldUser = {
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
  subscriptionExpirationDate: "2021-11-17T00:21:26.828Z",
  favoriteCourses: [
    "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  ],
  description: [
    "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  ],
};
const premiumUser = {
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
  subscription: "premium",
  subscriptionExpirationDate: "2021-11-17T00:21:26.828Z",
  favoriteCourses: [
    "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  ],
  description: [
    "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  ],
};

const fakeInvalidCourse = {
  description: "someDescription",
};

const listOfCategories = [
  {
    id: 1,
    name: "Category1",
  }, {
    id: 2,
    name: "Category2",
  },
];

const ratings = {
  amount: 2,
  course_id: "105b9038-8f6a-4c15-9cc2-d8f14f3873d9",
  rating: 7.8,
  reviews: [
    {
      user_id: "515aade1-8a6c-42ef-ad52-d64915792886",
      score: 5.4,
      opinion: "Regular",
      id: "0226ae7e-4991-11ec-81d3-0242ac130003",
      course_id: "105b9038-8f6a-4c15-9cc2-d8f14f3873d9",
    },
    {
      user_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      score: 10.2,
      opinion: "Piola",
      id: "ed633c50-4990-11ec-81d3-0242ac130003",
      course_id: "105b9038-8f6a-4c15-9cc2-d8f14f3873d9",
    },
  ],
};

const badRequestResponse = { response: { status: 400, data: "Bad request" } };
const notFoundResponse = { response: { status: 404, data: "Category Not Found" } };

describe("courses routes", () => {
  test("valid course on creation should return success code 200 and course information", async () => {
    const newUserCourse = {
      user_id: fakeCourse.user_id,
      user_type: 'instructor',
      progress: 0,
      aprobal_state: false,
    };
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onPost(`${process.env.COURSES_SERVICE_URL}/courses`, fakeCourse).reply(200, fakeCourse);
    mock.onPost(`${process.env.COURSES_SERVICE_URL}/courses/${fakeCourse.id}/users/`, newUserCourse).reply(200);
    await request.post("/courses").send(fakeCourse).set("authorization", "ABCTEST").expect(200, fakeCourse);
  });
  test("incomplete course should return bad request code 400", async () => {
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onPost(`${process.env.COURSES_SERVICE_URL}/courses`, fakeInvalidCourse).reply(400, badRequestResponse);
    await request.post("/courses").send(fakeInvalidCourse).set("authorization", "ABCTEST").expect(400, badRequestResponse);
  });
  test("unexpected error getting user should return code 500", async () => {
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onPost(`${process.env.COURSES_SERVICE_URL}/courses`).reply(500);
    await request.post("/courses").set("authorization", "ABCTEST").expect(500);
  });
});

describe("categories routes", () => {
  test("get all categories returns 200 and a list of categories", async () => {
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onGet(`${process.env.COURSES_SERVICE_URL}/courses/category/`).reply(200, listOfCategories);
    await request.get("/categories").expect(200, listOfCategories);
  });

  test("get all categories returns 500 when unexpected error", async () => {
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onGet(`${process.env.COURSES_SERVICE_URL}/courses/category/`).reply(500);
    await request.get("/categories").expect(500);
  });

  test("get category by valid id returns 200 and category information", async () => {
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onGet(`${process.env.COURSES_SERVICE_URL}/courses/category/${listOfCategories[0].id}`).reply(200, listOfCategories[0]);
    await request.get(`/categories/${listOfCategories[0].id}`).expect(200, listOfCategories[0]);
  });

  test("get category by id returns 404 when category not found", async () => {
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onGet(`${process.env.COURSES_SERVICE_URL}/courses/category/${listOfCategories[0].id}`).reply(404, notFoundResponse);
    await request.get(`/categories/${listOfCategories[0].id}`).expect(404, notFoundResponse);
  });

  test("get category by id returns 500 when unexpected error", async () => {
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onGet(`${process.env.COURSES_SERVICE_URL}/courses/category/${listOfCategories[0].id}`).reply(500);
    await request.get(`/categories/${listOfCategories[0].id}`).expect(500);
  });
});

describe("ratings routes", () => {
  test("get all ratings by valid course ID returns 200", async () => {
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onGet(`${process.env.COURSES_SERVICE_URL}/courses/${ratings.course_id}/ratings`).reply(200, ratings);
    await request.get(`/courses/${ratings.course_id}/ratings`).set("authorization", "ABCTEST").expect(200, ratings);
  });

  test("get ratings by course id returns 404 when course not found", async () => {
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onGet(`${process.env.COURSES_SERVICE_URL}/courses/${ratings.course_id}/ratings`).reply(404, notFoundResponse);
    await request.get(`/courses/${ratings.course_id}/ratings`).set("authorization", "ABCTEST").expect(404, notFoundResponse);
  });

  test("get all ratings returns 500 when unexpected error", async () => {
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onGet(`${process.env.COURSES_SERVICE_URL}/courses/${ratings.course_id}/ratings`).reply(500);
    await request.get(`/courses/${ratings.course_id}/ratings`).set("authorization", "ABCTEST").expect(500);
  });

  test("valid ratings on creation should return success code 200 and rating information", async () => {
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onPost(`${process.env.COURSES_SERVICE_URL}/courses/${ratings.course_id}/ratings`).reply(200, ratings.reviews[0]);
    await request.post(`/courses/${ratings.course_id}/ratings`).send(ratings.reviews[0]).set("authorization", "ABCTEST").expect(200, ratings.reviews[0]);
  });

  test("incomplete rating should return bad request code 400", async () => {
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onPost(`${process.env.COURSES_SERVICE_URL}/courses/${ratings.course_id}/ratings`).reply(400, badRequestResponse);
    await request.post(`/courses/${ratings.course_id}/ratings`).send(ratings).set("authorization", "ABCTEST").expect(400, badRequestResponse);
  });

  test("unexpected error getting user should return code 500", async () => {
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onPost(`${process.env.COURSES_SERVICE_URL}/courses/${ratings.course_id}/ratings`).reply(500);
    await request.post(`/courses/${ratings.course_id}/ratings`).send(ratings.reviews[0]).set("authorization", "ABCTEST").expect(500);
  });
});

describe("user courses routes", () => {
  test("free user enrolls to free course returns 200", async () => {
    const userCourse = {
      user_id: freeUser.id,
      user_type: "student",
      progress: 0,
      aprobal_state: false,
    };
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onGet(`${process.env.USERS_SERVICE_URL}/users/${freeUser.id}`).reply(200, freeUser);
    mock.onGet(`${process.env.COURSES_SERVICE_URL}/courses/${freeCourse.id}`).reply(200, freeCourse);
    mock.onPost(`${process.env.COURSES_SERVICE_URL}/courses/${freeCourse.id}/users`).reply(200, userCourse);
    await request.post(`/courses/${freeCourse.id}/users`).send(userCourse).set("authorization", "ABCTEST").expect(200, userCourse);
  });
  test("free user enrolls to gold course returns 403", async () => {
    const userCourse = {
      user_id: freeUser.id,
      user_type: "student",
      progress: 0,
      aprobal_state: false,
    };
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onGet(`${process.env.USERS_SERVICE_URL}/users/${freeUser.id}`).reply(200, freeUser);
    mock.onGet(`${process.env.COURSES_SERVICE_URL}/courses/${goldCourse.id}`).reply(200, goldCourse);
    mock.onPost(`${process.env.COURSES_SERVICE_URL}/courses/${goldCourse.id}/users`).reply(200, userCourse);
    await request.post(`/courses/${goldCourse.id}/users`).send(userCourse).set("authorization", "ABCTEST").expect(403, { message: "Can't subscribe user with subscription type free to gold course" });
  });
  test("free user enrolls to premium course returns 403", async () => {
    const userCourse = {
      user_id: freeUser.id,
      user_type: "student",
      progress: 0,
      aprobal_state: false,
    };
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onGet(`${process.env.USERS_SERVICE_URL}/users/${freeUser.id}`).reply(200, freeUser);
    mock.onGet(`${process.env.COURSES_SERVICE_URL}/courses/${premiumCourse.id}`).reply(200, premiumCourse);
    mock.onPost(`${process.env.COURSES_SERVICE_URL}/courses/${premiumCourse.id}/users`).reply(200, userCourse);
    await request.post(`/courses/${premiumCourse.id}/users`).send(userCourse).set("authorization", "ABCTEST").expect(403, { message: "Can't subscribe user with subscription type free to premium course" });
  });
  test("gold user enrolls to free course returns 200", async () => {
    const userCourse = {
      user_id: goldUser.id,
      user_type: "student",
      progress: 0,
      aprobal_state: false,
    };
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onGet(`${process.env.USERS_SERVICE_URL}/users/${goldUser.id}`).reply(200, goldUser);
    mock.onGet(`${process.env.COURSES_SERVICE_URL}/courses/${freeCourse.id}`).reply(200, freeCourse);
    mock.onPost(`${process.env.COURSES_SERVICE_URL}/courses/${freeCourse.id}/users`).reply(200, userCourse);
    await request.post(`/courses/${freeCourse.id}/users`).send(userCourse).set("authorization", "ABCTEST").expect(200, userCourse);
  });
  test("gold user enrolls to gold course returns 200", async () => {
    const userCourse = {
      user_id: goldUser.id,
      user_type: "student",
      progress: 0,
      aprobal_state: false,
    };
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onGet(`${process.env.USERS_SERVICE_URL}/users/${goldUser.id}`).reply(200, goldUser);
    mock.onGet(`${process.env.COURSES_SERVICE_URL}/courses/${goldCourse.id}`).reply(200, goldCourse);
    mock.onPost(`${process.env.COURSES_SERVICE_URL}/courses/${goldCourse.id}/users`).reply(200, userCourse);
    await request.post(`/courses/${goldCourse.id}/users`).send(userCourse).set("authorization", "ABCTEST").expect(200, userCourse);
  });
  test("gold user enrolls to premium course returns 403", async () => {
    const userCourse = {
      user_id: goldUser.id,
      user_type: "student",
      progress: 0,
      aprobal_state: false,
    };
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onGet(`${process.env.USERS_SERVICE_URL}/users/${goldUser.id}`).reply(200, goldUser);
    mock.onGet(`${process.env.COURSES_SERVICE_URL}/courses/${premiumCourse.id}`).reply(200, premiumCourse);
    mock.onPost(`${process.env.COURSES_SERVICE_URL}/courses/${premiumCourse.id}/users`).reply(200, userCourse);
    await request.post(`/courses/${premiumCourse.id}/users`).send(userCourse).set("authorization", "ABCTEST").expect(403, { message: "Can't subscribe user with subscription type gold to premium course" });
  });
  test("premium user enrolls to free course returns 200", async () => {
    const userCourse = {
      user_id: premiumUser.id,
      user_type: "student",
      progress: 0,
      aprobal_state: false,
    };
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onGet(`${process.env.USERS_SERVICE_URL}/users/${premiumUser.id}`).reply(200, premiumUser);
    mock.onGet(`${process.env.COURSES_SERVICE_URL}/courses/${freeCourse.id}`).reply(200, freeCourse);
    mock.onPost(`${process.env.COURSES_SERVICE_URL}/courses/${freeCourse.id}/users`).reply(200, userCourse);
    await request.post(`/courses/${freeCourse.id}/users`).send(userCourse).set("authorization", "ABCTEST").expect(200, userCourse);
  });
  test("premium user enrolls to gold course returns 200", async () => {
    const userCourse = {
      user_id: premiumUser.id,
      user_type: "student",
      progress: 0,
      aprobal_state: false,
    };
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onGet(`${process.env.USERS_SERVICE_URL}/users/${premiumUser.id}`).reply(200, premiumUser);
    mock.onGet(`${process.env.COURSES_SERVICE_URL}/courses/${goldCourse.id}`).reply(200, freeCourse);
    mock.onPost(`${process.env.COURSES_SERVICE_URL}/courses/${goldCourse.id}/users`).reply(200, userCourse);
    await request.post(`/courses/${goldCourse.id}/users`).send(userCourse).set("authorization", "ABCTEST").expect(200, userCourse);
  });
  test("premium user enrolls to premium course returns 200", async () => {
    const userCourse = {
      user_id: premiumUser.id,
      user_type: "student",
      progress: 0,
      aprobal_state: false,
    };
    mock.onGet(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token: "ABCTEST" } }).reply(200, { message: "Valid token" });
    mock.onGet(`${process.env.USERS_SERVICE_URL}/users/${premiumUser.id}`).reply(200, premiumUser);
    mock.onGet(`${process.env.COURSES_SERVICE_URL}/courses/${premiumCourse.id}`).reply(200, premiumCourse);
    mock.onPost(`${process.env.COURSES_SERVICE_URL}/courses/${premiumCourse.id}/users`).reply(200, userCourse);
    await request.post(`/courses/${premiumCourse.id}/users`).send(userCourse).set("authorization", "ABCTEST").expect(200, userCourse);
  });
});
