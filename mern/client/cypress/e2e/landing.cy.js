/* eslint-disable no-undef */
describe('Landing page', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173');
    cy.get('Hero');
  });
});