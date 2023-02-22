# HTN - Backend Challenge - Ivan Yu

- [About](#about)
- [Getting Started](#getting-started)
- [User](#user)
  - [/users - GET](#users---get)
  - [/users/:id - GET](#usersid---get)
  - [/users/:id - PUT](#usersid---put)
  <!-- * [/users/:id - DELETE](#usersid---delete) -->
- [Skill](#skill)
  - [/skills/:skill - GET](#skillsskill---get)
  - [/skills - GET](#skills---get)
- [Findings and Next Steps](#findings-and-next-steps)

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

The unique identifier for the object.

`name` - string

The user's name

`company` - string

The user's company

`email` - string

The user's email

`phone` - string

The user's phone number

`registered` - boolean

The user's registration status for the event. True indicates that they have arrived and registed.

`skills` - [Skill[ ]](#skill)

The skills that this user has

### Example User Object:

```
{
    "id":
    "name": "Breanna Dillon",
    "company": "Jackson Ltd",
    "email": "lorettabrown@example.net",
    "phone": "+1-924-116-7963",
    "registered": false,
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

### Example Request:

```
http://localhost:8000/users/?limit=2&offset=1
```

### Example Response:

```
{
    "message": "success",
    "data": [
        {
            "name": "Kimberly Wilkinson",
            "company": "Moon, Mendoza and Carter",
            "email": "frederickkyle@example.org",
            "phone": "(186)579-0542",
            "skills": [
                {
                    "skill": "Foundation",
                    "rating": 4
                },
                {
                    "skill": "Fortran",
                    "rating": 2
                },
                {
                    "skill": "Plotly",
                    "rating": 3
                },
                {
                    "skill": "Elixir",
                    "rating": 4
                }
            ]
        },
        {
            "name": "Adam Huynh",
            "company": "Johnson-Christian",
            "email": "bowmancynthia@example.net",
            "phone": "912.284.0199",
            "skills": [
                {
                    "skill": "PHP",
                    "rating": 2
                },
                {
                    "skill": "Haskell",
                    "rating": 4
                },
                {
                    "skill": "Scheme",
                    "rating": 2
                }
            ]
        }
    ]
}
```

## /users/:id - GET

Gets a user by user ID

### Parameters

No parameters

### Example Request:

```
GET http://localhost:8000/users/2
```

### Example Response:

```
{
    "message": "success",
    "data": {
        "name": "Breanna Dillon",
        "company": "Jackson Ltd",
        "email": "lorettabrown@example.net",
        "phone": "+1-924-116-7963",
        "skills": [
            {
                "skill": "Swift",
                "rating": 4
            },
            {
                "skill": "OpenCV",
                "rating": 1
            }
        ]
    }
}
```

## /users/:id - PUT

Finds a user by their user ID and updates their information.

For skills, if the skill does not exist, the skill will be created as a new skill and added to the user's information.

### Request Body

`name` <sub>optional string</sub>

The user's updated name.

`company` <sub>optional string</sub>

The user's updated company name.

`email` <sub>optional string</sub>

The user's updated email affress.

`phone` <sub>optional string</sub>

The user's updated phone number.

`skills` <sub>optional Skill[]</sub>

The user's updated or new skill(s).

> Note that this endpoint supports partial updating

### Example Request:

```
PUT http://localhost:8000/users/2
```

where the body data is

```
{
    "name": "BEA",
    "skills": [
        {
            "skill": "Swift",
            "rating": 5
        },
        {
            "skill": "OOGA BOOGA",
            "rating": 5
        }
    ]
}
```

### Example Response:

```
{
    "message": "success"
}
```

<!-- ## users/:id - DELETE
Deletes a user by their user ID

### Parameters
No parameters

###### Example:
```
DELETE http://localhost:8000/users/2
``` -->

## /users/register/:id - PUT

Finds a user by their user ID and sets their `registered` field to true, indicating their arrival and sign in to Hack the North.

> Note that a user cannot be unregistered after registering

### Example Request:

```
PUT http://localhost:8000/users/register/2
```

### Example Response:

```
{
    "message": "success"
}
```




# Skill

A skill is a technology or attribute that a user has, rated from 1 - 5.

### Attributes

`id` - int

The unique identifier for the object.

`skill` - string

The name of the skill.

`rating` - int (1 to 5, inclusive)

The rating of proficiency in the skill.

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

### Example Request:

```
GET http://localhost:8000/skills/php
```

### Example Response:

```
{
    "message": "success",
    "count": 1
}
```

## /skills - GET

Lists all the skills that occur between a mininum and maximum frequency. Returns all skills across all users if no frequencies are specified.

`min_frequency` <sub>optional string</sub>

The minimum frequency. Must be greater than 0.

`max_frequency` <sub>optional string</sub>

The maximum frequency. Must be greater than 0.

### Example Request:

```
GET http://localhost:8000/skills/?min_frequency=2&max_frequency=5
```

### Example Response:

```
{
    "message": "success",
    "data": [
        "Elixir",
        "Fortran",
        "Sed",
        "Smalltalk",
        "Spectre.css",
        "Swift"
    ]
}
```

# Findings and Next Steps

## Table design

I created two tables, `user` and `skill`. It made sense to split the data into two tables given that part of the requirement was to have endpoints that queried for skills regardless of the user the skill belonged to.

For skills, they are constrained that every pair of `user_id` and `skill` can only appear once, no user can have two of the same skill.

## Duplicate emails and skills

Haha, very sneaky. In my initial database design, emails had to be unique and users could only possess one skill once. I ended up getting a bunch of errors because there were duplicate emails and duplicate skills within a single user. For the sake of this challenge, I allowed duplicate emails, but for skills, I only took the first skill, rejecting future duplicates on the initial database setup.

Otherwise, in the `CREATE TABLE user` statement, I would have added a `CONSTRAINT email_unique UNIQUE (email)` to the end of the SQL statement to make emails unique across users. Same for phone numbers, but one could argue of a case that two child hackers could use the same guardian phone number since phone numbers aren't used for login like emails are.

## Tests

I didn't get to writing any tests, but tested using Postman and also sanitized and validated all inputs, checking for types, range constraints, and using validator libraries.

## Next Steps

- Write some tests
- Sanitize inputs more, phone numbers should be either rejected for improper format or reformatted into a single standard. They vary a lot right now which could cause problems in the future for things like automated texting services. Also I probably missed one or two edge cases where invalid inputs get past my current checks.
- Endpoints to:
  - Create new users
  - Delete specific skills from users
  - Show events, show and add more information. Registration can be more than a boolean, it should have registration date and time, which entrance they registered at, or the organizer that registered them if applicable.
