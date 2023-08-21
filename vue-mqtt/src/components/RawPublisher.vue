<template>
  <div>
    <p>Publisher: {{ rawActual }} </p>
  </div>
</template>

<script>
import {EventBus} from '../main.js'

export default {
  name: "RawPublisher",
  data() {
    return {
      rawLow: 4,
      rawHigh: 20,
      rawActual: -1,
      rateOfChange: 0.1, // This has the Oscillation speed  of raw publisher (default: 0.1 mA/s).
      precision: 100 // Precision set to 2 decimal places. Can change here if needed.
    };
  },
  mounted() {
    console.log("mounted");
    //Firstly, when the page is loaded, a random value between 0 to 20 is choses as raw actual value.
    //Math.random generates number from  0 to 1. I am multiplying it by 20 and adding precision to it.
    //To get a number with a fixed number of decimal places [a], the code is Math.floor(num * 10^a) / 10^a
    // I have combined the above two formulas to generate random numbers.
    this.rawActual = Math.floor(Math.random() * (20 * this.precision)) / (1*this.precision);
    console.log("Initial Value:",this.rawActual);
    this.rawPublisher();
    //In the question, changes were asked to be made only in the 2 child components, RawPublisher and HelloWorld.
    //Therefore, both props (used to send values from Parent to child) and emit (used to send values from child to parent) cannot be used.
    //So I have used EventBus, which is used for sending values between any 2 components.
    //Listening to event emitted through EventBus from HelloWorld component, whenever this value is updated.
    //EventBus.$on('rocChanged',rateOfChange=>{this.rateOfChange=rateOfChange});
    EventBus.$on('valuesChanged',changedValues=>{this.rawLow=changedValues[0],this.rawHigh=changedValues[1],this.rateOfChange=changedValues[2]});
  },
  methods: { 
    rawPublisher() {
      // This function oscillates rawActual between 0 & rawHigh and publishes result to mqtt.
      console.log("fix me");
      // Values generated and published to MQTT every 1 second 
      setInterval(() => {
        //To generate a random integer from a to b , the code is Math.floor(Math.random() * (b-a+1)) + a.
        //To get a number with a fixed number of decimal places [a], the code is Math.floor(num * 10^a) / 10^a
        //I have combined the above two formulas to generate random numbers from -rateOfChange to +rateOfChange, both inclusive. 
        //var change = (Math.floor(Math.random() * (2* this.rateOfChange * this.precision + 1) - 1 * this.rateOfChange * this.precision)  )/ (1*this.precision);
        var change = (Math.floor(Math.random() * 2) == 1 ? 1 : -1)*this.rateOfChange;
        console.log(change);
        //Now I add the generated number with the initial value. If the value exceeds the given range, I will change value accordingly, else set to the new value
        if(change + this.rawActual < 0 ) 
          this.rawActual = this.rawActual + this.rateOfChange;
        else if(change + this.rawActual > this.rawHigh)
          this.rawActual = this.rawActual - this.rateOfChange;
        else
          this.rawActual = this.rawActual + change;
        //The newly generated value is rounded to 2 decimal places, using formula that was stated earlier.
        this.rawActual = Math.round(this.rawActual * this.precision) / this.precision;
        //Publishing the value in a payload as said, in a JSON format along with the topic name iws_ajay.
        this.$root.mqtt.pub('iws_ajay', JSON.stringify({"value": this.rawActual }))
      }, 1000);         
    },
  },
};
</script>