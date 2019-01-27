/*
 * Project roller-v1
 * Description: A dice roller controlled by a webpage.
 * Author: Ben Tzudiker
 * Date: Jan 27 2019
 */

// Pins
#define PIN_SERVO D0
#define PIN_DISPENSE_BUTTON D1
#define PIN_DISPENSE_STATUS D7

// Particle server info
const String TOPIC = "omnaria/roller-v1";

// Servo
const unsigned long DISPENSE_DURATION = 1000; // Time in ms before reseting the dispenser
const unsigned long DISPENSE_DELAY = 1000; // Time in ms after the dispense reset starts before another dispense can occur
const unsigned int SERVO_ROTATION_MIN = 5; // Minimum servo rotation in degrees
const unsigned int SERVO_ROTATION_MAX = 175; // Maximum servo rotation in degrees
Servo servo;
bool dispensing = false;
unsigned long lastDispenseTime = 0;

// Hardware button debounce
const unsigned long DEBOUNCE = 100; // Delay in ms before the button functionality takes place
bool lastState = false; // Button state in the previous loop iteration (true means pressed)
bool alreadyDone = false; // Whether or not the button funcionality has happened this press
unsigned long lastPressTime = 0; // Last press time in ms, taken from millis() function


void setup() {

  servo.attach(PIN_SERVO); // Sets the pin for the servo
  servo.write(SERVO_ROTATION_MIN); // Resets the servo
  pinMode(PIN_DISPENSE_BUTTON, INPUT_PULLUP); // Sets the pin for the hardware button
  pinMode(PIN_DISPENSE_STATUS, OUTPUT); // Sets the pin for the dispense status light

  Particle.function("dispense", dispenseCloud); // Exposes the dispenseCloud function to the JavaScript on the webpage
  Particle.function("publishState", publishState); // Exposes the publishState function to the JavaScript on the webpage

  // Cause the servo to reset in case the photon lost power mid way through a dispense
  dispensing = true;
  lastDispenseTime = millis() - DISPENSE_DURATION;

  publishState(""); // Send state info in case UI was open before the photon powered on

}

void loop() {

  unsigned long mil = millis(); // Loop ms reading

  // Dispenser checking:

  if(dispensing) {

    // Allow another dispense after the dispenser is fully reset
    if(lastDispenseTime + DISPENSE_DURATION + DISPENSE_DELAY <= mil) {

      dispensing = false;
      digitalWrite(PIN_DISPENSE_STATUS, LOW);
      publishState("");

    }
    // If the dispense time has elapsed, reset the dispenser
    else if(lastDispenseTime + DISPENSE_DURATION <= mil) {

      rotate(SERVO_ROTATION_MIN);

    }

  }

  // Hardware button checking/debounce:

  bool pressed = isPressed();

  // Checks if the button functionality should run
  if(pressed && lastPressTime + DEBOUNCE <= mil && !alreadyDone) {

    dispense();
    alreadyDone = true;

  }
  // Checks if the button has just been released
  else if(!pressed && lastState) {

    lastState = false;
    alreadyDone = false;

  }
  // Checks if the button has just been pressed
  else if(pressed && !lastState) {

    lastState = true;
    lastPressTime = mil;

  }

}


// Attempts to activate the dispenser
void dispense() {

  if(!dispensing) {

    rotate(SERVO_ROTATION_MAX);
    dispensing = true;
    lastDispenseTime = millis();
    digitalWrite(PIN_DISPENSE_STATUS, HIGH);
    publishState("");

  }

}

// Publicly exposed cloud function
int dispenseCloud(String args) {

  dispense();
  return 0;

}

// Sends state information to the cloud
int publishState(String args) {

  String data = "{\"dispensing\": ";
  data += dispensing ? "true" : "false";
  data += "}";

  Particle.publish( TOPIC, data, 60, PRIVATE );
  return 0;

}

// Sets the servo to the specified position; used in case fault checking is added at a later date
bool rotate(int degrees) {

  servo.write(degrees);
  return true;

}

// Checks if the hardware button is pressed
bool isPressed() {

  return digitalRead(PIN_DISPENSE_BUTTON) != HIGH;

}
