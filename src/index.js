import Button from "./components/button/button.js";

const b = new Button()

const r = document.getElementById("root")
r.appendChild(b.render({
    disabled: false, 
    title: "press", 
    type: "success",
    onClick: () => console.log("Hello, Leonid!!!")
}))
// r.innerHTML = b.render({
//     disabled: false, 
//     title: "press", 
//     type: "success",
//     onClick: () => console.log("Hello, Leonid!!!")
// })