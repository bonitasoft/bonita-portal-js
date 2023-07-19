/* global cy */
describe('tasklist custom page filters', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  afterEach(() => {
    cy.window().then((win) => {
      win.localStorage.clear();
    });
  });

  it('should search an element', () => {
    cy.get('#search').type('app{enter}');

    cy.get('tr.Line').should('have.length', 2);
  });

  it('should go to filtered task by case id', () => {
    cy.visit('/#?case=6');

    cy.get('tr.Line').should('have.length', 2);
  });

  it('should filter task by case id', () => {
    cy.get('#case').type('6{enter}');

    cy.get('tr.Line').should('have.length', 2);
  });

  it('should filter task by process', () => {
    cy.get('.Filter-process .btn').click();

    cy.get('.dropdown-menu > li').should('have.length', 3);

    cy.get('.dropdown-menu').should('be.visible');

    cy.get('.dropdown-menu > li:last-of-type a').click({force: true});

    cy.get('tr.Line').should('have.length', 2);
  });

  it('should have a selected list item', () => {
    cy.get('.TaskFilters .active').should('exist');
  });

  it('should filter my tasks', () => {
    cy.get('.TaskFilters li:nth-child(2) a').click();

    cy.get('.TaskFilters .active').should('contain.text', 'My tasks');

    cy.get('tr.Line').should('have.length', 2);
  });

  it('should set filter to done', () => {
    cy.visit('/#?filter=done');

    cy.get('.TaskFilters .active').should('contain.text', 'Done');

    cy.get('tr.Line').should('have.length', 5);
  });

  it('should filter done tasks', () => {
    cy.get('.TaskFilters li:nth-child(3) a').click();

    cy.get('.TaskFilters .active').should('contain.text', 'Done');

    cy.get('tr.Line').should('have.length', 5);
  });

  it('should toggle tasks filters menu when click toggle filters', () => {
    let originalWidth = 0;

    cy.get('.TaskList').then(($element) => {
      originalWidth = $element.width();
    });

    cy.get('.FilterToggle').click();

    cy.get('.TaskList').then(($element) => {
      expect($element.width()).to.be.greaterThan(originalWidth);
    });

    cy.get('.FilterToggle').click();

    cy.get('.TaskList').then(($element) => {
      expect($element.width()).to.equal(originalWidth);
    });
  });
});
