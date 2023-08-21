<template>
  <div >
    <h1>HelloWorld status: {{ msg }}</h1>
    <!-- I have used the default h1 texts that was there in the question and have also created two float-value indicator boxes for input and output-->
    <!-- For top 25% and bottom 25% values, the said styling changes has been done. Different style class are chosen based on the conditions-->
    <!-- If generated rawActual value is less than rawLow, the engActual value has been hidden, instead of showing 0 as value.-->
    <!-- Below are the code changes for h1 texts-->
    <h1 :class="{textRed: rawActual<rawLow}">input: {{ rawActual }}</h1>
    <h1>
      <span :class="{'bgBlue': rawActual>=rawLow && rawActual < 0.25*(rawHigh-rawLow)+rawLow , 'bgRed': rawActual > rawHigh-0.25*(rawHigh-rawLow),}">output:</span> 
      <span :class="{'bgBlue': rawActual>=rawLow && rawActual < 0.25*(rawHigh-rawLow)+rawLow , 'bgRed': rawActual > rawHigh-0.25*(rawHigh-rawLow),}" v-show="rawActual>=rawLow"> {{ engActual }} </span>
    </h1>
    <!-- Below are the code changes for two float-value indicator boxes-->
    <div class='indicatorBoxes'>
      <div class='inputField'>
        <label style="width: 80px;"> Input</label>
        <input :class="{textRed: rawActual<rawLow, formInput: true}" type="number" :value="rawActual" step="0.01" readOnly='readOnly'/>     
      </div>
      <div class='inputField'>
        <label style="width: 80px;">Output</label>
        <input :class="{'bgBlue': rawActual>=rawLow && rawActual < 0.25*(rawHigh-rawLow)+rawLow , 'bgRed': rawActual > rawHigh-0.25*(rawHigh-rawLow), formInput: true}" type="number" :value="rawActual>=rawLow? engActual : ''" step="0.01" readOnly='readOnly' />
      </div>
    </div>
    <!-- Form was created in this component, instead of using another component as the question said changes needs to be done here only-->
    <!-- For the input fields, doing 2 way binding using v-model directly to the original values, changed them immediately before clicking submit button-->
    <!-- Using v-bind:value did not work in this case, as it did not allow to update the values in form-->
    <!-- Therefore I have used another object of these values (form{}) -->
    <!-- As all the fiels are numbers I have used input fields of type number -->
    <!-- The submit button in the form is disabled when wrong values are given and when the values are the same as the old-->
    <!-- When a field is given null value, I will show that error only, ignoring other errors, because the other errors may be because of the nulll value.-->
    <form @submit.prevent="submitForm">
      <h1> Current(mA) : </h1>
      <div class='inputField'>
        <label>Raw Low:</label>
        <input class='formInput' type="number" v-model.number="form.rawLow" name="rawLow" step="0.01" @input="onChange"/>     
      </div>
      <div class='inputField'>
        <label>Raw High:</label>
        <input class='formInput'type="number" v-model.number="form.rawHigh" name="rawHigh" step="0.01" @input="onChange" />
      </div>
      <!-- Error Messages that were found on Current values are displayed here. -->
      <!-- This field is rendered, only when there is error-->
      <!-- As stated earlier, when there is nullValue, that alone is shown ignoring this error. -->
      <p class='errorMsg' v-if="form.err[0] && !form.nullValues">{{ form.err[0] }}</p>
      <h1> Temperature(deg C) : </h1>
      <div class='inputField'>
        <label>Engineering Low:</label>
        <input class='formInput' type="number" v-model.number="form.engLow" name="engLow" step="0.01" @input="onChange" />
      </div>
      <div class='inputField'>
        <label>Engineering High:</label>
        <input class='formInput' type="number" v-model.number="form.engHigh" name="engHigh" step="0.01" @input="onChange" />
      </div>
      <!-- Error Messages that were found on Temperature values are displayed here. -->
      <!-- This field is rendered, only when there is error-->
      <!-- As stated earlier, when there is nullValue, that alone is shown ignoring this error. -->
      <p class='errorMsg' v-if="form.err[1] && !form.nullValues">{{ form.err[1] }}</p>
      <h1> Oscillation speed  of Raw Publisher(mA/sec) : </h1>
      <div class='inputField'>
        <label>Rate of change:</label>
        <input class='formInput' type="number" v-model.number="form.rateOfChange" name="rateOfChange" step="0.01" @input="onChange" />
      </div>
      <!-- Error Messages that were found on Oscillation Speed values are displayed here. -->
      <!-- This field is rendered, only when there is error-->
      <!-- As stated earlier, when there is nullValue, that alone is shown ignoring this error. -->
      <!-- This error is not shown even if there is issue with Current values because recttifying that may solve this issue.-->
      <p class='errorMsg' v-if="form.err[2]  && !form.nullValues && !form.err[0]">{{ form.err[2] }}</p>
      <!-- The nullValue error is shown in this field, which is below all the other fields.-->
      <p class='errorMsg' v-if="form.nullValues">All the values must not be null</p>
      <div class='submitButton'>
        <!-- Submit button is enabled only when there is no errors on all values that are sent, there is no null values and when there is change in atleast one of the values-->
        <button type="submit" @click="submitForm" :disabled="!(form.formUpdates==true && form.nullValues==false && form.err.every(i => i == '' ))">Submit</button>
      </div>
    </form>
  </div>
