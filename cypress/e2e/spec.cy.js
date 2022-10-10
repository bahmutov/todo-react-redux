/// <reference types="cypress" />

import spok from 'cy-spok'
// import a function from the application code
// to help us construct an action to dispatch
import { removeTodo } from '../../src/store/reducers/todosSlice'

it('adds todos', () => {
  // add a few todos using the application UI
  cy.visit('/')
  cy.get('input[placeholder="Add new todo here"]')
    .type('Learn Cypress{enter}')
    .type('Learn JavaScript{enter}')
  // confirm the page works
  cy.get('[data-cy=todo]').should('have.length', 2)
  cy.contains('[data-cy="pending-count"]', '2')

  // we assume the application sets "window.store"
  // if running inside the Cypress test
  cy.log('**check the Redux state**')
  // get the state of the Redux store
  // https://on.cypress.io/window
  // https://on.cypress.io/its
  // https://on.cypress.io/invoke
  // and confirm the data inside the Redux store
  // using cy-spok plugin
  cy.window()
    .its('store')
    .invoke('getState')
    .should(
      spok({
        todos: {
          data: [
            {
              $topic: 'The second todo',
              text: 'Learn JavaScript',
              id: spok.number,
            },
            {
              $topic: 'The first todo',
              text: 'Learn Cypress',
              id: spok.number,
            },
          ],
        },
      }),
    )
    // grab the ID of the first todo item
    // grab the Redux store again and dispatch the remove todos action
    .its('todos.data.0.id')
    .then((id) => {
      cy.window().its('store').invoke('dispatch', removeTodo(id))
    })
  // once we remove the first todo, the UI should update
  // confirm the UI changes and the single todo remains
  cy.contains('[data-cy="pending-count"]', '1')
  cy.contains('[data-cy=todo]', 'Learn Cypress')
  // get the Redux store again and confirm the data in it
  cy.log('**redux store**')
  cy.window()
    .its('store')
    .invoke('getState')
    .should(
      spok({
        todos: {
          data: [
            {
              $topic: 'The first todo',
              text: 'Learn Cypress',
              id: spok.number,
            },
          ],
        },
      }),
    )
})
