/* global cy */
describe('tasklist in full size mode', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('.SizeBar-reduce').click();
  });

  afterEach(() => {
    cy.window().then((win) => {
      win.localStorage.clear();
    });
  });

  it('should display a button on hovered lines', () => {
    cy.get('.Line:first-of-type').trigger('mouseover');

    cy.get('.Line:first-of-type').find('.Cell--with-actions button').should('have.length', 1);
  });

  it('should NOT display a button on hovered lines for done tasks', () => {
    cy.get('.TaskFilters li a#done-tasks').click();
    cy.get('.Line:first-of-type').trigger('mouseover');

    cy.get('.Line:first-of-type .Cell--with-actions button').should('not.exist');
  });

  it('should open task details pop up when clicking on table line', () => {
    cy.get('.Line:first-of-type').click();

    cy.get('.modal.TaskDetailsModal').should('exist');
  });
});
