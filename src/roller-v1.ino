/*
 * Project roller-v1
 * Description: A dice roller controlled by a webpage.
 * Author: Ben Tzudiker
 * Date: Jan 27 2019
 */

#define PIN_SERVO D0
#define PIN_DISPENSE_BUTTON D1

const String TOPIC = "omnaria/roller-v1";
const unsigned int DISPENSE_DELAY = 500;

Servo servo;


void setup() {

  servo.attach(PIN_SERVO);
  servo.write(175);

}

void loop() {


}


void dispense() {



}
