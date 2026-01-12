const getNav = document.querySelectorAll(".navLink");
const sections = document.querySelectorAll("main section");

const navLinks = Array.from(getNav);

let Activelink;

let cordsSection = [];
function getPos() {
  sections.forEach((section) =>
    cordsSection.push({
      page: section.textContent,
      link: `#${section.id}`,
      positionTop: Math.floor(section.offsetTop),
      positionBottom: section.offsetHeight + section.offsetTop,
      height: Math.floor(section.offsetHeight)
    })
  );
}

window.onload = () => getPos();