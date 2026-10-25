const changeLanguage = (language) => {
    localStorage.setItem(
        "language",
        language
    );

    setLanguage(language);
};