import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect( () => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  },[])

  const handleLogin = async (loginUser) => {
    try {
      const user = await loginService.login(loginUser)
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
      setUser(user)
    } catch (exception) {
      setErrorMessage('wrong credentials')
      console.log(exception)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogUser')
    setUser(null)
  }

  const displayNotification = (what) => {
    setMessage(what)
    setTimeout( () => {
      setMessage(null)
    }, 5000)
  }

  const blogFormRef = useRef()
  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    const response = await blogService
      .create(blogObject)

    const newBlog = await blogService.getAll()
    setBlogs(newBlog)
    displayNotification(`a new blog ${response.title} by ${response.author} added`)
  }

  const handleLike = async (blog) => {
    const increment = blog.likes + 1
    const newBlog = { ...blog, likes: increment, user: blog.user.id }
    const response = await blogService.update(newBlog)
    setBlogs(sortedBlogs.map(b => b.id === response.id ? response : b))
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`) ){
      await blogService.remove(blog.id)
      setBlogs(sortedBlogs.filter(b => b.id !== blog.id))
    }
  }

  const compareFn = (a,b) => {
    return b.likes-a.likes
  }
  const sortedBlogs = blogs.sort(compareFn)

  const blogForm = () => {
    return (
      <div>
        <div>
          <h2>blogs</h2>
          <Notification message = {message} />
          <p>
            {user.name} logged in
            <button type = 'submit' onClick = {handleLogout}>logout</button>
          </p>
        </div>

        <Togglable buttonLabel = 'Add New Blog' ref = {blogFormRef}>
          <BlogForm createBlog = {addBlog} />
        </Togglable>
      </div>
    )
  }

  // const [visible, setVisible] = useState(false)
  // const handleViewHide = () => {
  //   setVisible(!visible)
  // }

  return (
    <div>
      <Notification message = {errorMessage} />
      { user === null
        ? <LoginForm loginUser = {handleLogin} />
        : blogForm()
      }

      {sortedBlogs.map(blog =>
        <Blog key={blog.id} blog={blog}
          handleLike={() => handleLike(blog)}
          handleDelete={() => handleDelete(blog)}
        />
      )}

    </div>
  )
}

export default App