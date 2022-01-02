//Allow user to enter numbers 1 through 100, and enter the numbers into the input div.
window.onload = () => {
    const instructions= document.getElementById("instructions");
    const buckets = document.createElement("div");
    const instruct = document.createElement("h3");
    instruct.innerText = "Testing";
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.addEventListener('input', () => {
        console.log("testiong");
    });
    instructions.appendChild(instruct);
    instructions.appendChild(input);
}