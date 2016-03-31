export default class TaskList {

  static get() {
    browser.get((browser.params.urls || {}).userTaskList || '#/user/tasks/list');
    browser.waitForAngular();
    return new TaskList();
  }

}
