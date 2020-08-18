var events = require("events");
var readline = require("readline");
//demo.js
//A simple program to demonstrate the difference between
//how event-driven asynchronous NodeJS programs and those
//that you may be used to see.  It's important to understand
//what "event-driven" means.  Code (other than initialization)
//is run only when stuff happens.  

//readline has events for line, pause, resume, and close 
var rl = readline.createInterface({
    input: process.stdin,//use std in as this reader's input/readable stream
    output: process.stdout // std out as the reader's output/writable stream
});


console.log("What is the answer to the first question?");

//The problem here is that this code will run whenever data  is
//entered into stdin (we don't even have to hit enter). 

//this is a non-blocking event (asynchronous)
//"whenever data is entered into stdin, run this code"
process.stdin.on('data', (chunk) =>{

    console.log(`\nData Received: ${chunk}`);
    
});



//The second question prints immediately after the first without the
//command line "waiting" for data. Because nothing has been entered
//And we used an asynchronous event handler, we've given it no reason
//to wait. 

rl.question("What is the answer to the second question?", answer=>{
    //Opposed to the event handler above, questions are like "one-off"
    //event handlers.  They print the question and run the callback on the
    //response.  These can be chained together (see activityTracker.js)
    //similar to recursion
    
      console.log(`The full answer!  ${answer}`);

    //note that question will "block" and wait for a response from the user
    //this is more like what you are used to. It only accepts the response
    //after a new line has been entered. this is "command line friendly" 

    process.exit(0);
}); 

//We will almost always use readline.question to query the user on commandline
//because it's necessary to block and wait for the human.  But in a real
//node application, the majority of the code will be non-blocking, async
//code so that user actions in one area don't slow down other actions
