var tracker = require("tracker");
var events = require("events");
var readline = require("readline");

//This is a quick example of how to create a line reader (like getLine from
//java or fgets from C )

//In NodeJS a convenient  module that provides commandline input capabilities
//is the "readline" module.  Readers are often created from this interface
//implementation from the readline interface.

//We could also create a reader by processing the stdin stream directly
//running code on 'data', 'line', and 'end' events but this is a quick and
//convenient way to work with basic streams. Note that I could create a
//Readable/Writable stream attached to a file and assign it to input/output

//And frankly it handles prompting much better with the question function
const reader = readline.createInterface({
    input: process.stdin,//use std in as this reader's input/readable stream
    output: process.stdout // std out as the reader's output/writable stream
});

//the interesting thing about the readline is that it does the reading for you
// you just attach the streams and tell the readline how to serve requests and
//handle events. 

//the readLine module provides a lot of useful functions.  One of them is
//'question' which prompts the user with a provided string and runs the
//provided callback once the user enters their answer.

//Chaining callbacks is one of the ways that programmers can ensure that code
// will run in a specific order

//However as you can see there are drawbacks to chaining callbacks (readability,
//indentation, catching events at the right time  etc) that can be frustrating.
//Later in the semester we will discuss Promises which will help us with all of this

var response = function(){
    reader.question('What actvity did you perform? (Walking/Running/Swimming)', act => {
    
    reader.question('For how long? (in minutes)', time =>{
	
	reader.question('How far? (in miles)', distance => {
	    
	    reader.question('What is your weight today? (in pounds)', weight =>
			    {
				//Notice that current scope is still able to
				//capture data provided in previous callbacks.
				console.log(act);
				var current = new tracker(act.trim(),weight, distance, time);
				
				console.log(`Calories Burned: ${current.calculate()}`);
				
				//"every time you catch the exerciseChanged event, run this function
				current.on('exerciseChanged', () => {
				    console.log("Exercise Changed!");
				    console.log(`Calories Burned: ${current.calculate()}`);
				});
				
				reader.question('Do you want to (s)tart over, (c)hange your current entry, or exit?', answer=>{
				    var letter = answer.toLowerCase()[0];
				    switch (letter){
				    case "s":
					
					response();//recall this function and start over again
					//Note that I call the function inside the function,
					//similar to recursion
					break;
					
				    case "c":
					//change the current activity
					//Your job: add some code that will allow a user to change any member of the
					//tracker.  Add some cases too.  You'll need to add listeners that are listening
					//for the custom tracker events (provided for you).
					reader.question('What is your new activity (Swimming/Walking/Running)', rep=>{
					    current.setExercise(rep);  //setExercise emits the event 'exerciseChanged'
					    process.exit(0);           // see the Exercise module for more info
					});
					break;  //Without break, this falls through and exits BEFORE setExercise completes
				    default:
					console.log("Bye!");
					process.exit(0);
					
				    }
				})
			    })
	})
    })
})
}
//Chaining callbacks for this effect can sometimes be necessary
//because of how Node manages asynchronous function calls, pushing
//new requests onto the Event queue and running them when it's "their turn".
// This means that, depending on a variety of factors, things may run out of
// "order" as opposed to fully synchronous languages that you are used to,
//where everything in a file is executed in sequential order

//This makes more sense when you recognize that apps are often NOT
//synchronized and functions are called only when controls are activated
//Sometimes multiple controls are activated at once, and you don't want
//one of them to be held up by the other



response();  //start the response function


//In a typical, syncronous program, you could assume "current" exists here.
//Not so with JS.

//current.calculate() //throws error

