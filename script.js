'use strict'
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,

    movementsDates: [
      "2019-11-18T21:31:17.178Z",
      "2019-12-23T07:42:02.383Z",
      "2020-01-28T09:15:04.904Z",
      "2020-04-01T10:17:24.185Z",
      "2022-05-08T14:11:59.604Z",
      "2022-09-06T17:01:17.194Z",
      "2022-09-10T23:36:17.929Z",
      "2022-09-12T10:51:36.790Z",
    ],
    currency: "EUR",
    locale: "pt-PT", // de-DE
  };
  
  const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,

    movementsDates: [
      '2019-11-01T13:15:33.035Z',
      '2019-11-30T09:48:16.867Z',
      '2019-12-25T06:04:23.907Z',
      '2020-01-25T14:18:46.235Z',
      '2020-02-05T16:33:06.386Z',
      '2020-04-10T14:43:26.374Z',
      '2020-06-25T18:49:59.371Z',
      '2020-07-26T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-US',
  };
  
  const account3 = {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
  };
  
  const account4 = {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
  };
  
  const accounts = [account1, account2, account3, account4];
  
  // Elements
  const labelWelcome = document.querySelector('.welcome');
  const labelDate = document.querySelector('.date');
  const labelBalance = document.querySelector('.balance__value');
  const labelSumIn = document.querySelector('.summary__value--in');
  const labelSumOut = document.querySelector('.summary__value--out');
  const labelSumInterest = document.querySelector('.summary__value--interest');
  const labelTimer = document.querySelector('.timer');
  
  const containerApp = document.querySelector('.app');
  const containerMovements = document.querySelector('.movements');
  
  const btnLogin = document.querySelector('.login__btn');
  const btnTransfer = document.querySelector('.form__btn--transfer');
  const btnLoan = document.querySelector('.form__btn--loan');
  const btnClose = document.querySelector('.form__btn--close');
  const btnSort = document.querySelector('.btn--sort');
  
  const inputLoginUsername = document.querySelector('.login__input--user');
  const inputLoginPin = document.querySelector('.login__input--pin');
  const inputTransferTo = document.querySelector('.form__input--to');
  const inputTransferAmount = document.querySelector('.form__input--amount');
  const inputLoanAmount = document.querySelector('.form__input--loan-amount');
  const inputCloseUsername = document.querySelector('.form__input--user');
  const inputClosePin = document.querySelector('.form__input--pin');
  
  
  
  /////////////////////////////////////////////////
  //////////////////FUNCTIONS//////////////////////

  //dates function
  const formatMovmentDate = function (date, locale){
    const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

    const daysPassed = calcDaysPassed(new Date(), date);
    console.log(daysPassed);

    if(daysPassed === 0)return 'Today'
    if(daysPassed === 1)return 'Yesteday'
    if(daysPassed <= 7)return `${daysPassed} days ago`;
    else{
    //   const day = `${date.getDate()}`.padStart(2, 0)
    //   const month = `${date.getMonth() + 1}`.padStart(2, 0);
    //   const year = date.getFullYear();
   
    //  return `${day}/${month}/${year}`;
    return new Intl.DateTimeFormat(locale).format(date);
    }

}
//formating currency
const formatCur = function(value, locale, currency){
  return new Intl.NumberFormat(locale, {
    style:'currency',
    currency:currency,
  }).format(value);
}

                                               //sort
const displayMovements = function (acc, sort = false){
  //to empty the preexisting HTML element
  containerMovements.innerHTML ='';
                            //we use slice to make a copy of movements array// 
  //sort                          
  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;


  movs.forEach(function(mov, i){
  const type = mov > 0 ? 'deposit': 'withdrawal'

  const date = new Date(acc.movementsDates[i]);  
  const displayDate = formatMovmentDate(date, acc.locale);

 const formatMov = formatCur(mov,acc.locale,acc.currency)

  const html =`
  <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i +1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formatMov}</div>
  </div>`;
//adds a row into movement element in HTML
//this methopd accepts two strings:1.position 2.elemet(string) which we want to put in
containerMovements.insertAdjacentHTML('afterbegin', html)
})
};


////////////////Computing Usernames///////////////

//const user = 'Steven Thomas Williams'
               
// const userName = user
// //user is a string so we use toLowerCase
// .toLowerCase()
// // split makes an arr of a string
// .split(' ')
// //we use map on arr and create a new array
// .map(name => name[0])
// // userName is an array and we use join method   
// .join('')
//WE PUT THIS IN A FUNCTION

const createUserNames = function(accs){
   //we use forEach because we do not want a new array we just want to modify the input
  accs.forEach(function(acc){ 
    //create a new property in every accounts objectS
    acc.username = acc.owner
    .toLowerCase()
    .split(' ')
    .map(name => name[0])
    .join('')
  })
   
};
createUserNames(accounts)

//display UI function
const updateUI = function(acc){
   // display movements
   displayMovements(acc)
    
   // display balance
   calcDisplayBalance(acc)
   
   //display summary
   calcDisplaySummary(acc)
   
}

//////////calculating balance///////////////////////

const calcDisplayBalance = function(acc){
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent =  formatCur(acc.balance,acc.locale,acc.currency)
};



