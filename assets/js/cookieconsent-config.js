const CAT_NECESSARY = "necessary";
const CAT_ANALYTICS = "analytics";
const CAT_ADVERTISEMENT = "advertisement";
const CAT_FUNCTIONALITY = "functionality";
const CAT_SECURITY = "security";

const SERVICE_AD_STORAGE = "ad_storage";
const SERVICE_AD_USER_DATA = "ad_user_data";
const SERVICE_AD_PERSONALIZATION = "ad_personalization";
const SERVICE_ANALYTICS_STORAGE = "analytics_storage";
const SERVICE_FUNCTIONALITY_STORAGE = "functionality_storage";
const SERVICE_PERSONALIZATION_STORAGE = "personalization_storage";
const SERVICE_SECURITY_STORAGE = "security_storage";

// Define dataLayer and the gtag function.
window.dataLayer = window.dataLayer || [];
function gtag() {
    dataLayer.push(arguments);
}

// Set default consent to 'denied' (run this before any consent updates)
gtag("consent", "default", {
    [SERVICE_AD_STORAGE]: "denied",
    [SERVICE_AD_USER_DATA]: "denied",
    [SERVICE_AD_PERSONALIZATION]: "denied",
    [SERVICE_ANALYTICS_STORAGE]: "denied",
    [SERVICE_FUNCTIONALITY_STORAGE]: "denied",
    [SERVICE_PERSONALIZATION_STORAGE]: "denied",
    [SERVICE_SECURITY_STORAGE]: "denied",
});

function updateGtagConsent() {
    if (!window.gtag || typeof window.gtag !== "function") {
        return;
    }

    gtag("consent", "update", {
        [SERVICE_ANALYTICS_STORAGE]: CookieConsent.acceptedService(SERVICE_ANALYTICS_STORAGE, CAT_ANALYTICS) ? "granted" : "denied",
        [SERVICE_AD_STORAGE]: CookieConsent.acceptedService(SERVICE_AD_STORAGE, CAT_ADVERTISEMENT) ? "granted" : "denied",
        [SERVICE_AD_USER_DATA]: CookieConsent.acceptedService(SERVICE_AD_USER_DATA, CAT_ADVERTISEMENT) ? "granted" : "denied",
        [SERVICE_AD_PERSONALIZATION]: CookieConsent.acceptedService(SERVICE_AD_PERSONALIZATION, CAT_ADVERTISEMENT) ? "granted" : "denied",
        [SERVICE_FUNCTIONALITY_STORAGE]: CookieConsent.acceptedService(SERVICE_FUNCTIONALITY_STORAGE, CAT_FUNCTIONALITY) ? "granted" : "denied",
        [SERVICE_PERSONALIZATION_STORAGE]: CookieConsent.acceptedService(SERVICE_PERSONALIZATION_STORAGE, CAT_FUNCTIONALITY) ? "granted" : "denied",
        [SERVICE_SECURITY_STORAGE]: CookieConsent.acceptedService(SERVICE_SECURITY_STORAGE, CAT_SECURITY) ? "granted" : "denied",
    });
}

CookieConsent.run({
    guiOptions: {
        consentModal: {
            layout: "box",
            position: "bottom right",
            equalWeightButtons: true,
            flipButtons: false
        },
        preferencesModal: {
            layout: "box",
            position: "right",
            equalWeightButtons: true,
            flipButtons: false
        }
    },

    // Trigger consent update when user choices change
    onFirstConsent: () => {
        updateGtagConsent();
    },
    onConsent: () => {
        updateGtagConsent();
    },
    onChange: () => {
        updateGtagConsent();
    },

    categories: {
        [CAT_NECESSARY]: {
            enabled: true,
            readOnly: true
        },
        [CAT_ANALYTICS]: {
            autoClear: {
                cookies: [
                    { name: /^_ga/ },
                    { name: "_gid" }
                ]
            },
            services: {
                [SERVICE_ANALYTICS_STORAGE]: {
                    label: "Analytics opslag (cookies)"
                }
            }
        },
        [CAT_ADVERTISEMENT]: {
            services: {
                [SERVICE_AD_STORAGE]: {
                    label: "Advertentie-opslag (cookies)"
                },
                [SERVICE_AD_USER_DATA]: {
                    label: "Advertentie user data (Google)"
                },
                [SERVICE_AD_PERSONALIZATION]: {
                    label: "Gepersonaliseerde advertenties"
                }
            }
        },
        [CAT_FUNCTIONALITY]: {
            services: {
                [SERVICE_FUNCTIONALITY_STORAGE]: {
                    label: "Functionele opslag"
                },
                [SERVICE_PERSONALIZATION_STORAGE]: {
                    label: "Personalisatie opslag"
                }
            }
        },
        [CAT_SECURITY]: {
            services: {
                [SERVICE_SECURITY_STORAGE]: {
                    label: "Security opslag"
                }
            }
        }
    },

    language: {
        default: "nl",
        autoDetect: "browser",
        translations: {
            nl: {
                consentModal: {
                    title: "We waarderen uw privacy",
                    description: "We gebruiken cookies om uw browse-ervaring te verbeteren, gepersonaliseerde advertenties of inhoud weer te geven en ons verkeer te analyseren. Door op ‘Alles accepteren’ te klikken, stemt u in met ons gebruik van cookies.",
                    acceptAllBtn: "Alles accepteren",
                    acceptNecessaryBtn: "Alleen noodzakelijke cookies accepteren",
                    showPreferencesBtn: "Voorkeuren beheren",
                    footer: ""
                },
                preferencesModal: {
                    title: "Cookievoorkeuren",
                    acceptAllBtn: "Alles accepteren",
                    acceptNecessaryBtn: "Alleen noodzakelijke cookies accepteren",
                    savePreferencesBtn: "Voorkeuren opslaan",
                    closeIconLabel: "Sluit venster",
                    serviceCounterLabel: "Service|Services",
                    sections: [
                        {
                            title: "Cookie Gebruik",
                            description: "Wij gebruiken cookies om uw ervaring op onze website te verbeteren. Sommige cookies zijn essentieel voor de werking van de site, terwijl andere ons helpen om inzicht te krijgen in hoe u onze site gebruikt en om gepersonaliseerde inhoud aan te bieden."
                        },
                        {
                            title: "Strikt noodzakelijke cookies <span class=\"pm__badge\">Altijd ingeschakeld</span>",
                            description: "Essentieel voor de werking van de website en kan niet worden uitgeschakeld.",
                            linkedCategory: CAT_NECESSARY
                        },
                        {
                            title: "Analytics",
                            description: "Helpt ons begrijpen hoe bezoekers de site gebruiken.",
                            linkedCategory: CAT_ANALYTICS
                        },
                        {
                            title: "Advertising",
                            description: "Wordt gebruikt voor advertenties en metingen.",
                            linkedCategory: CAT_ADVERTISEMENT
                        },
                        {
                            title: "Functionality",
                            description: "Ondersteunt extra functionaliteit en personalisatie.",
                            linkedCategory: CAT_FUNCTIONALITY
                        },
                        {
                            title: "Security",
                            description: "Ondersteunt beveiliging, fraudepreventie en bescherming.",
                            linkedCategory: CAT_SECURITY
                        }
                    ]
                }
            }
        }
    }
});