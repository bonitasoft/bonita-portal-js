import queryString from 'query-string';

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

  static get(searchParams) {
    let url = (browser.params.urls || {}).userTaskList || '#/user/tasks/list';
    browser.get(url + '?' + queryString.stringify(searchParams));
    browser.waitForAngular();
    return new TaskList();
  }

  tableLines() {
    return element.all(by.css('.Line'));
  }

  selectDoneTasksFilter() {
    element(by.css('.TaskFilters li a#done-tasks')).click();
  }

  getTasks() {
    return element.all(by.repeater('task in tasks'));
  }

  detailsPanel() {
    return new DetailsPanel();
  }
}

export default TaskList;
