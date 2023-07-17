/* global cy */
describe('context', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  afterEach(() => {
    cy.window().then((win) => {
      win.localStorage.clear();
    });
  });

  it('should display the form associated with a task', () => {
    cy.intercept('GET', '/API/form/mapping?c=1&f=processDefinitionId%3D8007855270751208272*type%3DTASK*', {fixture: 'form-mappings-task-2-mock.json'}).as('testAlias');

    cy.get('li[heading="Form"] a').click();
    cy.wait('@testAlias');
    cy.get('iframe').should('exist');
  });

  it('should display an alert if the form is not assigned to the current user', () => {
    cy.get('li[heading="Form"]').click();
    cy.get('.Viewer-overlay').trigger('mouseover');

    cy.get('.FormOverlay-message:first-of-type').should('have.class', 'FormOverlay-message');
  });

  it('should not display an alert if the form is assigned to the current user', () => {
    cy.get('tr.Line:last-of-type').click();

    cy.get('.TaskDetails .alert').should('not.exist');
  });

  it('should not display a case overview tab if there is no mapping', () => {
    cy.get('tr.Line:first-of-type').click();

    cy.get('#case-tab').should('not.exist');
    cy.get('.CaseViewer iframe').should('not.exist');
  });

  it('should display a case overview tab', () => {
    cy.get('tr.Line:last-of-type').click();

    cy.get('#case-tab a').click();
    cy.get('.CaseViewer iframe').should('exist');
  });
});
