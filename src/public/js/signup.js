const signupForm = document.getElementById('signupForm')
const username = document.getElementById('username')
const email = document.getElementById('email')
const password = document.getElementById('password')
const phone = document.getElementById('phone')
const check_password = document.getElementById('check_password')
const errors = document.getElementById('errors')


signupForm.addEventListener('submit', (e) => {
    let messages = []
    if (username.value == '' || username.value.length < 4) {
        messages.push('Full name require more than 4 characters')
        username.style.backgroundColor = '#ffcccb'
    }
    if (phone.value == '' || phone.value.length < 4) {
        messages.push('Phone require more than 4 characters')
        phone.style.backgroundColor = '#ffcccb'
    }
    if (email.value == '' || email.value.length < 4) {
        messages.push('Email require more than 4 characters')
        email.style.backgroundColor = '#ffcccb'
    }
    if (password.value == '' || password.value.length < 4) {
        messages.push('Password require more than 4 characters')
        password.style.backgroundColor = '#ffcccb'
    }
    // verify password
    if (password.value != check_password.value) {
        messages.push('Passwords do not match')
    }
    
    if(messages.length > 0) {
        e.preventDefault()
        errors.style.color = '#ff534f'
        errors.innerText = messages.join('. ')
    }
})

$('#header').prepend('<div id="menu-icon"><span class="first"></span><span class="second"></span><span class="third"></span></div>');
	
$("#menu-icon").on("click", function(){
$("nav").slideToggle();
$(this).toggleClass("active");
});

