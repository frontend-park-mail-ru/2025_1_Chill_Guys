"use strict";

export const VALID_TYPES = {
    EMAIL_VALID: 0,
    TELEPHONE_VALID: 1,
    PASSWORD_VALID: 2,
    NOT_NULL_VALID: 3,
    NAME_VALID: 4,
    NUMBER_VALID: 5
};

/**
 * Производит валидацию данных определённого типа.
 * @param {VALID_TYPES} validationType Тип валидации (email, телефон или пароль)
 * @param {String} data Данные для валидации
 * @example
 * // returns true
 * validate(VALID_TYPES.EMAIL_VALID, "lepeshka@gmail.com")
 * 
 * // returns false
 * validate(VALID_TYPES.PASSWORD_VALID, "1ldd")
 * @returns {Boolean}
 */
export default function validate(validationType, data) {
    switch (validationType) {
        case VALID_TYPES.EMAIL_VALID:
            return /^\w+(\.\w*)*@\w+(\.\w{2,})+$/g.exec(data) != null;
        case VALID_TYPES.TELEPHONE_VALID:
            return /^\+*[78]*\s*\(*\s*-*\d{,3}\)*\s*-*\d{3}\\-*\d{2}\\-*\d{2}$/g.exec(data) != null;
        case VALID_TYPES.PASSWORD_VALID:
            return /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{8,})$/.exec(data) != null;
        case VALID_TYPES.NAME_VALID:
            return /^[A-ZА-Я]+[a-zA-Zа-яА-Я]*$/.exec(data) != null;
        case VALID_TYPES.NOT_NULL_VALID:
            return data && data.length > 0;
        case VALID_TYPES.NUMBER_VALID:
            return /^[0-9]+.[0-9]*$/.exec(data) != null;
    }
}