{
    // general setup
    require('dotenv').config();
    const helper = require('./utils/helpers');

    // declaring the board
    const { RaspiIO } = require('raspi-io');
    const five = require('johnny-five');
    const board = new five.Board({
        io: new RaspiIO()
    });
    // setting up mqtt
    const mqtt = require('mqtt')
    const mqttClient = mqtt.connect(process.env.MQTT_HOST);



    const createRandomNumber = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    }

    const readFakeSensorData = () => {
        setInterval(() => {
            const currentValue = { value: createRandomNumber(1, 101) };
            mqttClient.publish('sensor/fake', JSON.stringify(currentValue));
            console.log(`published value ${JSON.stringify(currentValue)}`);
        }, 2500);
    }

    const init = () => {
        readFakeSensorData();
    };

    // calling init when board is up and running
    board.on('ready', () => {
        console.log(`Hello, I am a Raspberry Pi and my ip address is ${helper.getIpAddress().eth0[0]}`);
        console.log(`I use ${process.env.MQTT_HOST} as a broker`);
        init();
    });
}
