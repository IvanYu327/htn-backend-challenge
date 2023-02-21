# HTN - Backend Challenge - Ivan Yu
- [About](#about)
- [Getting Started](#getting-started)
- [User](#user)
  * [/users - GET](#users---get)
  * [/users/:id - GET](#usersid---get)
  * [/users/:id - PUT](#usersid---put)
  * [/users/:id - DELETE](#usersid---delete)
- [Skill](#skill)
  * [/skills/:skill - GET](#skillsskill---get)
  * max freq skills
- [Tests](#tests)


# About

This is a API for Hack the North's Backend Challenge.

# Getting Started

1. Clone the repository
2. In the root directory, install dependencies
```
npm install
```
3. Start the server
```
npm start
```
4. The server will run locally from `http://localhost:8000`

# User
A User represents someone that is attending Hack the North

### Attributes

`id` - int

`name` - string

`company` - string

`email` - string

`phone` - string

`skills` - [Skill[ ]](#skill)
```
{
    "id": 
    "name": "Breanna Dillon",
    "company": "Jackson Ltd",
    "email": "lorettabrown@example.net",
    "phone": "+1-924-116-7963",
    "skills": []
}
```

## /users - GET
Lists all the users

### Parameters
`offset` <sub>optional int</sub>

Offset the results by this amount

`limit` <sub>optional int</sub>

Limits the number of users returned


> This call will return a maximum of 250 users

###### Example:
```
http://localhost:8000/users
```

## /users/:id - GET
Gets a user by user ID

### Parameters
No parameters

###### Example: 
```
GET http://localhost:8000/users/2
```

## /users/:id - PUT

Finds a user by their user ID and updates their information.

For skills, if the skill does not exist, the skill will be created as a new skill and added to the user's information.

### Parameters
`name` <sub>optional string</sub>

The user's updated name.

`company` <sub>optional string</sub>

The user's updated company name.

`email` <sub>optional string</sub>

The user's updated email affress.

`phone` <sub>optional string</sub>

The user's updated phone number.

`skills` <sub>optional Skill[]</sub>

The user's updated or new skills.


###### Example: 
```
PUT http://localhost:8000/users/2
```

## users/:id - DELETE
Deletes a user by their user ID

### Parameters
No parameters

###### Example:
```
DELETE http://localhost:8000/users/2
```

# Skill
A skill is a technology or attribute that a user has, rated from 1 - 5.

### Attributes

`id` - int

`skill` - string

`rating` - int (1 to 5, inclusive)
```
{
    "id": 1,
    "skill": "Swift",
    "rating": 4
}
```


## /skills/:skill - GET

Returns the number of users with this skill

### Parameters
No parameters

###### Example: 
```
GET http://localhost:8000/skills/?skill=php
```

## skills/:min_frequency&max_frequency - GET

###### Example: 
```
GET http://localhost:8000/skills/?min_frequency=5&max_frequency=10
```

# Tests
