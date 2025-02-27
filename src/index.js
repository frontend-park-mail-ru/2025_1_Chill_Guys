import { VALID_TYPES } from "../modules/validation.js";
import Button from "./components/button/button.js";
import Form from "./components/form/form.js";
import Link from "./components/link/link.js";
import TextField from "./components/textField/textField.js";
import ProductCard from "./components/productCard/productCard.js";

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

/*const root = document.getElementById("root");
const tf = new TextField();

root.appendChild(tf.render({
    type: "text",
    title: "Поле ввода:",
}));

tf.markError("Какая-то ошибка!");*/

// const root = document.getElementById("root");
//
// // Создаём форму (в конструктор передаём её поля и кнопки)
// const loginForm = new Form([
//     {
//         type: "text",
//         id: "email",
//         name: "Почта",
//         defaultValue: "lenya@leshak.ru",
//         validType: VALID_TYPES.EMAIL_VALID,
//         errorMessage: "Введите действительную почту",
//     },
//     {
//         type: "password",
//         id: "password",
//         name: "Пароль",
//         defaultValue: "SuPeRPaSsWoRd2005",
//         validType: VALID_TYPES.PASSWORD_VALID,
//         errorMessage: "Пароль должен содержать минимум 8 символов, загравную букву и цифру",
//     },
//     {
//         type: "password",
//         id: "repeat_password",
//         name: "Повтор",
//         defaultValue: "SuPeRPaSsWoRd2005",
//         validType: VALID_TYPES.PASSWORD_VALID,
//         errorMessage: "Пароль должен содержать минимум 8 символов, загравную букву и цифру",
//     },
// ], [
//     { id: "signup", type: "success", name: "Регистрация" },
//     { id: "signin", type: "success", name: "Войти" }
// ]);
//
// let formMode = false;
//
// root.appendChild(loginForm.render((actionId) => {
//     if (actionId === "signup") {
//         loginForm.toogleFields(["repeat_password"]);
//
//         const regButton = loginForm.actionElement("signup");
//         const logButton = loginForm.actionElement("signin");
//         regButton.innerText = formMode ? "Регистрация" : "Вход";
//         logButton.innerText = formMode ? "Войти" : "Зарегистрироваться";
//
//         formMode = !formMode;
//     }
//     if (actionId === "signin") {
//         const value = loginForm.validate();
//         if (value) {
//             if (!formMode) {
//                 alert(`Успешный вход!\n\nПочта: ${value.email}\nПароль: ${value.password}`);
//             } else {
//                 alert(`Успешная регистрация!\n\nПочта: ${value.email}\nПароль: ${value.password}`);
//             }
//         }
//     }
// }));
//
// loginForm.hideFields(["repeat_password"])

const root = document.getElementById('root');
root.appendChild(new ProductCard().render(
    {}
));
