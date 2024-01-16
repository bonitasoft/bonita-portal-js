# Developper Documentation



#Task list

The tasklist app (taskApp) is composed of 3 main pieces
- the task filters (directive)
- the task lists (directive)
- the task details (directive)

These 3 directives are gathered in the taskApp directive.

# App layout

The app allows user to switch between 2 layout. Each layout have is own set of default visible columns (task list properties). 
- the full list layout open task context or forms within a popup
- the list + context layout, allow to see both the task list and its context, side by side.

There is also a third mobile view, dédicated to mobile, which display the task filter, tasklist and the task context in stacked way.

This layout are managed by the taskApp directive.

## TaskApp directive

The taskApp directive gather several logic pieces,
- A store (resources/js/tasks/list/common/store.js) which maintains the app state and performs requests on the API.
- A preference (resources/js/tasks/list/common/js/common/preference.js), which handle the user preference handle data persistence inside a cookie (the visible columns, the current tab )
- A screen service, which monitors screen width and updates columns settings in tasklist
- A postMessage spy(resources/js/tasks/list/common/directive/bonita-form-spy.js) to handle communication from bonita forms.

The taskApp is reponsible of injecting data and handler to the taskfilters, taskList and taskDetails directives.

## TaskFilters directive (resources/js/tasks/list/task-filters.js)

The taskfilters directive is a small component that display which kind of tasks are displayed (all, my tasks, unassigned taks or done task). 

## TaskList directive (resources/js/tasks/list/taskList.js)

The tasklist component displays the list of tasks. TaskList rely on an external lib (src/js/common/keymaster.js) to allow multiple selection against checkbox.

## TaskDetails directive (resources/js/tasks/list/taskDetails.js)

The taskDetail directive display the task context and its associated form.
  - The case's data for the selected task
  - The case overview (iframe)
  - The case history (data gathered from Comment API and archivedDataFlow API)

The current tab is persisted to the preference.

The form's tab display the task form (from bonita portal). 

Iframes are displayed using a directive (resources/js/tasks/list/common/directive/bonita-iframe-viewer.js) which resizes automatically according the iframe content.
