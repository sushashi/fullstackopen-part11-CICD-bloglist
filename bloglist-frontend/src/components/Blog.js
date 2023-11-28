import { useState } from 'react'
// import Togglable from './Togglable'

const Blog = ({ blog, handleLike, handleDelete }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)

  const handleViewHide = () => {
    setVisible(!visible)
  }

  const actualUser = JSON.parse(window.localStorage.getItem('loggedBlogUser'))

  if (visible) {
    return (
      <div style = {blogStyle} className = 'blogShown'>
        {blog.title} {blog.author} {' '}
        <button onClick = {handleViewHide}>hide</button> <br/>
        {blog.url} <br/>
        likes {blog.likes} {' '}
        <button onClick = {() => handleLike(blog)}>like</button> <br/>
        {blog.user.name} <br/>
        {actualUser
          ? (
            actualUser.username === blog.user.username
              ? <button onClick = {handleDelete}>Remove</button>
              : ''
          )
          : ''
        }
      </div>
    )
  } else {
    return (
      <div style = {blogStyle} className = 'blogDefault'>
        {blog.title} {blog.author} {' '}
        <button onClick = {handleViewHide}>view</button>
      </div>
    )
  }
}

export default Blog