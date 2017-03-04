//client.js
var io = require('socket.io-client');
var socket = io.connect('http://mswsservice.azurewebsites.net/', { reconnect: true });
var gpio = require('ms-gpio');

var deviceDetails = { description: "get", deviceId: "0", isProcessed: true };

socket.on("processRecord", function (operation) {
    performOperation(operation);
});


function performOperation(operation) {
    var deviceDetails = [];

    switch (operation.description) {
        case "get":
            deviceDetails = getRegisteredDevices();
            break;
        case "post":
            deviceDetails.push(getDeviceDetails(operation.deviceId));
            break;
        default:
            break;
    }

    socket.emit('operationProcessed',
        {
            'deviceId': operation.deviceId,
            'description': operation.description,
            'deviceDetails': deviceDetails,
            'status': 'success',
            'raspId': operation.raspId
        });
}

function getDeviceDetails(deviceId) {
    var deviceId = deviceId;
    gpio.setup(deviceId, gpio.OUTPUT_MODE);
    return setApplianceState(deviceId, !gpio.read(deviceId));
}

function getRegisteredDevices() {
    var devices = [
        {
            deviceId: 15, status: false, device: "fan"
        },
        {
            deviceId: 16, status: false, device: "bulb"
        },
        {
            deviceId: 18, status: false, device: "washer"
        },
        {
            deviceId: 19, status: false, device: "tv"
        }
    ];

    for (var i = 0; i < devices.length; i++) {
        gpio.setup(devices[i].deviceId);
        devices[i].status = gpio.read(devices[i].deviceId);
    }

    return devices;
}

function setApplianceState(pinNo, setState) {
    gpio.write(pinNo, setState);
    return { "status": setState, "deviceId": pinNo };
}