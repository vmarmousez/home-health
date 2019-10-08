const jobsRunner = require('./lib/jobs-runner');
const {writeFactory} = require('./lib/influxdb');

jobsRunner.run([{
    name: 'humidity',
    getValue: async () => Math.floor(Math.random() * 10),
    storeValue: writeFactory('yolo', 'front').write,
    interval: 2000
}]);