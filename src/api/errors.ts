export enum AJAXErrors {
    NoError,
    ServerError,

    // Auth
    NoUser,
    UserAlreadyExists,
    Unauthorized,
    WrongPassword,
    PermissionsDenied,

    // Product
    NoProduct,

    // Basket
    ProductQualityLimitOut,

    // Order
    NoOrder,
    InvalidOrder,

    TwiceReview,
}
