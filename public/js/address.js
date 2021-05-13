const form = document.getElementById('form');
const address = document.getElementById('address');
const phone = document.getElementById('phone');


form.addEventListener('submit', e => {
	e.preventDefault();
	
	checkInputs();
});

function checkInputs() {
	// trim to remove the whitespaces
	const addressValue = address.value.trim();
	const phoneValue = phone.value.trim();
	
	if(addressValue === '') {
		setErrorFor(address, 'Address cannot be blank');
	} else {
		setSuccessFor(address);
	}
	
	if(phoneValue === '') {
		setErrorFor(phone, 'Phone cannot be blank');
	} else {
		setSuccessFor(phone);
	}
	
}

function setErrorFor(input, message) {
	const formControl = input.parentElement;
	const small = formControl.querySelector('small');
	formControl.className = 'form-control error';
	small.innerText = message;
}

function setSuccessFor(input) {
	const formControl = input.parentElement;
	formControl.className = 'form-control success';
}













// SOCIAL PANEL JS
const floating_btn = document.querySelector('.floating-btn');
const close_btn = document.querySelector('.close-btn');
const social_panel_container = document.querySelector('.social-panel-container');

floating_btn.addEventListener('click', () => {
	social_panel_container.classList.toggle('visible')
});

close_btn.addEventListener('click', () => {
	social_panel_container.classList.remove('visible')
});