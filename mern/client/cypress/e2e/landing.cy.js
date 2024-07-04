/* eslint-disable no-undef */
describe('Landing page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
    // cy.contains('Discover Accessible Areas in NYC').should('be.visible');
  });

  it('renders correctly', () => {
    cy.get('#app-bar').should('be.visible');
    cy.get('#hero').should('be.visible');
    cy.get('#features').should('be.visible');
    cy.get('#blurb').should('be.visible');
    cy.get('#faq').should('be.visible');
    cy.get('#meet-the-team').should('be.visible');
  });

  it('navigates to /map when "Get started" button is clicked', () => {
    cy.get('#hero')
      .find('Button')
      .contains('Get started')
      .click();
    cy.url().should('include', '/map');
  });

  it('navigates to /map when "Map" is clicked', () => {
    cy.get('#app-bar').contains('Map').click();
    cy.url().should('include', '/map');
  });
});