</template>

<script>
import {EventBus} from '../main.js'
export default {
  name: "HelloWorld",
  data() {
    return {
      msg: "init",
      rawActual: 0, // Received raw sensor value, mA
      rawLow: 4, // Minimum sensor reading, mA
      rawHigh: 20, // Maximum sensor readin, mA
      engActual: 0, // Current thermometer reading, deg C
      engLow: -70, // Minimum temperature of thermometer, deg C
      engHigh: 70, // Maximum temperature of thermometer, deg C
      rateOfChange: 0.1, //This has the Oscillation speed  of raw publisher (default: 0.1 mA/s).
      form: { // All the values in this form is got from the user and configured accordingly, on submitiing the form
        rawLow: 4, // Minimum sensor reading, mA, modified by the user in the form 
        rawHigh: 20, // Maximum sensor readin, mA, modified by the user in the form
        engLow: -70, // Minimum temperature of thermometer, deg C, modified by the user in the form
        engHigh: 70, // Maximum temperature of thermometer, deg C, modified by the user in the form 
        rateOfChange: 0.1, //This has the Oscillation speed  of raw publisher (default: 0.1 mA/s), modified by the user in the form
        err: ['','','',''], // Index  0 : Errors over current values, 1 : Errors over temperature values and 2 : Errors over Oscilattion speed
        formUpdates: false, // Boolean value which says whether any one of the form values is different from the original or previous values.
        nullValues: false, // Boolean value which says if any one of the values in the form is null.
      },
    };
  },
  mounted() {
    this.$root.$on("mqtt-connected", () => {
      this.$root.mqtt.sub("iws_ajay", 0, this.onRawValuePublisher); // Subscribing to the topic that was used to publish rawActual values.
      this.$root.mqtt.sub("iws-foo", 0, this.onIwsFoo);
      this.$root.mqtt.pub("iws-foo", "mounted");
      this.$root.mqtt.onMessage = (topic, payload) => {console.log(topic, payload)}
    });
  },
  methods: {
    onIwsFoo(topic, payload) {
      console.log(`Foo - topic: ${topic} payload: ${payload}`);
      this.msg = payload;
    },
    onRawValuePublisher(topic, payload) {
      console.log(`iws-ajay - topic: ${topic} payload: ${payload}`);
      //Parsing the string in the payload to JSON object, to get the rawActual value.
      var m = JSON.parse(payload);
      this.rawActual = m.value;
      //Computing the engActual value using the given formula.
      this.engActual= this.rawActual >= this.rawLow ? ((this.engHigh - this.engLow)/(this.rawHigh-this.rawLow)*(this.rawActual-this.rawLow))+this.engLow : null;
      //Rouding off the number to 2 decimal places
      this.engActual= Math.round(this.engActual * 100) / 100;

      console.log('current:',this.rawActual,'temp:',this.engActual);
    },
    submitForm(){ // Method that is called on clicking submit button.
      //Setting all the original values in the model to the ones that were given the form by the user.
      this.rawLow = this.form.rawLow;
      this.rawHigh = this.form.rawHigh;
      this.engLow = this.form.engLow;
      this.engHigh = this.form.engHigh;
      // If the user has changed the value of rateOfChange it is sent RawPublisher component, by emitting the value through EventBus
      if(this.rateOfChange != this.form.rateOfChange)
      {
        this.rateOfChange = this.form.rateOfChange;
        //EventBus.$emit('rocChanged',this.rateOfChange);
      }
      EventBus.$emit('valuesChanged',[this.rawLow,this.rawHigh,this.rateOfChange]);
      // Setting the flags used to default value, to continue with new form, after the ld form is submitted.
      this.form.formUpdates = false;
      this.form.nullValues = false;
    },
    onChange(event) {
      // Check if any of the form value, differs from old value and set the flag accordingly.
      if(this.form.rawLow != this.rawLow || this.form.rawHigh != this.rawHigh || this.form.engLow != this.engLow || this.form.engHigh != this.engHigh || this.form.rateOfChange != this.rateOfChange)
      {
        this.form.formUpdates=true;
      }
      else
      {
        this.form.formUpdates=false;
      }
      //Check if any of the form values is null and set true if it has null values.
      if(!this.form.rawLow || !this.form.rawHigh  || !this.form.engLow  || !this.form.engHigh || !this.form.rateOfChange )
      {
        this.form.nullValues=true;
      }
      else
      {
        this.form.nullValues=false;
      }
      //Finding the input field that  raised the event using the name.
      if(event.target.name == 'rawLow')
      {
        //If rawLow is greater than rawHigh, generate error messages in index 0 that is used for issues with current values, else clear this error message.
        if(this.form.rawLow >= this.form.rawHigh)
        {
          this.form.err[0] = 'Raw Low must be less than Raw High';
        } 
        else
        {
          this.form.err[0] = '';
        }
      }
      if(event.target.name == 'rawHigh')
      {
        //If rawLow is greater than rawHigh, generate error messages in index 0 that is used for issues with current values, else clear this error message.
        if(this.form.rawHigh <= this.form.rawLow)
        {
          this.form.err[0] = 'Raw High must be greater than Raw High';
        }
        else
        {
          this.form.err[0] = '';
        }
      }
      if(event.target.name == 'engLow')
      {
        //If engLow is greater than engHigh, generate error messages in index 1 that is used for issues with temperature values, else clear this error message.
        if(this.form.engLow >= this.form.engHigh)
        {
          this.form.err[1] = 'Engineering Low must be less than Engineering High';
        }
        else
        {
          this.form.err[1] = '';
        }     
      }
      if(event.target.name == 'engHigh')
      {
        //If engLow is greater than engHigh, generate error messages in index 1 that is used for issues with temperature values, else clear this error message.
        if(this.form.engHigh <= this.form.engLow)
        {
          this.form.err[1] = 'Engineering High must be greater than Engineering Low';
        }
        else
        {
          this.form.err[1] = ''; 
        }   
      }
      //The maximum value of rateOfChange cannot exceed the total range of the current that is generated.
      //Therefore, any change in 'rawLow' and 'rawHigh' also needs to be addressed here and check if rateOfChange satisfies this condition.
      if(event.target.name == 'rateOfChange' || event.target.name == 'rawLow' || event.target.name == 'rawHigh')
      {
        if(this.form.rateOfChange > this.form.rawHigh - this.form.rawLow)
        {
          this.form.err[2] = 'Oscillation speed cannot be more than the range of the current';
        }
        else
        {
          this.form.err[2] = ''; 
        }
      }
      console.log(parseFloat(event.target.value));
    },
  },
};
</script>

<style scoped>

form {
  border: solid;
  text-align: initial;
  width: 40%;
  padding: 3%;
  margin-top: 10px;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.textRed {
  color: red;
}
.bgRed {
  background-color: red;
}
.bgBlue {
  background-color: blue;
}
.errorMsg {
  color: red;
  font-family: monospace;
  font-size: small;
}
.inputField {
  margin-bottom: 10px;
  display: flex;
}
.submitButton {
  text-align: center;
  margin-top: 15px;
}
.formInput{
  margin-left: 5px;
  width: 20%;
}
.indicatorBoxes{
  border: solid;
  text-align: initial;
  width: 20%;
  padding: 3%;
}
</style>
