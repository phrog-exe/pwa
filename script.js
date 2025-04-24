document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registrationForm');
    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const successMessage = document.getElementById('successMessage');
    const fetchButton = document.getElementById('fetchRandomUser');

    // Elementy wymagań hasła
    const lengthReq = document.getElementById('lengthReq');
    const lowerReq = document.getElementById('lowerReq');
    const upperReq = document.getElementById('upperReq');
    const digitReq = document.getElementById('digitReq');
    const specialReq = document.getElementById('specialReq');

    // Funkcje pomocnicze do wyświetlania błędów
    function showError(input, message) {
        const errorElement = document.getElementById(input.id + 'Error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        input.classList.add('invalid');
    }

    function hideError(input) {
        const errorElement = document.getElementById(input.id + 'Error');
        errorElement.textContent = '';
        errorElement.style.display = 'none';
        input.classList.remove('invalid');
    }

    // Walidacja nazwy użytkownika
    function validateUsername() {
        const value = username.value.trim();
        if (value === '') {
            showError(username, 'Nazwa użytkownika jest wymagana');
            return false;
        } else if (value.length < 3) {
            showError(username, 'Nazwa użytkownika musi mieć co najmniej 3 znaki');
            return false;
        } else if (value.length > 20) {
            showError(username, 'Nazwa użytkownika nie może być dłuższa niż 20 znaków');
            return false;
        } else {
            hideError(username);
            return true;
        }
    }

    // Walidacja email
    function validateEmail() {
        const value = email.value.trim();

        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (value === '') {
            showError(email, 'Adres email jest wymagany');
            return false;
        } else if (!emailRegex.test(value)) {
            showError(email, 'Proszę podać prawidłowy adres email');
            return false;
        } else {
            hideError(email);
            return true;
        }
    }

    // Rozbudowana walidacja hasła
    function validatePassword() {
        const value = password.value;

        // Sprawdzenie długości hasła
        const isLengthValid = value.length >= 8;
        toggleClass(lengthReq, isLengthValid);

        // Sprawdzenie małych liter
        const hasLowerCase = /[a-z]/.test(value);
        toggleClass(lowerReq, hasLowerCase);

        // Sprawdzenie wielkich liter
        const hasUpperCase = /[A-Z]/.test(value);
        toggleClass(upperReq, hasUpperCase);

        // Sprawdzenie cyfr
        const hasDigit = /[0-9]/.test(value);
        toggleClass(digitReq, hasDigit);

        // Sprawdzenie znaków specjalnych
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
        toggleClass(specialReq, hasSpecialChar);

        // Sprawdzenie wszystkich wymagań
        const isValid = isLengthValid && hasLowerCase && hasUpperCase && hasDigit && hasSpecialChar;

        if (value === '') {
            showError(password, 'Hasło jest wymagane');
            return false;
        } else if (!isValid) {
            showError(password, 'Hasło nie spełnia wszystkich wymagań');
            return false;
        } else {
            hideError(password);
            return true;
        }
    }

    // Pomocnicza funkcja do zaznaczania spełnionych wymagań hasła
    function toggleClass(element, isValid) {
        if (isValid) {
            element.classList.add('valid');
        } else {
            element.classList.remove('valid');
        }
    }

    // Walidacja potwierdzenia hasła
    function validateConfirmPassword() {
        const passwordValue = password.value;
        const confirmValue = confirmPassword.value;

        if (confirmValue === '') {
            showError(confirmPassword, 'Potwierdzenie hasła jest wymagane');
            return false;
        } else if (confirmValue !== passwordValue) {
            showError(confirmPassword, 'Hasła nie są zgodne');
            return false;
        } else {
            hideError(confirmPassword);
            return true;
        }
    }

    // Nasłuchiwanie na zdarzenia input dla wszystkich pól
    username.addEventListener('input', validateUsername);
    email.addEventListener('input', validateEmail);
    password.addEventListener('input', validatePassword);
    confirmPassword.addEventListener('input', validateConfirmPassword);

    // Obsługa zdarzenia submit formularza
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Wykonaj walidację wszystkich pól
        const isUsernameValid = validateUsername();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();

        // Jeśli wszystkie pola są poprawne, pokaż komunikat o sukcesie
        if (isUsernameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid) {
            form.style.display = 'none';
            successMessage.style.display = 'block';
        }
    });

    // Funkcja do wypełniania losowymi danymi
    function fillWithRandomUser() {
        // Zapobiegamy domyślnemu zachowaniu przycisku w formularzu
        event.preventDefault();

        fetch('https://randomuser.me/api/')
            .then(response => response.json())
            .then(data => {
                const user = data.results[0];

                // Wypełnij pola formularza
                username.value = user.login.username;
                email.value = user.email;

                // Stałe silne hasło spełniające wszystkie wymagania
                const strongPassword = "StrongP@ss123";
                password.value = strongPassword;
                confirmPassword.value = strongPassword;

                // Ręczne wywołanie walidacji dla wszystkich pól

                hideError(username);
                hideError(email);
                hideError(password);
                hideError(confirmPassword);

                // Aktualizuj wskaźniki wymagań hasła
                toggleClass(lengthReq, true);
                toggleClass(lowerReq, true);
                toggleClass(upperReq, true);
                toggleClass(digitReq, true);
                toggleClass(specialReq, true);

                return false; // Aby zatrzymać dalsze przetwarzanie formularza
            })
            .catch(error => {
                console.error('Błąd podczas pobierania danych:', error);
            });

        return false; // Dodatkowe zabezpieczenie, aby zapobiec przesłaniu formularza
    }

    // Dodaj nasłuchiwanie na przycisk wypełniania losowymi danymi
    fetchButton.addEventListener('click', function (event) {
        event.preventDefault(); // Zatrzymanie domyślnej akcji formularza
        fillWithRandomUser();
        return false;
    });


    fillWithRandomUser();
});
