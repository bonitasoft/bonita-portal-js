export default class TaskList {

  static get() {
    browser.get((browser.params.urls || {}).userTaskList || '#/user/tasks/list');
    browser.waitForAngular();
    return new TaskList();
  }

  collapseDetailPanel() {
    element(by.css('.TaskDetails .SizeBar-reduce')).click();
  }

  tableLines() {
    return element.all(by.css('.Line'));
  }

  selectDoneTasksFilter() {
    element(by.css('.TaskFilters li a#done-tasks')).click();
  }
}
