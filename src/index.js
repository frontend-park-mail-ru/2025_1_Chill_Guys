import { VALID_TYPES } from "../modules/validation.js";
import Button from "./components/button/button.js";
import Link from "./components/link/link.js";
import TextField from "./components/textField/textField.js";

/*const r = document.getElementById("root")

/*
const b = new Button();
r.appendChild(b.render({
    disabled: false,
    title: "press",
    type: "success",
    onClick: () => console.log("Hello, Leonid!!!")
}));

const l = new Link();

r.appendChild(l.render({
    title: "Ссылка",
    onClick: () => console.log("Hello, Nikita!!!")
}));


const form = document.createElement("div");
form.classList.add("form");

const tf = new TextField();
const tfElement = tf.render({
    name: "email",
    type: "email",
    title: "Почта:",
    placeholder: "Ваша почта",
    defaultValue: "lepesha@gmail.com"
});
form.append(...tfElement.childNodes);

const tf2 = new TextField();
const tfElement2 = tf2.render({
    type: "password",
    title: "Пароль:",
    placeholder: "Ваш пароль",
    defaultValue: "super_puper_password",
    onChange: (ev) => {
        console.log(ev)
    }
});
form.append(...tfElement2.childNodes);

r.appendChild(form);

const btn = new Button();
r.appendChild(btn.render({
    disabled: false,
    title: "Войти",
    type: "success",
    onClick: () => console.log("Hello, Leonid!!!")
}));

tf.markError("Плохая гадость")*/

const root = document.getElementById("root");
const tf = new TextField();

root.appendChild(tf.render({
    type: "text",
    title: "Поле ввода:",
}));

tf.markError("Какая-то ошибка!");