# HTN - Backend Challenge - Ivan Yu
- [About](#about)
- [Getting Started](#getting-started)
- [Hacker](#hacker)
  * [/users - GET](#users---get)
  * [/users/:id - GET](#usersid---get)
  * [/users/:id - PUT](#usersid---put)
  * [/users/:id - DELETE](#usersid---delete)


- [Skill](#skill)
  * [/skills/:skill - GET](#skillsskill---get)
  * max freq skills
- [Tests](#tests)


# About

This 

# Getting Started

1. Clone the repository
2. In the root directory, install dependencies
   > `npm install`
3. To start the server locally
   > `npm start`

# Hacker
A Hacker is a participant for Hack the North

Attributes

`id` - int

`name` - string

`company` - string

`email` - string

`phone` - string

`skills` - [Skill[ ]](#the-skill-object)
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


| Parameter    	  |Type  | Description                         	| Required? |
|--------------	  |-     |------------------------------------	 | ----------|
| offset         	|int   | Offset the results by this amount 	  | Optional  |
| limit          	|int   | Limits the number of users returned 	| Optional  |


> This call will return a maximum of 250 users

Example:
```
http://localhost:8000/users
```

## /users/:id - GET
Gets a user by user ID

| Parameter    	|
|--------------	|
| No parameters   |

Example: 
```
GET http://localhost:8000/users/2
```

## /users/:id - PUT

Finds a user by their user ID and updates their information.

For skills, if the skill does not exist, the skill will be added to the user's information.

| Parameter    	|Type       | Description                       	| Required? |
|--------------	|------      |------------------------------------	| ----------|
| name           	|string     | The user's name                      | Optional  |
| company        	|string     | The user's company                   | Optional  |
| email          	|string     | The user's email                     | Optional  |
| phone          	|string     | The user's phone                     | Optional  |
| skill           |Object[]   | The user's skills                    | Optional  |
| skill.name      |string     | Name of the skill                    | Required  |
| skill.rating    |int        | The skill's rating, from 1-5         | Optional  |



Example: 
```
PUT http://localhost:8000/users/2
```

## users/:id - DELETE
Deletes a user by their user ID

| Parameter    	|
|--------------	|
| No parameters |

Example:
```
DELETE http://localhost:8000/users/2
```

# Skill
A skil is a technology or attribute that a hacker has, rated from 1 - 5.

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

| Parameter    	|
|--------------	|
| No parameters |

Example: 
```
GET http://localhost:8000/skills/?skill=php
```

## skills/:min_frequency&max_frequency - GET

Example: `GET http://localhost:8000/skills/?min_frequency=5&max_frequency=10`

# Tests

# Next Steps


