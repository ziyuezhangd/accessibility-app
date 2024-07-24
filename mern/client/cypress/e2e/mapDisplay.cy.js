/* eslint-disable no-undef */
describe('Map page', () => {
  beforeEach(() => {
    cy.viewport('macbook-15');
    cy.visit('http://localhost:5173/map');
    cy.wait(5000);
  });

  it('renders correctly', () => {
    cy.get('[data-test="app-bar"]').should('exist');
    cy.get('[data-test="favorites"]').should('exist');
    cy.get('[data-test="help-icon"]').should('exist');
    cy.get('[data-test="help-modal"]').should('be.visible');
    cy.get('[data-test="google-map"]').should('exist');
    cy.get('[data-test="drawer"]').should('exist');
    cy.get('[data-test="ad"]').should('exist');
  });

  it('does not show help again', () => {
    // visible at the begining
    cy.get('[data-test="help-modal"]').should('be.visible');
    cy.get('[data-test="help-buttons"]').find('Button').contains('Get Started').click();
    cy.get('[data-test="help-modal"]').should('not.exist');

    // visible if not click dont show this again
    cy.get('[data-test="app-bar"]').contains('ACCESS').click();
    cy.get('[data-test="app-bar"]').contains('Map').click();
    cy.get('[data-test="help-modal"]').should('be.visible');
    cy.get('[data-test="help-buttons"]').find('Button').contains('Dont Show This Again').click();
    cy.get('[data-test="help-modal"]').should('not.exist');

    // invisible when click dont show this again
    cy.get('[data-test="app-bar"]').contains('ACCESSNYC').click();
    cy.get('[data-test="help-modal"]').should('not.exist');
  });

  it('navigates back to landing page', () => {
    cy.get('[data-test="help-buttons"]').find('Button').contains('Get Started').click();
    cy.get('[data-test="app-bar"]').contains('ACCESS').click();
    cy.url().should('eq', 'http://localhost:5173/');
  });

  it('displays the drawer correctly', () => {
    cy.get('[data-test="help-buttons"]').find('Button').contains('Dont Show This Again').click();
    cy.get('[data-test="drawer"]').should('be.visible');
    cy.get('[data-test="drawer"]').contains('Last Viewed');
    cy.get('[data-test="picker"]').should('be.visible');
    cy.get('[data-test="ad"]').should('be.visible');
  });

  it('displays the map correctly', () => {
    cy.get('[data-test="help-buttons"]').find('Button').contains('Dont Show This Again').click();
    cy.get('[data-test="google-map"]').should('be.visible');
    cy.get('[data-test="heatmap-dropdown"]').should('be.visible');
    cy.get('[data-test="category-field"]').should('be.visible');
    cy.get('[data-test="search-bar"]').should('be.visible');
    cy.get('[data-test="accessibility-key"]').should('be.visible');
  });
});