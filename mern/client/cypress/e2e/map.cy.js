/* eslint-disable no-undef */
describe('Map page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
    cy.get('#hero')
      .find('Button')
      .contains('Get started')
      .click();
  });

  it('renders correctly', () => {
    cy.get('#app-bar').should('be.visible');
    cy.get('#help-modal').should('be.visible');
    cy.get('#google-map').should('be.visible');
    cy.get('#drawer').should('be.visible');
  });

  it('does not show help again', () => {
    // visible at the begining
    cy.get('#help-modal').should('be.visible');
    cy.get('#help-modal')
      .find('Button')
      .contains('Get started')
      .click();
    cy.get('#help-modal').should('not.exist');

    // visible if not click dont show this again
    cy.get('#app-bar').contains('ACCESS').click();
    cy.get('#app-bar').contains('Map').click();
    cy.get('#help-modal').should('be.visible');
    cy.get('#help-modal')
      .find('Button')
      .contains('Dont show this again')
      .click();
    cy.get('#help-modal').should('not.exist');

    // invisible when click dont show this again
    cy.get('#app-bar').contains('ACCESSNYC').click();
    cy.get('#help-modal').should('not.exist');
  });

  it('navigates back to landing page', () => {
    cy.get('#app-bar').contains('ACCESS').click();
    cy.url().should('eq', 'http://localhost:5173/');
  });
});

describe('Map page started', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/map');
    cy.get('#help-modal')
      .find('Button')
      .contains('Get started')
      .click();
  });

  it('displays the drawer correctly', () => {
    cy.get('#drawer').should('be.visible');
    cy.get('#picker').should('be.visible');
  });
  // it('displays the map correctly', () => {
    
  // });
  // it('allows interaction with markers', () => {
  // });
});