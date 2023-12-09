# Auth service (WIP)

A reusable auth micro-service for authentication as well as authorization, partially based on OAuth2.0 and OpenID connect.

## Screenshots

### Login page

![login page](./screenshots/login.png 'login page')

### Dashboard (wip)

![dashboard](./screenshots/dashboard.png 'dashboard')

## Local setup

Copy `.env.example` to `.env` and update corresponding environment variable values. Then run following commands in project root directory.

```sh
docker compose build
docker compose up
```

Visit [http://localhost:3000](http://localhost:3000) in your browser to login to dashboard.

## Seeding data

Run following commands:

```sh
docker compose up
docker exec auth-service-app-1 node scripts/seed
```

After running this command you can use these credentials to login to dashboard:

**username:** vishnu@auth-service.com<br>
**password:** 1234567890
