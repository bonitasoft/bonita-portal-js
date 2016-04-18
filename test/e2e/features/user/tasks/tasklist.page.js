class DetailsPanel {

  constructor() {
    this.element = element(by.css('.TaskDetailsPanel'));
  }

  collapse() {
    this.element.element(by.css('.SizeBar-reduce')).click();
  }

  expand() {
    this.element.element(by.css('.SizeBar-expand')).click();
  }

  isCollapsed() {
    return this.element.getAttribute('class')
      .then(classes => classes.split(' ').indexOf('TaskDetailsPanel--collapsed') !== -1);
  }
}

class TaskList {

  static get() {
    browser.get((browser.params.urls || {}).userTaskList || '#/user/tasks/list');
    browser.waitForAngular();
    return new TaskList();
  }

  tableLines() {
    return element.all(by.css('.Line'));
  }

  selectDoneTasksFilter() {
    element(by.css('.TaskFilters li a#done-tasks')).click();
  }

  detailsPanel() {
    return new DetailsPanel();
  }
}

export default TaskList;
