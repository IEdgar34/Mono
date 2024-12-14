const mask = () => {
    function Inputmask(inputSelector, maskStr) {
        this.input = document.querySelector(inputSelector);
        this.mask = maskStr;
        this.selectionCount = this.mask.indexOf("_");
        this.start = this.mask.indexOf("_");
        this.end = this.mask.lastIndexOf("_");
        this.valid;
        //функция для перемещения курсора в поле ввода
        this.selection = (event) => {
            if (this.selectionCount > 0) {
                event.target.selectionStart = this.selectionCount;
                event.target.selectionEnd = this.selectionCount;
            }
        };
        //добавление маски и перемещение курсора во время фокуса
        this.addMask = (event) => {
            this.selection(event);
            if (event.target.value === "") {
                this.input.value = this.mask;
                this.selection(event);
            }
        };
        //получаем индекс курсора в глобальную переменную во время изменения положения кусора по клику
        this.cursor = () => {
            this.selectionCount = this.input.selectionStart - 1;
        };
        this.inputMethod = (event) => {
            event.preventDefault();
            if (/[0-9]/.test(parseInt(event.data))) {
                //при вводе чисел и прохождения условия
                if (this.selectionCount <= this.end && !this.valid) {
                    //получаем положение курсора до изменения строки
                    this.selectionCount = this.input.value.indexOf("_") + 1;
                    //изменяем строку
                    this.input.value = this.input.value.replace("_", event.data);
                    //двигаем курсор
                    this.selection(event);
                }
                if (/^\+\d{1,1}\(\d{3,3}\)\-\d{3,3}\-\d{2,2}\-(?:\d{2,2}|\d{2,}\_)$/g.test(this.input.value)) {
                    this.selectionCount = this.end + 1;
                    this.selection(event);
                }
            } else if (event.data != null) {
                // удаляем все кроме чисел
                this.input.value = this.input.value.replace(/[a-z A-Z]/g, "");
            }
            if (event.data === null) {
                //при нажатии back space
                if (this.selectionCount >= this.start) {
                    //получаем индекс курсора в глобальную переменную во время удаления из строки
                    this.cursor();
                    //редактируем строку
                    this.input.value =
                        this.input.value.slice(0, this.input.selectionStart - 1) + this.mask[this.input.selectionStart - 1] + this.input.value.slice(this.input.selectionStart);
                    //
                    //сдвигаем курсор
                    this.selection(event);
                    this.selectionCount -= 1;
                }
            }

            this.valid = validateRules[event.target.getAttribute("name")](event.target.value, event.target);
        };

        this.change = (event) => {
            event.preventDefault();
            if (!validateRules[event.target.getAttribute("name")](event.target.value, event.target)) {
                event.target.value = this.mask;
                this.selectionCount = this.start;
                this.selection(event);
                document.documentElement.style.setProperty("--resetcolor", "rgb(242, 222, 222)  ");
            } else {
                document.documentElement.style.setProperty("--resetcolor", "rgb(245, 245, 245)");
                this.selectionCount = this.start;
                this.selection(event);
            }
        };
        this.input.addEventListener("focus", this.addMask, event);
        this.input.addEventListener("click", this.cursor, event);
        this.input.addEventListener("beforeinput", this.inputMethod, event);
        this.input.addEventListener("change", this.change, event);
        this.input.addEventListener("paste", this.change, event);
    }
    new Inputmask("input[name='phone']", "+7(___)-___-__-__");
    //правила валидации инпутов,очень простые,для демонстрации + тут же добавляем класс валидности
    const validateRules = {
        name: (value, target) => {
            if (value === "") {
                target.parentElement.className = "invalid";
                return false;
            } else {
                target.parentElement.className = "";
                return true;
            }
        },
        phone: (value, target) => {
            if (/^\+\d{1,1}\(\d{3,3}\)\-\d{3,3}\-\d{2,2}\-(?:\d{2,2}|\d{2,}\_)$/g.test(value)) {
                target.parentElement.className = "";
                return true;
            } else {
                target.parentElement.className = "invalid";
                return false;
            }
        },
        textarea: (value, target) => {
            if (value === "") {
                target.parentElement.className = "invalid";
                return false;
            } else {
                target.parentElement.className = "";
                return true;
            }
        },
    };
    //провермяем инпуты во время ввода
    let nameInp = document.querySelector("input[name='name']");
    let textarea = document.querySelector("#textarea");
    nameInp.addEventListener("input", () => validateRules[nameInp.getAttribute("name")](nameInp.value, nameInp));
    textarea.addEventListener("input", () => validateRules[textarea.getAttribute("name")](textarea.value, textarea));
    //получаем результат проверки,для формы
    function examinationInputs(inputSelector) {
        let arr = [];
        inputSelector.forEach((item) => {
            arr.push(validateRules[item.getAttribute("name")](item.value, item));
        });
        if (arr.includes(false)) {
            return false;
        } else {
            return true;
        }
    }
    //отправляем форму,форма отправляет в случаем прохождения проверок и активного чекбокса
    const inputs = document.querySelectorAll(".form__inputs");
    document.querySelector(".form").addEventListener("submit", (e) => {
        e.preventDefault();
        if (examinationInputs(inputs) && document.querySelector('input[type="checkbox"]').checked) {
            console.log("Отправляем форму");
            inputs.forEach((item) => (item.value = ""));
            document.querySelector('input[type="checkbox"]').checked = false;
        } else {
        }
    });
};
export { mask };
