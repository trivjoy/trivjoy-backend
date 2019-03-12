# Trivjoy Backend

Repo for REST API backend (https://trivjoy.herokuapp.com).

## Setup

```sh
yarn
yarn setup
```

Update the `.env` file.

## Development

```sh
yarn dev
```

## Production

```sh
yarn start
```

---

# Endpoint and Data

## Users

| Endpoint          | Method | Description           | isAuthenticated | isAdmin |
| ----------------- | ------ | --------------------- | --------------- | ------- |
| `/`               | GET    | Hello                 |                 |         |
| `/users/register` | POST   | Register new user     |                 |         |
| `/users/login`    | POST   | Login to user         |                 |         |
| `/users/profile`  | GET    | Get user profile      | YES             |         |
| `/users/:id`      | GET    | Get one user by id    |                 |         |
| `/users`          | GET    | Get all users         |                 |         |
| `/users/:id`      | PUT    | Update one user by id |                 |         |

Example Data users:

```json
{
  "_id": ObjectId("5c7ba251a12cba3cbb5ef67f"),
  "name": "Bara Limbong",
  "email": "bara@gmail.com",
  "phone": "+62832312123",
  "gender": "male",
  "city": "Bandung",
  "age": 29,
  "address": "jl. prapanca",
  "about": "ksatria",
  "salt": "qeojqry8hfiwef3832",
  "password": "qeojqry8hfiwef3832.asfnoihhr0922"
}
```

## Trip

| Endpoint             | Method | Description                              | isAuthenticated |
| -------------------- | ------ | ---------------------------------------- | --------------- |
| `/trips/seed`        | GET    | Seed initial dummy trips                 | YES             |
| `/trips`             | GET    | Get all trips                            |                 |
| `/trips?q=keyword`   | GET    | Search for trips                         |                 |
| `/trips`             | POST   | Create new trip                          | YES             |
| `/trips`             | DELETE | Delete all trips                         |                 |
| `/trips/:id`         | GET    | Get one trip by id                       | YES             |
| `/trips/:id`         | DELETE | Delete one trip by id                    | YES             |
| `/trips/:id`         | PUT    | Update one trip by id                    | YES             |
| `/trips/:id/request` | PUT    | Request to join trip, by other user      | YES             |
| `/trips/:id/approve` | PUT    | Approve to let user join trip, by author | YES             |

Example Data:

```json
{
  "_id": ObjectId("5c7d518d26dd3414b1dac304"),
  "author": ObjectId("989832u4i2jkrjfkdjfisjdr"),
  "title": "Keliling Pantai Kebumen",
  "destination": "Kebumen, Jawa Tengah, Indonesia",
  "dateFrom": "2019-03-26T18:23:37.000Z",
  "dateTo": "2019-03-30T18:23:37.000Z",
  "budget": 2000000,
  "image": "https://upload.wikimedia.org/wikipedia/commons/1/1e/Default-avatar.jpg",
  "description": "Keliling pantai 100 kali yuk biar sehat.",
  "peopleMin": 1,
  "peopleMax": 5,
  "users_requested": [
    ObjectId(),
    ObjectId(),
    ObjectId(),
    ObjectId(),
    ObjectId(),
    ObjectId()
  ],
  "users_joined": [ObjectId(), ObjectId(), ObjectId()]
}
```
