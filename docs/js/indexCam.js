document.addEventListener('DOMContentLoaded', function () {

    const placeholder = document.getElementById("text");
    if (!placeholder) return; 

    const words = ["vidéo", "photo", "cinéma", "création", "développement", ":)"];
    let index = 0;

    function type(word) {
        let i = 0;
        const writing = setInterval(() => {
            placeholder.textContent += word.charAt(i);
            i++;
            if (i >= word.length) {
                clearInterval(writing);
                setTimeout(erase, 1000);
            }
        }, 75);
    }

    function erase() {
        const deleting = setInterval(() => {
            placeholder.textContent = placeholder.textContent.slice(0, -1);
            if (placeholder.textContent.length === 0) {
                clearInterval(deleting);
                index = (index + 1) % words.length;
                type(words[index]);
            }
        }, 25);
    }
    type(words[index]);

});
