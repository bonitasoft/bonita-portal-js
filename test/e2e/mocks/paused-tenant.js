module.exports = {
  request: {
    path: '/API/system/maintenance',
    method: 'GET'
  },
  response: {
    data: {
      'maintenanceState': 'ENABLED',
      'maintenanceMessage': '',
      'maintenanceMessageActive': false
    }
  }
};
