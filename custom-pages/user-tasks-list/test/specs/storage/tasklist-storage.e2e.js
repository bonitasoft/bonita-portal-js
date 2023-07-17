/* global cy */
describe('tasklist custom page with storage', () => {

  afterEach(() => {
    cy.window().then((win) => {
      win.localStorage.clear();
    });
    cy.reload();
  });

  it('should save display mode in local storage', () => {
    cy.visit('/');
    cy.get('.TaskDetailsPanel').should('not.have.class', 'TaskDetailsPanel--collapsed');
    cy.get('.TaskFilters').should('be.visible');

    cy.get('.SizeBar-reduce').click();
    cy.get('.FilterToggle').click();
    cy.reload();
    cy.get('.TaskDetailsPanel').should('have.class', 'TaskDetailsPanel--collapsed');
    cy.get('.TaskFilters').should('not.be.visible');
  });
});
