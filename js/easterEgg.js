/* counter to track number of clicks on a element */
let count = 0;

/* function to increment counter */
function counter() {
    count+=1;
}

/* function for the easter egg */
function easterEgg(element) {
    
    /* When count is under 5, this event listener 
    refreshes class called easterEgg which shows
    the shaking animation when clicked */
    element.addEventListener("click", function a(e) {
        element.classList.remove("easterEgg");
        e.preventDefault;
        void element.offsetWidth;
        element.classList.add("easterEgg");
    });

    console.log("counter= " + count);

    /* When count is five or greater, the event listener 
    is overwritten and instead changes the layer clicked
    into display none */
    if (count >= 5) {   
        element.addEventListener("click", function b() {
            if ( element.style.display == 'none' ) {
                element.style.display = 'initial';
            } else {
                element.style.display = 'none';
            }
        });
    }
}
