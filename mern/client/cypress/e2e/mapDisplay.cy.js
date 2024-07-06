/* eslint-disable no-undef */
describe('Map page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
    cy.get('[data-test="hero"]')
      .find('Button')
      .contains('Get started')
      .click();
    cy.wait(6000);
  });

  it('renders correctly', () => {
    cy.get('[data-test="app-bar"]').should('exist');
    cy.get('[data-test="favorites"]').should('exist');
    cy.get('[data-test="help-modal"]').should('be.visible');
    cy.get('[data-test="google-map"]').should('be.visible');
    cy.get('[data-test="drawer"]').should('be.visible');
  });

  it('does not show help again', () => {
    // visible at the begining
    cy.get('[data-test="help-modal"]').should('be.visible');
    cy.get('[data-test="help-modal"]')
      .find('Button')
      .contains('Get started')
      .click();
    cy.get('[data-test="help-modal"]').should('not.exist');

    // visible if not click dont show this again
    cy.get('[data-test="app-bar"]').contains('ACCESS').click();
    cy.get('[data-test="app-bar"]').contains('Map').click();
    cy.get('[data-test="help-modal"]').should('be.visible');
    cy.get('[data-test="help-modal"]')
      .find('Button')
      .contains('Dont show this again')
      .click();
    cy.get('[data-test="help-modal"]').should('not.exist');

    // invisible when click dont show this again
    cy.get('[data-test="app-bar"]').contains('ACCESSNYC').click();
    cy.get('[data-test="help-modal"]').should('not.exist');
  });

  it('navigates back to landing page', () => {
    cy.get('[data-test="help-modal"]').should('be.visible');
    cy.get('[data-test="help-modal"]')
      .find('Button')
      .contains('Get started')
      .click();
    cy.get('[data-test="app-bar"]').contains('ACCESS').click();
    cy.url().should('eq', 'http://localhost:5173/');
  });

  it('displays the drawer correctly', () => {
    cy.get('[data-test="help-modal"]')
      .find('Button')
      .contains('Dont show this again')
      .click();
    cy.get('[data-test="drawer"]').should('be.visible');
    cy.get('[data-test="drawer"]').contains('Last viewed');
    cy.get('[data-test="picker"]').should('be.visible');
  });

  it('displays the map correctly', () => {
    cy.get('[data-test="help-modal"]')
      .find('Button')
      .contains('Dont show this again')
      .click();
    cy.get('[data-test="google-map"]').should('be.visible');
    cy.contains('Select Heatmap').should('be.visible');
    cy.get('[data-test="search-bar"]').should('be.visible');
    cy.get('[data-test="help-icon"]').should('be.visible');
    cy.get('[data-test="markers"]').should('be.visible');
  });
});