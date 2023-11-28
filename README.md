# Full Stack Open - Part 11 - CI/CD

This repository is used for the [exercise 11.20](https://fullstackopen.com/en/part11/expanding_further#exercises-11-19-11-21) of the CI/CD part of the Full stack open course. 

Some restructuring has been done to the **bloglist app** constructed in the part 4 (backend) and 5 (frontend) in order to apply a CI/CD pipeline in this exercise. 

## Commands

Start by running `npm install`

- `npm run build:front` to make a production build of the frontend
- `npm run eslint` to run eslint
- `npm run test` to run test on backend
- `npm run test:front` to run test on frontend
- `npm run cypress:front` to run end2end test
- `npm run start:test` to run server in dev env for end2end test

`npm start` to run production build

## Links
- Pokedex repository: https://github.com/sushashi/fullstackopen-part11-CICD-pokedex
- Exercise 1: https://github.com/sushashi/fullstackopen-part11-CICD-pokedex/blob/master/exercise1.md
- Deloyment: https://fso-part11-bloglist.onrender.com/



## Misc..
- Environment variables:
    - `SECRET` for bcrypt (encrypt the password)
    - `PORT` port
    - `MONGODB_URL` : mongoDB link
    - `TEST_MONGODB_URL`: mongoDB link for test env
- Mongo DB connection string reminder

    `mongodb+srv://<USER>:<PASSWORD>@cluster0.example.mongodb.net/<DBNAME>?retryWrites=true&w=majority`

    - not the login user, password