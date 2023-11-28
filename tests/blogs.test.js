const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

let token
let userID
beforeEach(async () => {
    await User.deleteMany({})
    const testUser = {
        username: "testuser",
        password: "thisISaPASS002"
    }

    await api.post('/api/users').send(testUser)
    const log = await api
        .post('/api/login')
        .send(
            {
                username: testUser.username,
                password: testUser.password
            }
        )

    token = `Bearer ${log.body.token}`
    userID = jwt.verify(token.replace('Bearer ', ''), process.env.SECRET).id

    await Blog.deleteMany({})
    for (let i = 0; i < helper.initialBlogs.length; i++){
        await api
            .post('/api/blogs')
            .set('Authorization', token)
            .send(helper.initialBlogs[i])
    }
})

describe('Testing HTTP GET requests', () => {
    test('4.8: blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .set('Authorization', token)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    
    test('4.9: unique identifier of blog posts is named id', async () => {
        const response = await api
            .get('/api/blogs')
            .set('Authorization', token)
        const contents = response.body.map( b => b.id)
        expect(contents).toBeDefined()
    })
})

describe('Testing HTTP POST requests', () => {
    test('4.10: verify that posting creates a new blog', async () => {        
        const response01 = await api
            .post('/api/blogs')
            .set('Authorization', token)
            .send(helper.newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        let {id, ...rest} = response01.body
        expect(rest).toEqual( {user: userID, ...helper.newBlog})
        
        const response02 = await api
            .get('/api/blogs')
            .set('Authorization', token)
        expect(response02.body).toHaveLength(helper.initialBlogs.length + 1)
    })
    
    test('4.11: missing likes has 0 as default value', async () => {
        const beforeBlogs = await api
            .get('/api/blogs')
            .set('Authorization', token)
        
        const response = await api
            .post('/api/blogs')
            .set('Authorization', token)
            .send(helper.newBlogNoLike)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        let {id, ...rest} = response.body
        expect(rest).toEqual( {user: userID, ...helper.newBlogNoLike, likes: 0} )

        const response02 = await api
            .get('/api/blogs')
            .set('Authorization', token)
        expect(response02.body).toHaveLength(beforeBlogs.body.length + 1)
    })
    
    test('4.12: missing title or url properties return status code 400', async () => {
        await api
            .post('/api/blogs')
            .set('Authorization', token)
            .send(helper.newBlogNoTitle)
            .expect(400)
    
        await api
            .post('/api/blogs')
            .set('Authorization', token)
            .send(helper.newBlogNoUrl)
            .expect(400)
    })
})

describe("Testing HTTP DELETE requests",  () => {
    test('4.13: deleting a single blog', async () => {
        const blogsStart = (await api
            .get('/api/blogs')
            .set('Authorization', token))
            .body     
                        
        const blogToDel = blogsStart[0]

        await api
            .delete(`/api/blogs/${blogToDel.id}`)
            .set('Authorization', token)
            .expect(204)
        
        const blogsEnd = (await api
            .get('/api/blogs')
            .set('Authorization', token))
            .body
    
        expect(blogsEnd).toHaveLength(blogsStart.length - 1)
        expect(blogsEnd).not.toContain(blogToDel)
    })
})


describe('Testing HTTP PUT requests', () => {
    const blogA = {
        author: 'Modified Author',
    }
    const blogB = {
        title: 'Modified Title'
    }
    const blogL = {
        likes: 9876543
    }
    const blogU = {
        url: 'modifiedurl.com'
    }
    const blogToTest = [blogA, blogB, blogL, blogU]

    for (let i = 0; i < blogToTest.length; i++){
        test(`4.14: updating ${Object.keys(blogToTest[i])[0]}`, async () => {
            let blogBefore = (await api
                .get('/api/blogs')
                .set('Authorization', token))
                .body[0]
                
            await api
                .put(`/api/blogs/${blogBefore.id}`)
                .set('Authorization', token)
                .send(blogToTest[i])

            const blogAafter = (await api
                .get(`/api/blogs/${blogBefore.id}`)
                .set('Authorization', token))
                .body
            blogBefore[Object.keys(blogToTest[i])[0]] = Object.values(blogToTest[i])[0]
            
            //because blogBefore has been populated with user info
            let {user, ...rest } = blogBefore
            blogBefore = {user: blogBefore.user.id , ...rest}
            
            expect(blogBefore).toEqual(blogAafter)
        })
    }
})

describe('Testing HTTP POST requests without TOKEN', () => {
    test('4.23: adding a blog fails with status code 401 without token', async () =>{
        const result = await api
            .post('/api/blogs/')
            .send(helper.newBlog)
            .expect(401)
    })
})


afterAll(async () => {
    await mongoose.connection.close()
})