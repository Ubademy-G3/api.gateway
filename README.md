# API Gateway
[![CI](https://github.com/Ubademy-G3/api.gateway/actions/workflows/test.yml/badge.svg)](https://github.com/Ubademy-G3/api.gateway/actions/workflows/test.yml)

Service dedicated to unifying the publication of APIs to be consumed by other applications or by developers.

This service provides:

* Routing: it sends requests to different destinations depending on the context or the content of the message.
* Transformation: components intended to transform the data, or its masking.
* Security policies that add authentication, authorization, and encryption to APIs.

## Directory structure

```tree
├── app.js
├── application
│   ├── controllers
│   │   ├── AdminController.js
│   │   ├── AuthController.js
│   │   ├── CoursesController.js
│   │   ├── ExamsController.js
│   │   ├── MetricsController.js
│   │   ├── PaymentsController.js
│   │   └── UsersController.js
│   ├── logger.js
│   ├── middlewares
│   │   └── AuthMiddleware.js
│   └── serializers
│       └── LoggedUserSerializer.js
├── deploy
│   └── heroku-entrypoint.sh
├── docker-compose.yml
├── Dockerfile
├── heroku.yml
├── index.js
├── infrastructure
│   └── routes
│       └── gateway.js
├── LICENSE
├── logs.log
├── monitoring
│   └── datadog.yml
├── node_modules
├── package.json
├── package-lock.json
├── README.md
├── swagger.json
└── test
    ├── admin.test.js
    ├── auth.test.js
    ├── courses.test.js
    └── users.test.js
```
# Local Environment

## Requirements 

* Docker
* Docker-compose

## Environment variables

To run this application you need to define the following environment variables:

```
ADMIN_APIKEY=YOUR_ADMIN_APIKEY
ADMIN_SERVICE_URL=YOUR_ADMIN_SERVICE_URL
AUTH_SERVICE_URL=YOUR_AUTH_SERVICE_URL
USERS_SERVICE_URL=YOUR_USERS_SERVICE_URL
COURSES_SERVICE_URL=YOUR_COURSES_SERVICE_URL
EXAMS_SERVICE_URL=YOUR_EXAMS_SERVICE_URL
METRICS_SERVICE_URL=YOUR_METRICS_SERVICE_URL
PAYMENTS_SERVICE_URL=YOUR_PAYMENTS_SERVICE_URL
```

## Build and Deploy Services

```docker-compose up -d --build```

## Stop services

```docker-compose stop```

## Down services and remove containers, networks, volumes and images created by 'up'

```docker-compose down```

## To run tests

```docker-compose exec node npm run test .```


You can try it out at <https://staging-api-gateway-app-v2.herokuapp.com/api-docs>
