
// form state
let state = [
  {
    field: 'username',
    output: '',
    regex: /^(?=.{8,12})(?![_.&*^%$#@!()?><;'"~`])(?![_.]{2})[a-zA-Z0-9]+(?<![_.])$/,
    empty: true,
    status: false,
    error: 'Invalid Username',
    success: 'Success',
  },{
    field: 'email',
    output: '',
    regex: /^[a-zA-Z0-9]+\@[a-zA-Z]{1,12}\.[a-zA-Z]{2,5}$/,
    empty: true,
    status: false,
    error: 'Invalid Password',
    success: 'Success',
  },{
    field: 'password',
    output: '',
    regex: /^(?=.{8,20})(?![_.&*^!()?><;'"~`])[a-zA-Z0-9@#$%]+(?<![_.])$/,
    empty: true,
    status: false,
    error: 'Invalid Password',
    success: 'Success', 
  },{
    field: 'passwordCheck',
    output: '',
    regex: /[]/i,
    empty: true,
    status: false,
    error: 'Password does not match',
    success: 'Success', 
  }
]

// events

// event for input change
document.querySelectorAll('.input-text').forEach(item=>{
  item.addEventListener('keyup',(e)=>{

    pwChecker();

    // sets password check regex
    state.filter(item=> item.field === 'passwordCheck')[0].regex = new RegExp(`${document.querySelector('#password').value}`);

    // DOM elements for validation
    let identification = e.target.id;
    let text = e.target.value.trim();

    validator(e, identification, text, 'type');

  })
})

// event for submit button
form.addEventListener('submit',(e)=> (!state.every(item=> item.status === true)) ? e.preventDefault() : null)

// event for the random password generator
document.querySelector('#rand-btn').addEventListener('click',(e)=>{
  e.preventDefault();

  // creates random password and populates password and passwordCheck input fields
  let randomPassword = randomPasswordGenerator();
  document.querySelector('#password').value = randomPassword;
  document.querySelector('#passwordCheck').value = randomPassword;

  validator(e, 'password', randomPassword, "click");
  validator(e, 'passwordCheck', randomPassword, "click")

})

// event for the visibility of the password and toggle between visible and invisible
document.querySelector('#visible-btn').addEventListener('click',(e)=>{
  e.preventDefault()
  if(e.target.className === 'pw'){
    document.querySelector('#password').type='text';
    e.target.classList.toggle('pw');
    document.querySelector('.fa-eye').classList.toggle('hide');
    document.querySelector('.fa-eye-slash').classList.toggle('hide');
  } else {
    document.querySelector('#password').type='password';
    e.target.classList.toggle('pw');
    document.querySelector('.fa-eye').classList.toggle('hide');
    document.querySelector('.fa-eye-slash').classList.toggle('hide');
  }
})


// util functions

// function for styling input fields based on state
const styleVerify = (e, status, success, error, delivery, identification ) => {

  if(status){
        
    if(delivery === 'type'){
      e.target.parentElement.className = 'form-control success';
      e.target.nextElementSibling.nextElementSibling.nextElementSibling.textContent = success;

    } else if(delivery === 'click') {

      if(identification === 'passwordCheck'){
        document.querySelector('#passwordCheck-container').className = 'form-control success';
        document.querySelector('#pwcheckSmall').textContent = success;
      }
  
      if(identification === 'password'){
        e.target.parentElement.className = 'form-control success';
        e.target.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.textContent = success;
      }
  
    } else {
      return null
    }

  } else if (!status) {
    
    if(delivery === 'type'){
      e.target.parentElement.className = 'form-control error';
      e.target.nextElementSibling.nextElementSibling.nextElementSibling.textContent = error;

    } else if(delivery === 'click') {

      if(identification === 'passwordCheck'){
        document.querySelector('#passwordCheck-container').className = 'form-control error';
        document.querySelector('#pwcheckSmall').textContent = error;
      }
  
      if(identification === 'password'){
        e.target.parentElement.className = 'form-control error';
        e.target.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.textContent = error;
      }

    } else {
      return null
    }
  
  } else {
    return null;
  }

}

// reset the input styles when the input value is ''
resetInputField = (e) => {
  e.target.parentElement.className = 'form-control';
  e.target.nextElementSibling.nextElementSibling.nextElementSibling.textContent = '';
}

// function that randomly generates a password
const randomPasswordGenerator = () => {
  
  // making random char array to select from
  let randNum = [...Array(10).keys()].map(x=> String.fromCharCode(x + 48));
  let randAlphaUpper = [...Array(26).keys()].map(x=> String.fromCharCode(x + 64));
  let randAlphaLower = [...Array(26).keys()].map(x=> String.fromCharCode(x + 97));
  let randSym = [...Array(3).keys()].map(x=> String.fromCharCode(x + 35));
  let randChars = [...randNum, ...randAlphaUpper, ...randAlphaLower, ...randSym];
  let randPassword = '';

  // loop that randomly selects password from random char array
  for (let index = 0; index < 20; index++) {
    let randPicker = Math.floor(Math.random() * randChars.length);
    randPassword += randChars[randPicker];
  }
    
  return randPassword;
}

// prelim check for passwords
const pwChecker = () => {
  let pass = document.querySelector('#password').value;
  let passCheck = document.querySelector('#passwordCheck').value;
  let errorMsg = state.filter(item=> item.field === 'passwordCheck')[0].error;
  let successMsg = state.filter(item=> item.field === 'passwordCheck')[0].success;

  if(pass !== passCheck){
    document.querySelector('#passwordCheck-container').className = 'form-control error';
    document.querySelector('#pwcheckSmall').textContent = errorMsg;
  } else {
    document.querySelector('#passwordCheck-container').className = 'form-control success';
    document.querySelector('#pwcheckSmall').textContent = successMsg;
  }
}    

// validates input text when typing
const validator = (e, identification, text, delivery) => {
  state
    .filter(item=> item.field == identification)
    .forEach(item=>{
      let { regex } = item;
      item.output = text;
      (item.output) ? item.empty = false : item.empty = true;
      (identification === 'passwordCheck' && delivery === 'click') ?
        item.status = true :
        item.status = regex.test(item.output);
      (!item.empty) ? styleVerify(e, item.status, item.success, item.error, delivery, identification) : resetInputField(e);
    }) 
}


