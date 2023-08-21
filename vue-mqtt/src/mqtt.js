import Paho from 'paho-mqtt'

export default class IWS_MQTT {
  /** This class is a wrapper for the Paho MQTT class to provide extra
   *  functionality to the publish, subsribe and onMessage methods.
   * 
   * Paho JS MQTT Docs: https://www.eclipse.org/paho/files/jsdoc/Paho.MQTT.Client.html
   * 
   * @param {string} host the hostname of the MQTT broker. //IP address of my laptop using which it is connected to WiFi
   * @param {int} port the port of the MQTT broker. // I am using the port 1883 for listening calls using mqtt protocol
   * 
   * Publishers and subscribers are terminology used to describe different types of MQTT clients, depending on whether they are 
   * actively posting messages or have subscribed to receive them. The same MQTT client can perform both of these tasks.
   * A publish occurs when a device (or client) wishes to communicate data to a server (or broker). 
   * A subscription is what is used when the process is performed backwards. 
   * Multiple clients can connect to a broker and subscribe to subjects they are interested in under the pub/sub model.
   * When a broker's connection with a client that is subscribing breaks, the broker will buffer messages and send them to the client once
   * the connection is restored. The broker may close the connection and send subscribers a cached message with instructions from the 
   * publisher if the connection between the publishing client and the broker is abruptly severed.
   */
  constructor(host, port) {
    this.host = host
    this.port = port
    this.connected = false
    this.client = new Paho.Client(host, port, "clientjs"); // clientjs will identify the value will and set it to  '/mqtt'
    this.client.onMessageArrived = this.handleMessage.bind(this)
    this.callbackMap = new Map()
    this.onMessage = null
    this.subbedTopics = []
  }

  _defaultConnect() {
    this.connected = true
    console.log('Connected!')
  }

  // Connecting to Mqtt Mosquitto, after I set-up the necessary envionments and connections.
  // Mqtt brocker was setup and turned on throughout the assessment
  connect(callbackFn = null) {
    console.log(`Connecting to ws://${this.host}:${this.port}`);
    let successCallbackFn = this._defaultConnect
    if (callbackFn) {
      successCallbackFn = () => {
        this._defaultConnect()
        callbackFn()
      }
    }
    let options = {
      timeout: 3,
      onSuccess: successCallbackFn
    }
    this.client.connect(options)
  }
// Subscribe to the given topic in the mqtt server.
  sub(topic, qos = 0, callbackFn = null) {
    this.client.subscribe(topic, { qos: qos })
    this.subbedTopics.push(topic)
    if (callbackFn) {
      this.callbackMap.set(topic, callbackFn)
    }
  }
  // This unsubscribe method Stop receiving messages that are sent to the destinations listed by the filter by unsubscribing.
  unsub(topic, callbackFn = null) {
    const index = this.subbedTopics.indexOf(topic);
    if(index > -1){ // only splice array and unsubscribe, when item with the topic sent is found
      this.client.unsubscribe(topic)
      this.subbedTopics.splice(index, 1); // Remove one item only in specified index of the topic
      this.callbackMap.delete(topic); // Remove the topic from the Map also.
    }
  }

  addSubCallback(topic, callbackFn) {
    if (this.subbedTopics.indexOf(topic) != -1) {
      this.callbackMap.set(topic, callbackFn)
    } else {
      console.log(`Callback cannot be added to topic:
      '${topic}'
      because it does not exist.`)
    }
  }
// Used for publishing a message to the destination's consumers in the Message
  pub(topic, payload, qos = 0, retain = false) {
    if (this.connected) {
      this.client.publish(topic, payload, qos, retain)
    } else {
      console.log(`MQTT not connected. Failed to publish:
      topic: ${topic}
      payload: ${payload}`)
    }
  }

  handleMessage(message) {
    try {
      const callbackFn = this.callbackMap.get(message.destinationName)
      if (callbackFn) {
        callbackFn(message.destinationName, message.payloadString)
      } else if (this.onMessage) {
        this.onMessage(message.destinationName, message.payloadString)
      }
    } catch (e) {
      console.log(`Handler for topic ${message.destinationName} failed. Error: `, e)
    }
  }
}