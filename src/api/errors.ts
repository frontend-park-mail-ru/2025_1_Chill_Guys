export enum AJAXErrors {
    NoError,
    ServerError,

    // Auth
    NoUser,
    UserAlreadyExists,
    Unauthorized,
    WrongPassword,

    // Product
    NoProduct,

    // Basket
    ProductQualityLimitOut,

    // Order
    NoOrder,
    InvalidOrder
};