/* eslint-disable no-undef */
describe('Map page started', () => {
  beforeEach(() => {
    cy.viewport('macbook-15');
    cy.visit('http://localhost:5173/map');
    cy.get('[data-test="help-buttons"]').find('Button').contains('Dont Show This Again').click();
    cy.wait(20000);
  });

  it('allows interaction with heatmap dropdown', () => {
    cy.get('[data-test="heatmap-dropdown"]').should('be.visible');

    cy.get('[data-test="heatmap-dropdown"]').click();
    cy.contains('Busyness').should('be.visible');
    cy.contains('Noise').should('be.visible');
    cy.contains('Odor').should('be.visible');
    cy.contains('None').should('be.visible');
    // Check further manually as it cannot capture the polylines on the map
  });

  it('allows interaction with help icon and help modal', () => {
    cy.get('[data-test="help-icon"]').click();
    cy.get('[data-test="help-modal"]').should('be.visible');
    cy.get('[data-test="instruction-card"]').should('be.visible');

    cy.contains('Pick a Date and Time').should('be.visible');
    cy.get('[data-test="front-paper"]').eq(0).should('be.visible');
    cy.get('[data-test="back-paper"]').eq(0).should('not.be.visible');
    cy.get('[data-test="instruction-card"]').eq(0).click();
    cy.wait(1000);
    cy.get('[data-test="back-paper"]').eq(0).should('be.visible');
    cy.get('[data-test="front-paper"]').eq(0).should('not.be.visible');

    cy.get('[data-test="help-next"]').click();
    cy.contains('Pick a Date and Time').should('not.exist');
    cy.contains('Save Your Favorites').should('be.visible');

    cy.get('[data-test="help-previous"]').click();
    cy.contains('Pick a Date and Time').should('be.visible');
    cy.contains('Save Your Favorites').should('not.exist');
  });

  it('allows interaction with ad banner', () => {
    cy.get('[data-test="ad"]').should('be.visible');
    cy.get('[data-test="email-textfield"]').should('be.visible');
    cy.get('[data-test="email-textfield"]:visible').type('test@email.com');
    cy.get('[data-test="email-textfield"]:visible input').should('have.value', 'test@email.com');
    cy.get('[data-test="ad"]').find('Button').contains('Sign Up').should('be.visible');
  });

  it('allows interaction with date&time picker', () => {
    cy.get('[data-test="picker"]').should('be.visible');
    cy.intercept('GET', '/api/busyness-ratings*').as('busynessEndpoint');
    cy.intercept('GET', '/api/noise-ratings/daily*').as('noiseEndpoint');
    cy.intercept('GET', '/api/odour-ratings*').as('odourEndpoint');

    cy.get('[data-test="picker"]:visible').find('input').clear();
    cy.get('[data-test="picker"]:visible').find('input').type('072820241033am');

    cy.wait('@busynessEndpoint', { timeout: 10000 })
      .its('request.url').should('include', '/api/busyness-ratings?datetime=2024-07-28T10%3A00%3A00');
    cy.wait('@noiseEndpoint', { timeout: 10000 })
      .its('request.url').should('include', '/api/noise-ratings/daily?datetime=2024-07-28T10%3A00%3A00');
    cy.wait('@odourEndpoint', { timeout: 10000 })
      .its('request.url').should('include', '/api/odour-ratings?datetime=2024-07-28T10%3A00%3A00');
  });

  it('allows interaction with category filter', () => {
    cy.get('[data-test="category-field"]').should('be.visible');
    cy.get('[data-test="markers"]').should('not.exist');

    cy.get('[data-test="category-field"]').click();
    cy.contains('All').should('be.visible');
    cy.contains('All').click();
    cy.get('[data-test="markers"]').should('be.visible');
    cy.get('[data-test="markers"]').should('have.length.gt', 500);
    // Check further manually as it cannot precisely click on a marker
  });

  it('allows interaction with accessibility key', () => {
    cy.get('[data-test="accessibility-key"]').should('be.visible');
    cy.get('[data-test="seating-button"]').should('be.visible');
    cy.get('[data-test="signal-button"]').should('be.visible');
    cy.get('[data-test="ramp-button"]').should('be.visible');
    // Check further manually as it cannot capture the circles on the map
  });
  
  it.only('allows interaction with history and favorites', () => {
    cy.get('[data-test="favorites"]').click();
    cy.contains('No favorite places added yet').should('be.visible');
    cy.get('[data-test="favorite-item"]').should('not.exist');

    cy.get('[data-test="drawer"]').contains('Last Viewed').should('be.visible');
    cy.get('[data-test="google-map"]').should('be.visible');
    cy.contains('[data-test="history-item"]').should('not.exist');

    cy.get('[data-test="google-map"]').then(($map) => {
      const mapWidth = $map.width();
      const mapHeight = $map.height();
      const randomX = Math.floor(mapWidth * 0.4 + Math.random() * mapWidth * 0.3);
      const randomY = Math.floor(mapHeight * 0.4 + Math.random() * mapHeight * 0.3);
      cy.get('[data-test="google-map"]').click(randomX, randomY);
    });
    cy.wait(15000);

    cy.get('[data-test="drawer"]').contains('Last Viewed').should('not.exist');
    cy.get('[data-test="drawer"]').contains('Location Details').should('be.visible');
    cy.get('[data-test="grades"]').should('be.visible');
    cy.get('[data-test="nearest-restrooms"]').should('exist');
    cy.get('[data-test="nearest-stations"]').should('exist');

    cy.get('[data-test="drawer"]').find('Button').contains('Submit Feedback').should('exist');
    cy.get('[data-test="feedback-form"]').should('not.exist');
    cy.get('[data-test="drawer"]').find('Button').contains('Submit Feedback').click();
    cy.get('[data-test="feedback-form"]').should('be.visible');
    cy.get('[data-test="feedback-form"]').find('Button').contains('Cancel').click();

    cy.get('[data-test="favorites-inside"]:visible').click();
    cy.contains('Added to favorites').should('exist');

    cy.get('[data-test="back-to-history"]:visible').click();
    cy.get('[data-test="drawer"]').contains('Last Viewed').should('be.visible');
    cy.get('[data-test="history-item"]').should('be.visible');
    cy.get('[data-test="history-item"]:visible').should('have.length', 1);

    cy.get('[data-test="favorites"]').click();
    cy.get('[data-test="favorite-item"]').should('be.visible');
    cy.get('[data-test="favorite-item"]:visible').should('have.length', 1);
  });
});