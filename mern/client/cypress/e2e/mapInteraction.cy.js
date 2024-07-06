/* eslint-disable no-undef */
describe('Map page started', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/map');
    cy.get('[data-test="help-modal"]')
      .find('Button')
      .contains('Dont show this again')
      .click();
    cy.wait(6000);
  });

  it('allows interaction with heatmap dropdown', () => {
    cy.contains('Select Heatmap').should('be.visible');

    cy.contains('Select Heatmap').click();
    cy.contains('Busyness').should('be.visible');
    cy.contains('Noise').should('be.visible');
    cy.contains('Odor').should('be.visible');

    cy.contains('Busyness').click();
    cy.contains('Select Heatmap').should('not.exist');
    cy.contains('Busyness').should('be.visible');

    cy.contains('Busyness').click();
    cy.contains('Noise').click();
    cy.contains('Busyness').should('not.exist');
    cy.contains('Noise').should('be.visible');

    cy.contains('Noise').click();
    cy.contains('Odor').click();
    cy.contains('Noise').should('not.exist');
    cy.contains('Odor').should('be.visible');
  });

  it('allows interaction with help icon', () => {
    cy.get('[data-test="help-icon"]').click();
    cy.get('[data-test="help-modal"]').should('be.visible');
  });

  it('allows interaction with markers', () => {
    cy.get('[data-test="markers"]').eq(0).click();
  });

  it.only('allows interaction with favorites', () => {
    cy.get('[data-test="favorites"]').click();
    cy.contains('No favorite places added yet');
    // cy.get('[data-test="snack-bar"]').should('exist');
  });
  
  it('allows interaction with history drawer', () => {
    cy.get('[data-test="markers"]').eq(1).click();
    cy.get('[data-test="markers"]').eq(2).click();
    cy.get('[data-test="markers"]').eq(3).click();
  });
});