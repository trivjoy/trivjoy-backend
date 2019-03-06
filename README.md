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
| `/users`          | DELETE | Delete all users      |                 | YES     |
| `/users/:id`      | DELETE | Delete one user by id | YES             |         |
| `/users/:id`      | PUT    | Update one user by id |                 |         |

Example Data:

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

## Items

| Endpoint           | Method | Description           | isAuthenticated | isAdmin |
| ------------------ | ------ | --------------------- | --------------- | ------- |
| `/items`           | GET    | Get all items         |                 |         |
| `/items?q=keyword` | GET    | Search for items      |                 |         |
| `/items`           | POST   | Create new idea       | YES             |         |
| `/items`           | DELETE | Delete all items      |                 | YES     |
| `/items/:id`       | DELETE | Delete one idea by id | YES             |         |
| `/items/:id`       | PUT    | Update one idea by id | YES             |         |

Example Data:

```json
{
  "_id" : ObjectId("5c7d518d26dd3414b1dac304"),
    "user_id": ObjectId("989832u4i2jkrjfkdjfisjdr"),
    "title":"trip to Kebumen",
    "date_departure": ISODate("01/05/2019 12:12"),
    "date_return": ISODate("05/05/2019 12:00"),
    "budget": 2000000,
    "pictures":{
        "http://domain.com/images/1.png",
        "http://domain.com/images/2.png"
    },
   "users_joined": [
       ObjectId('aoio2i3o2k32k')
       ObjectId('aoio2i3o2k32k')
       ObjectId('aoio2i3o2k32k')
   ]
  "details": "<p></p>"
}
```
