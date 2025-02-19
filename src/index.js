import Button from "./components/button/button.js";
import Link from "./components/link/link.js";

const b = new Button()

const r = document.getElementById("root")
r.appendChild(b.render({
    disabled: false, 
    title: "press", 
    type: "success",
    onClick: () => console.log("Hello, Leonid!!!")
}))

const l = new Link()

r.appendChild(l.render({
    title:"Ссылка",
    onClick: () => console.log("Hello, Nikita!!!")
}))
