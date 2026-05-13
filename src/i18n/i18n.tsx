import i18n from "i18next";
import { cloneDeep } from "lodash";
import { initReactI18next } from "react-i18next";
import de from "./locales/de.json";
import en from "./locales/en.json";

export const FALLBACK_LANGUAGE = "en";

export interface Language {
  locale: string;
  name: string;
  icon: JSX.Element;
}

const getBrowserLanguage = () => {
  // @ts-ignore
  const userLang = navigator.language || navigator.userLanguage;

  return userLang ? userLang.split("-")[0] : FALLBACK_LANGUAGE;
};

const browserLanguage = getBrowserLanguage();

const resolveInitialLanguage = (): string => {
  if (typeof window === "undefined") {
    return FALLBACK_LANGUAGE;
  }
  const saved = window.localStorage.getItem("i18nextLng");
  if (saved === "de" || saved === "en") {
    return saved;
  }
  return browserLanguage === "de" ? "de" : FALLBACK_LANGUAGE;
};

export const defaultTranslationModules = [
  { locale: "de", texts: de },
  { locale: "en", texts: en }
];
export const defaultLanguages = defaultTranslationModules.map((m) => m.locale);

const resources = cloneDeep(
  Object.fromEntries(
    defaultTranslationModules.map((m) => [m.locale, { app: m.texts }])
  )
);

i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)

  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources,
    ns: ["common", "app"],
    defaultNS: "app",
    lng: resolveInitialLanguage(),
    fallbackLng: FALLBACK_LANGUAGE,
    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    }
  });

export default i18n;
