
const signInBtn = document.getElementById("signin");
const signUpBtn = document.getElementById("signup");
const classsignin = document.querySelector(".signin");
const classsignup = document.querySelector(".signup");
signInBtn.addEventListener("click", () => {
	document.querySelector(".pinkbox").style.transform = "translateX(0%)";
	classsignup.classList.add("nodisplay")
	classsignin.classList.remove("nodisplay");
});

signUpBtn.addEventListener("click", () => {
	document.querySelector(".pinkbox").style.transform = "translateX(80%)";
	classsignup.classList.remove("nodisplay")
	classsignin.classList.add("nodisplay");
});