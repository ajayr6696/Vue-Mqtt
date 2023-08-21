import Vue from "vue";
export const EventBus = new Vue(); // Exporting EventBus
import App from "./App.vue";
import IWS_MQTT from "./mqtt"

Vue.config.productionTip = false;
new Vue({
  render: function (h) {
    return h(App);
  },
  data() {
    return {
      mqtt: null
    }
  },
  created() {
    const HOST = '10.0.0.178'; //IP address of my laptop using which it is connected to WiFi
    const PORT = 9001; // I am using the port 1883 for listening calls using mqtt protocol
    this.mqtt = new IWS_MQTT(HOST, PORT);
    this.mqtt.connect(() => {
      console.log("ajay")
      this.$emit('mqtt-connected', true)
    })

  }
}).$mount("#app");