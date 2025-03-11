'use strict';

import BasePage from "../basePage.js";
import Button, { BUTTON_VARIANT } from "../../components/button/button.js";
import Form from "../../components/form/form.js";
import { VALID_TYPES } from "../../../modules/validation.js";
import TemplateComponent from "../../components/templateComponent/templateComponent.js";
import ajax from "../../../modules/ajax.js";
import { SERVER_URL } from "../../settings.js";

class LoginPage extends BasePage {
  constructor() {
    super("loginPage/loginPage");
  }

  /**
   * Состояние страницы входа:
   * - error: ошибки формы
   */
  state = {
    error: "",
  };

  /**
   * Отправка формы входа на сервер
   * @param {object} form Значения формы для входа
   */
  async handleSignin(form) {
    const data = {
      email: form.email,
      password: form.password,
    };

    const response = await ajax.post("api/auth/login", data, {
      origin: SERVER_URL,
    });

    if (response.result?.status === 200) {
      this.showPage("/");
    } else if (
      response.result?.status === 400 ||
      response.result?.status === 401
    ) {
      this.children.form.markError("password", true, true);
      this.setState({
        error: "Указан неверный пароль. Пожалуйста, повторите ввод.",
      });
    } else {
      this.setState({
        error: "Ошибка сервиса. Пожалуйста, повторите попытку позже.",
      });
    }
  }

  /**
   * Функция генерации страницы входа
   * @returns {HTMLElement}
   */
  render(context) {
    return super.renderElement(
      context,
      {},
      {
        form: new Form(
          {
            otherClasses: "login_page__form__content",
            onChange: () => {
              this.setState({ error: "" });
            },
            onFinish: (id, isSuccess) => {
              if (!isSuccess) {
                if (id === "email") {
                  this.setState({
                    error:
                      "Введите действительный адрес почты. Пожалуйста, повторите ввод.",
                  });
                } else {
                  this.setState({
                    error:
                      "Пароль должен содержать как минимум 8 символов. Пожалуйста, повторите ввод.",
                  });
                }
              }
            },
          },
          [
            {
              type: "email",
              id: "email",
              name: "Электронная почта",
              validType: VALID_TYPES.EMAIL_VALID,
            },
            {
              type: "password",
              id: "password",
              name: "Пароль",
              validType: VALID_TYPES.NOT_NULL_VALID,
            },
          ],
        ),
        redirectMainButton: new Button({
          title: "Вернуться на главную страницу",
          variant: BUTTON_VARIANT.TEXT,
          size: "l",
          otherClasses: "login_page__title__redirect",
          onClick: () => context.showPage("/"),
        }),
        comment: new TemplateComponent({
          template: "loginPage/comment",
          error: this.state.error,
        }),
        rememberMeButton: new Button({
          title: "Забыли пароль?",
          variant: BUTTON_VARIANT.TEXT,
          size: "l",
          otherClasses: "login_page__form__rememberMeButton",
          onClick: () => context.showPage("/login"),
        }),
        signupButton: new Button({
          title: "Регистрация",
          variant: BUTTON_VARIANT.TEXT,
          size: "l",
          onClick: () => context.showPage("/register"),
        }),
        signinButton: new Button({
          title: "Войти",
          variant: BUTTON_VARIANT.PRIMARY,
          size: "l",
          onClick: () => {
            const dataValid = this.children.form.validate();
            if (dataValid) {
              this.handleSignin(dataValid);
            }
          },
        }),
      },
    );
  }
}

export default LoginPage;
