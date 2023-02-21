# HTN - Backend Challenge - Ivan Yu
- [Getting Started](#getting-started)
- [APIs](apis)
  * [/users - GET](#users-get)
  * [On the right](#on-the-right)


# Getting Started

1. Clone the repository
2. In the root directory, install dependencies
   > `npm install`
3. To start the server locally
   > `npm start`

# APIs

## /users GET
Lists all the users


| Parameter    	|Type  | Description                         	| Required? |
|--------------	|-     |------------------------------------	   | ----------|
| offset         	|int   | Offset the results by this amount 	   | Optional  |
| limit          	|int   | Limits the number of users returned 	| Optional  |


> This call will return a maximum of 250 users

Example:
```
http://localhost:8000/users
```

## /users/:id GET
Gets a user by user ID

| Parameter    	|
|--------------	|
| No parameters   |

Example: 
```
GET http://localhost:8000/users/2
```

## /users/:id PUT

Finds a user by their user ID and updates their information.

For skills, if the skill does not exist, the skill will be added to the user's information.

| Parameter    	|Type       | Description                       	| Required? |
|--------------	|------     |------------------------------------	| ----------|
| name           	|string     | The user's name                      | Optional  |
| company        	|string     | The user's company                   | Optional  |
| email          	|string     | The user's email                     | Optional  |
| phone          	|string     | The user's phone                     | Optional  |
| skill           |Skill[]    | The user's skills                    | Optional  |


Example: 
```
PUT http://localhost:8000/users/2
```

body: blak basdfjasdiof

## Delete user by id

Example: `DELETE http://localhost:8000/users/2`

## Count occurences of a skill

Example: `GET http://localhost:8000/skills/?skill=php`

## Get skills within range of occurences

Example: `GET http://localhost:8000/skills/?min_frequency=5&max_frequency=10`

# Tests

# Next Steps

# Tests

# Next Steps
# Tests

# Next Steps
# Tests

# Next Steps
# Tests

# Next Steps
# Tests

# Next Steps
# Tests

# Next Steps
# Tests

# Next Steps
# Tests

# Next Steps
# Tests

# Next Steps
# Tests

# Next Steps
# Tests

# Next Steps
# Tests

# Next Steps
# Tests

# Next Steps
# Tests

# Next Steps
# Tests

# Next Steps
# Tests

# Next Steps
# Tests

# Next Steps
# Tests

# Next Steps
# Tests

# Next Steps
# Tests

# Next Steps
# Tests

# Next Steps
# Tests

# Next Steps
# Tests

# Next Steps
# Tests

# Next Steps
