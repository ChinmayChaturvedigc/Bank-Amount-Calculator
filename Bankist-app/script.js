'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};



const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
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



const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);



const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

 
 
const calcDisplayBalance = function (acc){
  acc.balance = acc.movements.reduce((acc , mov ) => acc + mov ,0);
  labelBalance.textContent =`${acc.balance} EUR`
};


const calcDisplaySummary = function (acc){
  const incomes = acc.movements
  .filter(mov => mov > 0)
  .reduce((acc,mov) => acc + mov , 0)
  labelSumIn.textContent =`${incomes}€`
  
  const out =  acc.movements
  .filter(mov => mov < 0)
  .reduce((acc,mov) => acc + mov , 0)
  labelSumOut.textContent =`${Math.abs(out)}€`

  const interest = acc.movements
  .filter(mov => mov > 0)
  .map((deposit => (deposit *acc.interestRate)/100))
  .reduce((acc,int) => acc + int , 0)
  labelSumInterest.textContent =`${interest}€`
};


const createUserName = function(accs){ 
   accs.forEach(function(acc){
    acc.username = acc.owner.toLocaleLowerCase().split(' ').map(name => name[0]).join('');
  
  }); 
 };
createUserName(accounts)
console.log(accounts)

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};
// Login event
let currentAccount;

btnLogin.addEventListener('click' , function(e){
    e.preventDefault();

    currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
    
    if(currentAccount?.pin === Number(inputLoginPin.value)){
      labelWelcome.textContent =`welcome back ,${currentAccount.owner.split(" ")[0]}`;
      containerApp.style.opacity = 100;

      // Emptying the input filed after login

      inputLoginUsername.value = inputLoginPin.value = "";
      inputLoginPin.blur()

     // Update UI
     updateUI(currentAccount); 
    }
});
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
});

// loan button for loan atleast 10% should be deposite in the bank account.

btnLoan.addEventListener('click',function(e){
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount*0.1)){
    //add movement 
    currentAccount.movements.push(amount);
    //update UI
    updateUI(currentAccount);

    inputLoanAmount.value = ''
}
});



// delete button event listner


btnClose.addEventListener('click',function(e){
  e.preventDefault();
  // empty value boxes
  inputTransferAmount.value = inputTransferTo.value = '';
  if(inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin){
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // delete the account
    accounts.splice(index,1);
    //hide the UI
    containerApp.style.opacity = 0;
  // empty value boxes
  inputTransferAmount.value = inputTransferTo.value = '';
     
  }
});

// sorting the list of withdrawal and debits

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});


/////////////////////////////////////////////////


// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];


// const dip = [];

// for (const  mov of movements) if(mov<0) dip.push(mov)
// console.log(dip)


// const balance = movements.reduce(function (acc,cur,i,arr){
//   console.log(`iteration ${i} ,${acc}`);
//   return acc+cur;
//   },0)
//   console.log(balance)

// const checkDogs = function (dogsJulia, dogsKate) {
//   const dogsJuliaCorrected = dogsJulia.slice();
//   dogsJuliaCorrected.splice(0, 1);
//   dogsJuliaCorrected.splice(-2);
//   // dogsJulia.slice(1, 3);
//   const dogs = dogsJuliaCorrected.concat(dogsKate);
//   console.log(dogs);

//   dogs.forEach(function (dog, i) {
//     if (dog >= 3) {
//       console.log(`Dog number ${i + 1} is an adult, and is ${dog} years old`);
//     } else {
//       console.log(`Dog number ${i + 1} is still a puppy 🐶`);
//     }
//   });
// };
// // checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
// checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);


// It mutate the array and sort the array in alphabetic order.

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];



 
 
 for ( const dog of dogs){
   
   console.log(dog.weight)
   const recommendedFood = dog.weight ** 0.75 * 28;
   console.log(recommendedFood);
};


const found = dogs.find(dog => dog.owners.includes( 'Sarah'));
console.log(found);
console.log(`Sarah dog is eating too ${found.curFood < found.recommendedFood ? 'much' : 'little'}`)
