import Button from "./components/button/button.js";

const b = new Button()

const r = document.getElementById("root")
r.innerHTML = b.render({"title":"press", "color":"green"})
