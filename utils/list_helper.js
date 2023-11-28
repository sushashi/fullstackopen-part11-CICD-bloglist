const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const listLike = blogs.map( b => b.likes)
    // console.log('list like: ', listLike)
    return listLike.reduce( (sum, item) => sum + item, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.reduce( (top, next) => top.likes > next.likes ? top : next)
}

const mostBlogs = (blogs) => {
    const blogsNumber = Object.values((_.groupBy(blogs,'author'))).map( k => k.length)
    const blogsAuthor = Object.keys((_.groupBy(blogs,'author')))
    const idxMax = blogsNumber.indexOf(Math.max(...blogsNumber))
    // console.log(
    //     _.groupBy(blogs,'author')
    //     )
    const result = {
        author : blogsAuthor[idxMax],
        blogs : blogsNumber[idxMax]
    }
    // console.log(result)
    return result
}

const mostBlogs2 = (blogs) => {
    const blogsByAuthor = _(blogs)
        .groupBy('author')
        .map( a => ({
            author: a[0].author,
            blogs: Object.values(_.countBy(a))[0]
        }))
        .value()
    // console.log(blogsByAuthor)
    return blogsByAuthor.reduce( (top, next) => top.blogs > next.blogs ? top : next)
}

const mostLikes = (blogs) => {
    const likesByAuthor = _(blogs)
        .groupBy('author')
        .map( a => ({
            author: a[0].author,
            likes: _.sumBy(a,'likes')
        })).value()

    return likesByAuthor.reduce( (top, next) => top.likes > next.likes ? top : next )
}

module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes, mostBlogs2
}