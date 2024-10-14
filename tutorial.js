// /// data types 

// // String 
// const addition = `${2+2}`;
// const name = 'Josh'; 

// console.log(`2+2 equals ${addition}`); 

// // Numbers
// const Number1 = 5;
// const Number2 = 0.5;

// console.log(Number1, Number2); 

// // Booleans 
// amIcool = false

// if (amIcool) {
//     console.log(`Hi, ${name}, you're cool`);
//     } else {
//     console.log(`Go away ${name}`);
// }

// // null - isnt a value, used as a placeholder 
// // let age = null; 
// // age = 20;

// //undefined - value is not defined 

// //objects - allows us to store many different values in one variable
// const Person = {
//     name: 'Josh',  //key and value, like a dictionary in python 
//     age: 17, 
// }

// //dot notation
// console.log(Person.age); //name of the object.value you want 

// // you can change the type of a variable while the code is running
// let testCode = 'Hello'; 
// testCode = 6;

// console.log(testCode);

// /// data types 

// /// operations and equality 

// // comparison operators  -> always returns a boolean
// const a = 10;
// const b = 10;

// loose equality -> only compares values, not data types 
// greater than
//console.log(b >= a);
// less than
//console.log(a > b); 
// equal to 
//console.log(a == b); 

// strict equality -> should use these more as they're more definitve and more sophisticated (compares VALUES and DATA types)
// console.log(a === b); 
// strict inequality 
// console.log(a !== b); 

// Logical Operators 
// OR  || -> AT LEAST ONE OPERAND ARE TRUE -> TRUE
// console.log(true || false);
// AND && -> ALL OPERANDS ARE TRUE -> TRUE 
// console.log(true && true && true);
// NOT ! -> REVERSES THE OPERAND
// console.log(!false)

// Logic and Control Flow 
const age = 17;


// If statements 
// if (age > 18) {
//     console.log('you may enter' );
// } else if (age === 18) {
//     console.log('you just turned 18');
// } else {
//     console.log('you arent allowed in');
// }

// FOR or WHILE loop
// let i = 0;
// while(i < 10) {
//     console.log(i);
//     i++; 
// }

// for(let i = 0; i < 10; i++) {
//     console.log(i);
// }

// Arrow Functions
const square = (number) => {
    return number*number;
}

const result = square(6);
console.log(result); 
