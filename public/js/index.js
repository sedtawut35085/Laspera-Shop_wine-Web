

// Fixed Nav
const navBar = document.querySelector(".navigation");
const navHeight = navBar.getBoundingClientRect().height;
window.addEventListener("scroll", () => {
  const scrollHeight = window.pageYOffset;
  if (scrollHeight > navHeight) {
    navBar.classList.add("fix-nav");
  } else {
    navBar.classList.remove("fix-nav");
  }
});

// Scroll To
const links = [...document.querySelectorAll(".scroll-link")];
links.map(link => {
  link.addEventListener("click", e => {
    e.preventDefault();

    const id = e.target.getAttribute("href").slice(1);
    const element = document.getElementById(id);
    const fixNav = navBar.classList.contains("fix-nav");
    let position = element.offsetTop - navHeight;

    if (!fixNav) {
      position = position - navHeight;
    }

    window.scrollTo({
      top: position,
      left: 0,
    });

    navigation.classList.remove("show");
    nav.classList.remove("show");
    document.body.classList.remove("show");
  });
});


const search = document.querySelector(".search");
const search_cancel = document.querySelector(".search-cancel");
const search_bar = document.querySelector(".search-bar")
const tgg = document.querySelector(".toggle")
const nav = document.querySelector(".navigation")

search.addEventListener("click", () => {
	search_bar.classList.add('search-bar-active')
});

search_cancel.addEventListener("click", () => {
	search_bar.classList.remove('search-bar-active')
});

tgg.addEventListener("click", ()=>{
	tggs = document.querySelector(".toggle")
	tggs.classList.toggle('active');
	nav.classList.toggle('active')



})
