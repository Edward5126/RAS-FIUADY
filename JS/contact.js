function topicChange(event) {
    document.getElementById("asuntoLabelCustom").classList.add("inputFilled");

    if (event.target.value == 6) {
        document.getElementById("asuntoPers").classList.remove("oculto");
        document.getElementById("asuntoLabelCustom").classList.remove("inputFilled");
    } else {
        // document.getElementById("asuntoPers").classList.add("oculto");
    }
}

function inputFilled(event, numberInput) {
    if (event.target.value.trim() != '') {
        document.querySelectorAll(".labelCustom")[numberInput].classList.add("inputFilled");
    } else {
        document.querySelectorAll(".labelCustom")[numberInput].classList.remove("inputFilled");
    }
}

function verifyForm() {
    let filled = false;

    if (document.querySelector(".inputForm").value == 6) {
        filled = [...document.querySelectorAll(".inputForm")].every(input => input.value.trim() !== '');
    } else {
        filled = [...document.querySelectorAll(".inputForm")].filter(input => input.id !== 'asuntoPers').every(input => input.value.trim() !== '');
    }

    if (filled == true) {
        document.getElementById("buttonForm").removeAttribute("disabled");
    } else {
        document.getElementById("buttonForm").setAttribute("disabled", true);
    }
}
