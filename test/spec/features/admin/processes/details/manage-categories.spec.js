(function() {
  'use strict';
  fdescribe('ManageCategoryMappingModalInstanceCtrl', function(){
    var scope, controller, manageCategoryMappingModalInstanceCtrl, process, categories, q, selectedCategories, modalInstance, categoryManager;
     
    beforeEach(module('org.bonitasoft.features.admin.processes.details.information.categories'));
    beforeEach(inject(function($rootScope, $controller, $q) {
      scope = $rootScope.$new();
      controller = $controller;
      q = $q;
      var cat1 = {id:111, name: 'catego1'},
        cat2 = {id:222, name: 'catego2'},
        cat3 = {id:333, name: 'catego3'};
      categories = [cat1, cat2, cat3];
      selectedCategories = [cat1];
      process = {};
      categoryManager = jasmine.createSpyObj('categoryManager', ['updateCategories']);
      modalInstance = jasmine.createSpyObj('modalInstance', ['dismiss', 'close']);
      manageCategoryMappingModalInstanceCtrl = controller('ManageCategoryMappingModalInstanceCtrl', {
        $scope : scope,
        process : {},
        initiallySelectedCategories : selectedCategories,
        allCategories : categories,
        categoryManager : categoryManager,
        $modalInstance : modalInstance
      });
    }));

    it('should init controller', function(){
      expect(manageCategoryMappingModalInstanceCtrl.tags).toEqual(['catego1', 'catego2', 'catego3']);
      expect(manageCategoryMappingModalInstanceCtrl.selectedTags).toEqual(['catego1']);
    });

    it('should dismiss modal', function(){
      manageCategoryMappingModalInstanceCtrl.cancel();
      expect(modalInstance.dismiss).toHaveBeenCalledWith('cancel');
    });

    it('should close modal and update categories', function(){
      var promisesAndCategories = {};
      categoryManager.updateCategories.and.returnValue(promisesAndCategories);
      manageCategoryMappingModalInstanceCtrl.updateCategories();
      expect(modalInstance.close).toHaveBeenCalledWith(promisesAndCategories);
      expect(categoryManager.updateCategories).toHaveBeenCalledWith(categories, selectedCategories, manageCategoryMappingModalInstanceCtrl.selectedTags, manageCategoryMappingModalInstanceCtrl.tags);
    });
  });
})();