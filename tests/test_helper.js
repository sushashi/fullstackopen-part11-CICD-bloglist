const bcrypt = require('bcrypt')

const initialBlogs = [
    {
        title: 'Some title 01',
        author: 'Some author 01',
        url: 'someurl.com',
        likes: 12
    },
    {
        title: 'Some title 02',
        author: 'Some author 01',
        url: 'balblabla.com',
        likes: 23
    },
    {
        title: 'Some title 04',
        author: 'Some author 02',
        url: 'lafbkadfgjaiw.com',
        likes: 43
    },
    {
        title: 'Some title 03',
        author: 'Some author 03',
        url: 'coolstorybro.com',
        likes: 2
    }
]

const newBlog = 
    {
        title: 'Some title 99',
        author: 'Some author 88',
        url: 'yomanyoman.com',
        likes: 33
    }

const newBlogNoTitle =
    {
        author: 'Some author 123',
        url: 'someurl.com',
        likes: 123
    }

const newBlogNoUrl = 
    {
        author: 'Some Author 456',
        title: 'Some Title Yeah',
        likes: 33
    }

const newBlogNoLike = 
    {
        author: 'Some author 88',
        title: 'Some title 99',
        url: 'yomanyoman.com',
    }


module.exports = {
    initialBlogs, newBlog, newBlogNoTitle, newBlogNoUrl, newBlogNoLike
}