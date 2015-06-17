(function (win) {

  'use strict';

  /**
   * Mock for the $modal from ui.bootstrap
   * {@link http://stackoverflow.com/questions/21214868/angularjs-ui-bootstrap-mocking-modal-in-unit-test}
   * @type {Object}
   */
  var fakeModal = {
    result: {
      then: function(confirmCallback, cancelCallback) {
        //Store the callbacks for later when the user clicks on the OK or Cancel button of the dialog
        this.confirmCallBack = confirmCallback || angular.noop;
        this.cancelCallback = cancelCallback || angular.noop;
      }
    },
    close: function( item ) {
      //The user clicked OK on the modal dialog, call the stored confirm callback with the selected item
      this.result.confirmCallBack( item );
    },
    dismiss: function( type ) {
      //The user clicked cancel on the modal dialog, call the stored cancel callback
      this.result.cancelCallback( type );
    }
  };

  win.fakeModal = fakeModal;
})(window);
