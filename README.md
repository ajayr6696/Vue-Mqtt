# Frontend Vue and MQTT-Powered Sensor Data Scaling App
This Vue.js application leverages MQTT communication to read raw sensor data from a 4-20 mA sensor and scales it to provide a meaningful output value. The raw value simulates a temperature value and is used to demonstrate the capabilities of the app.

## Features

- MQTT Basics: Utilizes MQTT communication for message publishing and subscription.
- Raw Publisher: Simulates a 4-20 mA sensor and publishes random values over MQTT.
- Scaling and Display: Reads the raw sensor value, scales it to the desired output value, and displays the results with color-coded indicators.
- Color-Based Warnings: Provides color-based warnings for input and output indicators based on defined thresholds.
- User Configuration: Allows users to adjust scaling parameters and the oscillation speed of the raw publisher.
- Continuous Oscillation: Demonstrates continuous oscillation of the raw value between 0 and 20 mA.
- Publishing Frequency: Publishes the raw value once per second.

## Frontend

The frontend of this application was developed using the Vue.js framework.

## Setup

### Project setup
```
npm install
```
### Compiles and hot-reloads for development
```
npm run serve
```
### Install Mqtt
Understand MQTT and how it can be used in the browser.
Instructions for installing Mqtt: https://cedalo.com/blog/how-to-install-mosquitto-mqtt-broker-on-windows/ 
You can learn more about MQTT here: https://www.hivemq.com/mqtt-essentials/

## Features
- Launch the app to see how the MQTT-powered sensor data scaling works.
- Observe the color-coded indicators and the oscillating raw value.
- The input value is received via MQTT from the RawPublisher component.
- The output value is displayed as the scaled value.
- If the input value is less than 4, the input indicator text color turns red.
- If the input value is in the top 25% of the value range, the output indicator box background color turns red.
- If the input value is in the bottom 25% of the value range, the output indicator box background color turns blue.
- Use the provided form to adjust the following values:
  1. Raw Low (default: 4mA)
  2. Raw High (default: 20 mA)
  3. Engineering Low (default: -70 deg C)
  4. Engineering High (default: 70 deg C)
  5. Oscillation speed of raw publisher (default: 0.1 mA/s)
- Explore the code to understand how MQTT communication, scaling, and color-based warnings are implemented.
