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

  // it('allows interaction with markers', () => {
  //   cy.get('[data-test="markers"]').eq(200).click();
  // });
  
  it.only('allows interaction with history and favorites', () => {
    cy.get('[data-test="favorites"]').click();
    cy.contains('No favorite places added yet').should('be.visible');

    cy.contains('Last viewed').should('be.visible');
    cy.get('[data-test="google-map"]').should('be.visible');
    cy.contains('[data-test="list"]').should('not.exist');
    cy.get('[data-test="google-map"]').then(($map) => {
      const mapWidth = $map.width();
      const mapHeight = $map.height();
      for (let i = 0; i < 3; i++) {
        const randomX = Math.floor(mapWidth * 0.3 + Math.random() * mapWidth * 0.4);
        const randomY = Math.floor(mapHeight * 0.3 + Math.random() * mapHeight * 0.4);

        cy.get('[data-test="google-map"]').click(randomX, randomY);
        if (i === 0) {
          cy.contains('Last viewed').should('not.exist');
          cy.contains('Busyness').should('be.visible');
          cy.contains('Wheelchair accessible restrooms').should('exist');
          cy.contains('Submit Feedback').should('exist');
        }
        cy.get('[data-test="favorites-inside"]').click();
        // cy.contains('Add to favorites').should('be.visible');
        cy.get('[data-test="back"]').click();
        cy.contains('[data-test="list"]').should('exist');
      }
      cy.contains('[data-test="list"]').should('exist');
    });
  });
});