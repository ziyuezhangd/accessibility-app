/* eslint-disable no-undef */

describe('Landing page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
    cy.wait(500);
  });

  it('renders correctly', () => {
    cy.get('[data-test="app-bar"]').should('be.visible');
    cy.get('[data-test="intro"]').should('be.visible');
    cy.get('[data-test="features"]').should('be.visible');
    cy.get('[data-test="blurb"]').should('be.visible');
    cy.get('[data-test="faq"]').should('be.visible');
    cy.get('[data-test="meet-the-team"]').should('be.visible');
  });

  it('navigates to /map when "Get started" button is clicked', () => {
    cy.get('[data-test="intro"]')
      .find('Button')
      .contains('Get started')
      .click();
    cy.url().should('include', '/map');
  });

  it('navigates to /map when "Map" is clicked', () => {
    cy.get('[data-test="app-bar"]').contains('Map').click();
    cy.url().should('include', '/map');
  });

  it('navigates to /about when "About Us" is clicked', () => {
    cy.get('[data-test="app-bar"]').contains('About us').click();
    cy.url().should('include', '/about');
  });

  it('navigates to /resources when "Resources" is clicked', () => {
    cy.get('[data-test="app-bar"]').contains('Resources').click();
    cy.url().should('include', '/resources');
  });
});