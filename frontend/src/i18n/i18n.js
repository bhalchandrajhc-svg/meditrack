
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "../locales/en.json";
import mr from "../locales/mr.json";
import hi from "../locales/hi.json";
import gu from "../locales/gu.json";
import ta from "../locales/ta.json";
import te from "../locales/te.json";
import kn from "../locales/kn.json";
import ml from "../locales/ml.json";
import bn from "../locales/bn.json";
import pa from "../locales/pa.json";
import as from "../locales/as.json";
import od from "../locales/od.json";
import ur from "../locales/ur.json";

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({

        resources: {

            en: { translation: en },
            mr: { translation: mr },
            hi: { translation: hi },
            gu: { translation: gu },
            ta: { translation: ta },
            te: { translation: te },
            kn: { translation: kn },
            ml: { translation: ml },
            bn: { translation: bn },
            pa: { translation: pa },
            as: { translation: as },
            od: { translation: od },
            ur: { translation: ur }

        },

        lng: localStorage.getItem("language") || "en",

        fallbackLng: "en",

        supportedLngs: [
            "en",
            "mr",
            "hi",
            "gu",
            "ta",
            "te",
            "kn",
            "ml",
            "bn",
            "pa",
            "as",
            "od",
            "ur"
        ],

        interpolation: {

            escapeValue: false

        },

        react: {

            useSuspense: false

        }

    });

export default i18n;

