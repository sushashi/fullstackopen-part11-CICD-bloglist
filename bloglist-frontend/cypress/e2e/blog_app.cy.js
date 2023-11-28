/* eslint-disable no-undef */
describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3000/api/testing/reset')
    const user = {
      name: 'Tester User',
      username: 'testuser',
      password:'abcd1234'
    }
    cy.request('POST', 'http://localhost:3000/api/users', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', () => {
    cy.visit('http://localhost:3000')
    cy.contains('log in to application')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('testuser')
      cy.get('#password').type('abcd1234')
      cy.get('#login-button').click()

      cy.contains('Tester User logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('wronguser')
      cy.get('#password').type('wrongpassword')
      cy.get('#login-button').click()

      cy.contains('wrong credentials')
      cy.get('.errorNotification').should('have.css', 'color', 'rgb(255, 0, 0)')
    })

    describe('When logged in', function() {
      beforeEach(function() {
        // log in first
        cy.login( { username: 'testuser', password: 'abcd1234' } )
      })

      it('A blog can be created', function() {
        cy.contains('Add New Blog').click()
        cy.get('#title').type('This is the title of a blog')
        cy.get('#author').type('Author von Blogger')
        cy.get('#url').type('www.thisisatest.com')
        cy.get('#createBlog-button').click()

        cy.contains('a new blog This is the title of a blog by Author von Blogger added')
        cy.contains('This is the title of a blog Author von Blogger')
      })

      describe('When it contains a blog', function() {
        beforeEach(function() {
          cy.contains('Add New Blog').click()
          cy.get('#title').type('This is the title of a blog')
          cy.get('#author').type('Author von Blogger')
          cy.get('#url').type('www.thisisatest.com')
          cy.get('#createBlog-button').click()
        })

        it('A User can like a blog', function() {
          cy.contains('view').click()
          cy.contains('like').click()

          cy.contains('likes 1')
        })

        it('A User who created a blog can delete it', function() {
          cy.contains('view').click()
          cy.contains('Remove').click()
          cy.contains('This is the title of a blog Author von Blogger').should('not.exist')
        })

        it('Only the blog creator can see the delete button', function() {
          cy.request('POST', 'http://localhost:3000/api/users', {
            name: 'Second Tester',
            username: 'secondtester',
            password: '1234abcd'
          })

          cy.contains('view').click()
          cy.contains('Remove')

          cy.contains('logout').click()
          cy.contains('Remove').should('not.exist')

          cy.login( { username: 'secondtester', password: '1234abcd' } )
          cy.contains('view').click()
          cy.contains('Remove').should('not.exist')
        })
      })

      describe('When it contains more blogs', function() {
        beforeEach(function() {
          cy.contains('Add New Blog').click()
          cy.get('#title').type('This is the title of a blog')
          cy.get('#author').type('Author von Blogger')
          cy.get('#url').type('www.thisisatest.com')
          cy.get('#createBlog-button').click()

          cy.contains('Add New Blog').click()
          cy.get('#title').type('This is the title of a second blog')
          cy.get('#author').type('Author von Blogger')
          cy.get('#url').type('www.thisisatest.com')
          cy.get('#createBlog-button').click()
          cy.wait(500)

          cy.contains('Add New Blog').click()
          cy.get('#title').type('This is the title of a third blog')
          cy.get('#author').type('Author von Blogger')
          cy.get('#url').type('www.thisisatest.com')
          cy.get('#createBlog-button').click()
          cy.wait(500)
        })

        it('Blogs are ordered according to likes', function() {
          cy.contains('This is the title of a second blog Author von Blogger').contains('view').click()
          cy.contains('This is the title of a second blog Author von Blogger').contains('like').click()
            .wait(500).click().wait(500).click()

          cy.contains('This is the title of a third blog Author von Blogger').contains('view').click()
          cy.contains('This is the title of a third blog Author von Blogger').contains('like').click()
            .wait(500).click()

          cy.contains('This is the title of a blog Author von Blogger').contains('view').click()
          cy.contains('This is the title of a blog Author von Blogger').contains('like').click()

          cy.get('.blogShown').eq(0).should('contain', 'This is the title of a second blog')
          cy.get('.blogShown').eq(1).should('contain', 'This is the title of a third blog')
          cy.get('.blogShown').eq(2).should('contain', 'This is the title of a blog')
        })
      })
    })
  })
})