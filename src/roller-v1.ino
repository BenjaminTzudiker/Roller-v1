/*
 * Project roller-v1
 * Description: A dice roller controlled by a webpage.
 * Author: Ben Tzudiker
 * Date: Jan 27 2019
 */

// Pins
#define PIN_SERVO D0
#define PIN_DISPENSE_BUTTON D1

// Particle server info
const String TOPIC = "omnaria/roller-v1";

// Servo
const unsigned long DISPENSE_DURATION = 500; // Time in ms before reseting the dispenser
const unsigned int SERVO_ROTATION_MIN = 5; // Minimum servo rotation in degrees
const unsigned int SERVO_ROTATION_MAX = 175; // Maximum servo rotation in degrees
Servo servo;

// Hardware button debounce
const unsigned long DEBOUNCE = 100; // Delay in ms before the button functionality takes place
bool lastState = false; // Button state in the previous loop iteration (true means pressed)
bool alreadyDone = false; // Whether or not the button funcionality has happened this press
unsigned long lastPressTime = 0; // Last press time in ms, taken from millis() function


void setup() {

  servo.attach(PIN_SERVO); // Sets the pin for the servo
  servo.write(SERVO_ROTATION_MIN); // Resets the servo
  pinMode(PIN_DISPENSE_BUTTON, INPUT_PULLUP); // Sets the pin for the hardware button

}

void loop() {

  unsigned long millis = millis(); // Loop ms reading

  // Hardware button checking/debounce:

  bool isPressed = isPressed();

  // Checks if the button functionality should run
  if(isPressed && lastPressTime + DEBOUNCE <= millis && !alreadyDone) {

    dispense();
    alreadyDone = true;

  }
  // Checks if the button has just been released
  else if(!isPressed && lastState) {

    lastState = false;
    alreadyDone = false;

  }
  // Checks if the button has just been pressed
  else if(isPressed && !lastState) {

    lastState = true;
    lastPressTime = millis;

  }

}


// Attempts to activate the dispenser
void dispense() {



}

// Checks if the hardware button is pressed
bool isPressed() {

  return digitalRead(PIN_DISPENSE_BUTTON) != HIGH;

}
