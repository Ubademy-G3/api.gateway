# API Gateway
[![CI](https://github.com/Ubademy-G3/api.gateway/actions/workflows/test.yml/badge.svg)](https://github.com/Ubademy-G3/api.gateway/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/Ubademy-G3/api.gateway/branch/main/graph/badge.svg?token=8MTSQLAFIP)](https://codecov.io/gh/Ubademy-G3/api.gateway)


# Local Environment

## Requirements 

* Docker
* Docker-compose

## Environment variables

To run this application you need to define the following environment variables:

```
AUTH_APIKEY=YOUR_AUTH_SERVICE_APIKEY
AUTH_SERVICE_URL=YOUR_AUTH_URL
USERS_APIKEY=YOUR_USERS_SERVICE_APIKEY
USERS_SERVICE_URL=YOUR_USERS_SERVICE_URL
```

## Build and Deploy Services

```docker-compose up -d --build```

## Stop services

```docker-compose stop```


You can try it out at <https://staging-api-gateway-app.herokuapp.com/api-docs>