const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
  .filter(mov => mov > 0)
  .reduce((acc,mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes,acc.locale,acc.currency)
  
  const out = acc.movements
  .filter(mov => mov < 0)
  .reduce((acc,mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out),acc.locale,acc.currency)

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => mov * acc.interestRate / 100)
    .filter((int, i, arr) => {
      console.log(arr);
      return int >= 1
    })
    .reduce((acc, int) => acc + int,0 )
  
  labelSumInterest.textContent = formatCur(interest,acc.locale,acc.currency)
};

//setting timers
const startLogOutTimer = function (){
  const tick = function(){
    const min = String(Math.trunc(time / 60)).padStart(2,0);
    const sec = String(time % 60).padStart(2,0);
    //in each call, print the remaining time to UI
  labelTimer.textContent = `${min}:${sec}`;
  
    // when time is 0 stop timer log out user
    if( time === 0){
      clearInterval(timer)
      labelWelcome.textContent = `Log in to get started`;
      
      containerApp.style.opacity = 0;
    }

     //decrece 1 sec
  time--;
  };

  //set time to 5 minutes
  let time = 300;
  //call the timer every second
  tick()
  const timer = setInterval(tick, 1000);
  return timer;

};





/////////////Event handler//////////////////////////////
////////////////////////////////////////////////////////

/////////////////// Implementing Login/////////////////////

//html form element is great because it works on click and enter 

let currentAccount, timer;


btnLogin.addEventListener('click', function(e){
  // prevent form from submitting
 e.preventDefault();
  
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value)
  console.log(currentAccount);

  //use optional chaining because the pin property we only be read if currnet acc exists
  if (currentAccount?.pin === +inputLoginPin.value) {
    //display Ui  and welcome massage
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    
    containerApp.style.opacity = 100;

    // current date
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute:'numeric',
      day:'numeric',
      //month: 'numeric',
      month: 'numeric',
      year:'numeric',
      //weekday:'long',
    }
    //const locale = navigator.language;
    
    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now)
    // const day = `${now.getDay()}`.padStart(2, 0)
    // const month = `${now.getMonth()+1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const minute = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = now;
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minute}`;
        
    //clear login  fields and remove focus on pin
    inputLoginUsername.value = inputLoginPin.value = ''
    inputLoginPin.blur();
    
    // Timer
    //if exist clear
    if(timer) clearInterval(timer)
    //if cealred start new
    timer = startLogOutTimer();
    
    //calling UpdatUI function with current account
    updateUI(currentAccount)
  }
});

//IMPLEMENTING LOAN

btnLoan.addEventListener('click', function(e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value) 

  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
   
  setTimeout (function(){ //add the movement to 
    currentAccount.movements.push(amount)

  //add loan date
  currentAccount.movementsDates.push(new Date().toISOString());
    


  // update UI
  updateUI(currentAccount)

      // Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }
  inputLoanAmount.value = '';
});


btnTransfer.addEventListener('click', function(e){
  //common to use to prevent form elemet from reloading
  e.preventDefault();
  const amount = +inputTransferAmount.value; //Number() + turns to number
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
    );
  inputTransferAmount.value = inputTransferTo.value = '';

  if(
    amount > 0 && 
    receiverAcc &&
    currentAccount.balance >= amount && 
    receiverAcc?.username !== currentAccount.username
    ) {
      currentAccount.movements.push(-amount);
      receiverAcc.movements.push(amount);

      //add transfer date
      currentAccount.movementsDates.push(new Date().toISOString());
      receiverAcc.movementsDates.push(new Date().toISOString());


    //Update UI function with current account
      updateUI(currentAccount)

      // Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }
})

btnClose.addEventListener('click', function(e) {
  e.preventDefault();
 

  if (inputCloseUsername.value === currentAccount.username && +inputClosePin.value === currentAccount.pin   
  ){
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    console.log(index);

    //delete account
    accounts.splice(index, 1)
    
    //Hide UI
    containerApp.style.opacity = 0;

    
  }

  inputClosePin.value = inputCloseUsername.value = '';
});

let sorted = false;

//sort
btnSort.addEventListener('click', function(e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted)
  //to invert if false then true, if true then false
  sorted = !sorted;

})

//Pait rows
//labelBalance.addEventListener('click', function(){
    //[...document.querySelectorAll('.movements__row')].forEach((row, i) => {
        //if(i % 2 === 0) row.style.backgroundColor = 'orangered';
        //if(i %  3 === 0) row.style.backgroundColor = 'blue';
   // });
//})


/////////More Ways of Creating and Filling///////////////

labelBalance.addEventListener('click', function () {
  const movmentsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => +el.textContent.replace('€', '')
  );

  console.log(movmentsUI);
  //we can use map on this because it is a real array
  //console.log(movmentsUI.map(el => Number(el.textContent.replace('€', ''))));

  //another way of making anode list into an array
  const movmentsUI2 = [...document.querySelectorAll('.movements__value')]
  console.log(movmentsUI2);
});




//fake always logged in

// currentAccount = account1
// updateUI(currentAccount);
// containerApp.style.opacity = 100;





