/* global cy */
describe('tasklist custom page with localization', () => {
  afterEach(() => {
    cy.window().then((win) => {
      win.localStorage.clear();
    });
    cy.clearCookies();
    cy.reload();
  });

  it('should be localized', () => {
    cy.setCookie('BOS_Locale', 'fr');
    cy.visit('/');

    cy.get('.TaskFilters #todo-tasks').should('contain.text', 'A faire');
    cy.get('#form-tab').should('contain.text', 'Formulaire');
    cy.get('#btn-group-assigntome').should('contain.text', 'Prendre');
  });
});
