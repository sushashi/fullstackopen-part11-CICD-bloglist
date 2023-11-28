import React from 'react'
import '@testing-library/jest-dom/'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'

test ('5.13 only default contents redered', () => {
  const blog = {
    title: 'some title',
    author: 'some author',
    url: 'www.someurl.com'
  }

  const { container } = render(<Blog  blog = {blog} />)

  const div = container.querySelector('.blogDefault')
  expect(div).toHaveTextContent('some title')
  expect(div).toHaveTextContent('some author')
  expect(div).not.toHaveTextContent('www.someurl.com')
  expect(div).not.toHaveTextContent('likes')
})

test('5.14 contents rendered on clicked show', () => {
  const user = {
    username: 'someusername',
    name: 'George Willis',
    likes: '20',
    id: '12345'
  }

  const blog = {
    title: 'some title',
    author: 'some author',
    url: 'www.someurl.com',
    user: user
  }

  const blogComponent = render( <Blog blog = {blog} /> )

  const button = blogComponent.getByText('view')
  fireEvent.click(button)

  const div = blogComponent.container.querySelector('.blogShown')
  expect(div).toHaveTextContent('some title')
  expect(div).toHaveTextContent('some author')
  expect(div).toHaveTextContent('www.someurl.com')
  expect(div).toHaveTextContent('likes')
  expect(div).toHaveTextContent('George Willis')
})

test('5.15 like button clicked twice', async () => {
  const user = {
    username: 'someusername',
    name: 'George Willis',
    likes: '20',
    id: '12345'
  }

  const blog = {
    title: 'some title',
    author: 'some author',
    url: 'www.someurl.com',
    user: user
  }
  const mockLiker = jest.fn()

  const blogComponent = render( <Blog blog = {blog} handleLike={mockLiker}/> )

  const buttonView = blogComponent.getByText('view')
  fireEvent.click(buttonView)

  const testUser = userEvent.setup()
  const buttonLike = screen.getByText('like')
  await testUser.click(buttonLike)
  await testUser.click(buttonLike)

  expect(mockLiker.mock.calls).toHaveLength(2)
})

test('5.16 new blog form', async () => {
  const createBlog = jest.fn()
  const user = userEvent.setup()

  const blogFormComponent = render(< BlogForm createBlog={createBlog} />)

  const inputTitle = blogFormComponent.container.querySelector('input[name=\'Title\']')
  const inputAuthor = blogFormComponent.container.querySelector('input[name=\'Author\']')
  const inputUrl = blogFormComponent.container.querySelector('input[name=\'Url\']')

  const createButton = screen.getByText('create')

  await user.type(inputTitle, 'Title of the blog for testing purpose')
  await user.type(inputAuthor, 'Author of the blog for testing purpose')
  await user.type(inputUrl, 'www.testingblog.com')

  await user.click(createButton)

  console.log(createBlog.mock.calls[0][0][1])

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Title of the blog for testing purpose')
  expect(createBlog.mock.calls[0][0].author).toBe('Author of the blog for testing purpose')
  expect(createBlog.mock.calls[0][0].url).toBe('www.testingblog.com')

})