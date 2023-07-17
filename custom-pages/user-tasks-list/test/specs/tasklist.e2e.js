/* global cy */
describe('tasklist custom page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  afterEach(() => {
    cy.window().then((win) => {
      win.localStorage.clear();
    });
  });

  it('should load a list of tasks', () => {
    cy.get('tr.Line').should('have.length', 26);
  });

  it('should have a selected element by default', () => {
    cy.get('.Line.info').should('exist');
  });

  it('should change pagination', () => {
    cy.get('.bo-Settings').click();

    cy.get('.bo-TableSettings-content > .btn-group > .btn-group:first-child > button').click();

    cy.get('tr.Line').should('have.length', 25);
  });

  it('should have sorted tasks by default', () => {
    cy.get('tr.Line:first-of-type td:nth-of-type(3)').should('contain.text', 'A Étape1');
  });

  it('should have tasks sorted in DESC order when clicking on the active sort button', () => {
    cy.get('.bo-SortButton--active').click();

    cy.get('.Line td:nth-child(3)').first().should('have.text', 'Z Contract Mail');
  });

  it('should update tasks when navigating using pagination', () => {
    cy.get('.bo-Settings').click();
    cy.get('.bo-TableSettings-content > .btn-group > .btn-group:first-child > button').click();

    cy.get('.TaskTable ~ .GroupAction .PaginationInfo-pagination .pagination-next a').click();

    cy.get('tr.Line').should('have.length', 1);
  });

  it('should toggle Details view menu when clicking expand', () => {
    let originalWidth = 0;
    cy.get('.TaskList').then(($element) => {
      originalWidth = $element.width();
    });

    cy.get('.SizeBar-reduce').click();

    cy.get('.TaskList').then(($element) => {
      expect($element.width()).to.be.greaterThan(originalWidth);
    });

    cy.get('.SizeBar-expand').click();

    cy.get('.TaskList').then(($element) => {
      expect($element.width()).to.equal(originalWidth);
    });
  });

  it('selectAll should select all tasks', () => {
    cy.get('th input[type=checkbox]').click();

    cy.get('.Line input[type=checkbox]').should('have.length', 26);
  });
});
