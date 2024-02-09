/* global cy */
describe('comments tab', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  afterEach(() => {
    cy.window().then((win) => {
      win.localStorage.clear();
    });
  });

  it('should display task\'s case human comments ordered by postDate descendant', () => {
    cy.get('li[heading="Comments"] a').click();

    cy.get('.Comment').should('have.length', 2);
    cy.get('.Comment:first-of-type .Comment-header').should('contain.text', 'Walter Bates Mar 9, 2016 4:33 PM');
    cy.get('.Comment:first-of-type .Comment-content').should('contain.text', 'This is a human comment');
    cy.get('.Comment:nth-of-type(2) .Comment-header').should('contain.text', 'Hellen Kelly Mar 10, 2016 12:22 PM');
    cy.get('.Comment:nth-of-type(2) .Comment-content').should('contain.text', 'This is another human comment');
  });

  it('should allow user to add a comment', () => {
    cy.intercept('GET', '/API/bpm/comment*', {statusCode: 200, fixture: 'commentList.json'}).as('getComments');
    cy.intercept('POST', '/API/bpm/comment', {statusCode: 200, body: {}}).as('createComment');
    cy.get('li[heading="Comments"] a').click();
    cy.wait('@getComments');

    cy.get('.CommentForm .form-control').type('Here is a new comment');
    cy.get('.CommentForm button[type="submit"]').click();
    cy.wait(['@createComment', '@getComments']);
  });

  it('should not allow user to add a comment on a task of an archived case', () => {
    // Filter done tasks
    cy.contains('.TaskFilters li a', 'Done').click();

    // Select task associated with an archived case
    cy.contains('.TaskTable tbody tr td', 'TaskFromArchivedCase').click();

    cy.get('li[heading="Comments"] a').click();

    cy.get('.CommentForm button[type="submit"]').should('be.disabled');
    cy.get('.CommentForm .CommentForm-disabledMsg').should('contain.text', 'The case is archived. You cannot add comments anymore');
  });

  it('should display archived human comments on a task of an archived case', () => {
    // Filter done tasks
    cy.contains('.TaskFilters li a', 'Done').click();

    // Select task associated with an archived case
    cy.contains('.TaskTable tbody tr td', 'TaskFromArchivedCase').click();

    cy.get('li[heading="Comments"] a').click();

    cy.get('.Comment').should('have.length', 2);
    cy.get('.Comment:first-of-type .Comment-header').should('contain.text', 'Walter Bates Mar 8, 2016 4:26 PM');
    cy.get('.Comment:first-of-type .Comment-content').should('contain.text', 'This is an archived human comment');
    cy.get('.Comment:nth-of-type(2) .Comment-header').should('contain.text', 'Hellen Kelly Mar 12, 2016 4:26 PM');
    cy.get('.Comment:nth-of-type(2) .Comment-content').should('contain.text', 'This is another archived human comment');
  });
});
