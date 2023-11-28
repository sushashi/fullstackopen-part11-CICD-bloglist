const listHelper = require('../utils/list_helper')

const listWithBlogs = [
    {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        likes: 12
    },
    {
        title: "Some title 01",
        author: "Mister Author 01",
        likes: 3
    },
    {
        title: "Some title 02",
        author: "Mister Author 01",
        likes: 10
    }
]

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})

describe('total likes', () => {
    const listWithOneBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
      }
    ]
  
    test('when list has only one blog, equals the likes of that', () => {
      const result = listHelper.totalLikes(listWithOneBlog)
      expect(result).toBe(5)
    })
  })

  describe('favorite blog', () => {
    const expected = {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        likes: 12
      }

    test('testing favorite blog', () => {
        const result = listHelper.favoriteBlog(listWithBlogs)
        expect(result).toEqual(expected)
    })
  })

describe('most blog by author', () => {
    const expected = {
        author: 'Mister Author 01',
        blogs: 2
    }

    test('testing author with most blogs', () => {
        const result = listHelper.mostBlogs(listWithBlogs)
        expect(result).toEqual(expected)
    })
})

describe('most likes by author', () => {
    const expected = {
        author: 'Mister Author 01',
        likes: 13
    }

    test('testing author with most likes', () => {
        const result = listHelper.mostLikes(listWithBlogs)
        expect(result).toEqual(expected)
    })
})

describe('most blog by author version 2', () => {
    const expected = {
        author: 'Mister Author 01',
        blogs: 2
    }

    test('testing author with most blogs', () => {
        const result = listHelper.mostBlogs2(listWithBlogs)
        expect(result).toEqual(expected)
    })
})