const assets = [
    "/icons/favicon_32x32",
    "/icons/favicon_64x64",
    "/icons/favicon_128x128",
    "/icons/favicon_256x256",
    "/icons/favicon_512x512",
    "/font/124cdf7b53c7aa89dcbc.ttf",
    "/font/198d18913afd00221956.woff",
    "/font/55c4dfe8ffe5c0e46fd2.eot",
    "/font/72dc95e787feabc2da4a.woff2",
    "/images/0218d6733a7f9bfdaf21705728b6bfa8.svg",
    "/images/09a2bc935a28dc7382ebcef663197793.svg",
    "/images/0a5545f8a545e2d5529550856e86772f.svg",
    "/images/12d193b020863d0d165d492b931af445.svg",
    "/images/19930edcdc41a6e99f8ad406441332c9.svg",
    "/images/368c61d78171c0b3f5bd7d407b70a379.svg",
    "/images/38e7825994fae86569a15b293e0584c5.svg",
    "/images/39da5086e29f04d414136177bd3e97a2.svg",
    "/images/4299f90e51e61a2b480aced25be20ec0.svg",
    "/images/456df3e9e205893a9fdc579dab338d80.svg",
    "/images/4c9cd7773c2273af8cb2b95980cbe75e.svg",
    "/images/51ff93b809dd7ccab7782dccf05b7118.svg",
    "/images/53319b3e9fb75dd79f9af83768f860bd.svg",
    "/images/58ee74752bfe44f0235e1af22e8e010c.svg",
    "/images/5f36644b0c7b85c222f6f0d0ee18557f.svg",
    "/images/67728e0ed78d6266334561489c3b2c14.svg",
    "/images/6fee860647520edfe86ac81a2c3827a3.svg",
    "/images/97f579e81f214a1f9c9bd829367dad1e.svg",
    "/images/b5d324a701b2642595f5e70ef05593e7.svg",
    "/images/c78b768ce83856501032bd6a5f7b0659.svg",
    "/images/c7d4b90cca9b028e71c0b173a3c30e3c.svg",
    "/images/d00422dfb5e0f1def8dac88b49633078.svg",
    "/images/e088d44e1d7fb5d64ae1d22ef6efe2f0.svg",
    "/images/e11abc2f65221efa84fa485850dac009.svg",
    "/images/e9c43a7ee622df6485ce1a4c4b08013e.svg",
    "/images/ee6813feea60671f23b4e5a7eb0e3825.svg",
    "/images/f3cfb03b992483de469917284b6e9965.svg",
    "/images/f807d6f6bf8e3fde64f752eab3f33cab.svg",
    "/images/f9fa217eb07b02315732d98cb37b33ec.svg",
    "/images/fe2a08dc93b7e496e7223cbd5583640b.svg",
]

self.addEventListener("install", (event: any) => {
    event.waitUntil(
        caches.open("v1").then(cache => cache.addAll([
            "/",
            "/index.html",
            "/index.css",
            "/index.js",
            ...assets,
        ]).catch(() => { })),
    );
});

self.addEventListener("fetch", (event: any) => {
    const url = new URL(event.request.url);
    if (!url.pathname.includes("api") && !url.pathname.includes("s3") && !url.pathname.includes(".") && url.origin === "bazaar-techpark.ru") {
        event.respondWith(caches.open("v1").then((cache) => cache.match("/index.html")));
    } else {
        event.respondWith(
            caches.open("v1").then((cache) => {
                return fetch(event.request)
                    .then((networkResponse) => {
                        if (!url.pathname.includes("auth")) {
                            cache.put(event.request, networkResponse.clone());
                        }
                        return networkResponse;
                    })
                    .catch(() => {
                        return cache.match(event.request);
                    });
            })
        );
    }
});