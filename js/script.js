window.addEventListener('DOMContentLoaded', () => {

    //Tabs

    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) =>{
        const target = event.target;

        if(target && target.classList.contains("tabheader__item")) {
            tabs.forEach((item,i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);  
                }
            });
        }
    });

    //Timer 

    const deadline = '2021-05-20';

    // Вычисление разницы между конечной датой deadline и текущей датой в миллисекундах 
    // и сохранение полученных данных в объект.
    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
              days = Math.floor(t / (1000 * 60 * 60 * 24)),
              hours = Math.floor((t / 1000 *60*60) % 24),
              minutes = Math.floor((t / 1000 /60) % 60),
              seconds = Math.floor((t / 1000) % 60);

        return {
            "total": t,
            "days": days,
            "hours": hours,
            "minutes": minutes,
            "seconds": seconds
        };
    }

    function setClock (selector, endtime) {
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds= timer.querySelector('#seconds'),
              timeInterval = setInterval(updateClock, 1000);
    

        updateClock();

        //Функция, подставляющая дополнительный ноль к цифре num.
        function getZero (num) {
            if (num >=0 && num < 10) {
                return `0${num}`;
            } else {
                return num;
            }
        }

        function updateClock () {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes)
            seconds.innerHTML = getZero(t.seconds);

            if( t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }
 
    setClock('.timer', deadline);

    //Modal (Данный код будет работать только на сервере, например, MAMP)

    const buttonOpenModal = document.querySelectorAll('[modal-data]'),
          modal = document.querySelector('.modal'),
          buttonCloseModal = modal.querySelector('[data-close]');

    function openModal() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    buttonOpenModal.forEach(btn => {
            btn.addEventListener('click', openModal);
    });

    //Если пользователь нажмет на серый фон при открытом модальном окне, то модальное окно закроется.
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == ''){ 
            closeModal();
        }
    });

    //Если пользователь нажмет на клав. Esc, то модальное окно закроется.
    document.addEventListener('keydown', (e) => {
        if (e.code == 'Escape') {
            closeModal();
        }
    });

    // Появление модального окна через несколько секунд.
    const modalTimerId = setTimeout(openModal, 5000);

    //Если пользователь прокрутит страницу до конца, то появится модальное окно.
    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }
    window.addEventListener('scroll', showModalByScroll);

    // Используем классы для карточек меню

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAH(); 
        }

        changeToUAH() {
            this.price = this.price * this.transfer; 
        }

        render() {
            const element = document.createElement('div');
            element.innerHTML = `
                <div class="menu__item">
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>
                </div>
            `;
            this.parent.append(element);
        }
    }

    const getResource= async (url) => {//Создаем функцию-expression для создания fetch-запроса на получения данных с сервера для повторных использований в дальнейшем.
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();//У fetch в данном случае есть метод json(), кот. оборачивает данные в формат-json
    };

    getResource('http://localhost:3000/menu') // Вызываем fetch-запрос на получение данных с сервера db.json для формирования карточек меню
    .then(data => {// data - это полученные карточки меню с сервера
        data.forEach(({img,altimg,title,descr,price}) => {// Теперь для каждой карточки с помощью деструктуризации объекта {}, т.е. вытаскивания св-в из полученной карточки, создаем новые классы
             new MenuCard(img,altimg,title,descr,price, '.menu .container').render(); //Создали новую карточку и подставили аргументы из полученных св-в карточки меню.
        });
    });

    // Forms

    const forms = document.querySelectorAll('form');
    const message = {
        loading: 'img/form/spinner.svg',// Поместили в loading спиннер загрузки
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        bindPostData(item);// Вызываем функцию на отправку по каждому form
    });

    //Т.к. мы работаем с fetch, то это значит, что мы делаем запросы на сервер и ждем ответа сервера, т.е. код асинхронный.
    //Чтобы не возникало ошибок и код дожидался ответа от сервера (или при любых других асинх. кодов #setTimeOut) используется async и await. async указывается перед функцией, которая должна ждать и запуститься после загрузки функции с await. await ставиться перед функций, которая должна загрузиться, после чего исполняется функция с async.

    const postData = async (url, data) => {//Создаем функцию-expression для создания fetch-запроса для повторных использований в дальнейшем.
        const res = await fetch(url, {
            method: 'POST', // Указываем тип метода (GET или POST)
            headers: { // Указываем заголовки, если данные в формате json
                'Content-Type': 'application/json'
            },
            body: data //Указываем в body, то, что нужно отправить на сервер, т.к. у нас POST запрос на отправку данных object.
        });

        return await res.json();//У fetch в данном случае есть метод json(), кот. оборачивает данные в формат-json
    };

    function bindPostData(form) { // Создаем функцию на отправку данных на сервер
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Убираем действие по умолчанию

            let statusMessage = document.createElement('img');// Создаем элемент для вложения в него спиннера
            statusMessage.src = message.loading; //Вложили спиннер в src
            statusMessage.style.cssText = ` 
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);// Данный метод добавляет statusMessage после form в DOM-дереве
        
            const formData = new FormData(form); // FormData - это объект, представляющий данные HTML формы. Особенность FormData заключается в том, что методы для работы с сетью, например fetch, позволяют указать объект FormData, сформированный из аргумента form, в свойстве тела запроса body.

            const object = {}; // Создали массив для подготовки FormData на отправку в формате JSON, т.к. FormData является специфич. объектом, его нельзя просто прогнать в другой формат. 
            formData.forEach(function(value, key){
                object[key] = value; // Перебираем все данные из Formdata и записываем их в переменную object как ключ и значение. Чтобы у FormData поменять формат на JSON(мы это сделали ниже в fetch-коде в body), нужно использовать данный прием.
            });

            //Есть другой способ для форматирования formData в json-формат:
            //const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', JSON.stringify(object))//Вызвали функцию, содержащую fetch.
            .then(data => { // Data - это данные, которые нам вернул сервер
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            }).catch(() => {
                showThanksModal(message.failure);
            }).finally(() => {
                form.reset();
            });
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;
        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }

    //Slider

    const slides = document.querySelectorAll('.offer__slide'),
          prev = document.querySelector('.offer__slider-prev'),
          next = document.querySelector('.offer__slider-next'),
          total = document.querySelector('#total'),
          current =document.querySelector('#current');
    let slideIndex = 1; // Это номер слайда

    showSlides(slideIndex);

    if (slides.length < 10) {
        total.textContent = `0${slides.length}`;
    } else {
        total.textContent = slides.length;
    }

    function showSlides(n) { // n - это номер слайда, т.е. slideIndex. 
        if (n > slides.length) { // Если n больше 4, то перелистываем на первый слайд
            slideIndex = 1 
        }

        if (n < 1) { // Если n меньше 1, то перелистываем на последний слайд
            slideIndex = slides.length;
        }

        slides.forEach(item => item.style.display = 'none'); // Скрываем слайды

        slides[slideIndex - 1].style.display = 'block'; // Показываем только один слайд 
    
        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }
    }
 
    function plusSlides(n) { 
        showSlides(slideIndex += n);
    }

    prev.addEventListener('click', () =>{
        plusSlides(-1);
    });

    next.addEventListener('click', () => {
        plusSlides(1);
    });


    // Calculator

    const result = document.querySelector('.calculating__result span');
    let sex = 'female',
        height, weight, age,
        ratio = 1.375;

    function calcTotal() {
        if (!sex || !height || !weight || !age || !ratio) {
            result.textContent = '____'; // Можете придумать что угодно
            return;
        }
        if (sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }

    calcTotal();

    function getStaticInformation(parentSelector, activeClass) {
        const elements = document.querySelectorAll(`${parentSelector} div`);

        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio');
                } else {
                    sex = e.target.getAttribute('id');
                }
    
                elements.forEach(elem => {
                    elem.classList.remove(activeClass);
                });
    
                e.target.classList.add(activeClass);
    
                calcTotal();
            });
        });
    }

    getStaticInformation('#gender', 'calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big', 'calculating__choose-item_active');

    function getDynamicInformation(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {
            switch(input.getAttribute('id')) {
                case "height":
                    height = +input.value;
                    break;
                case "weight":
                    weight = +input.value;
                    break;
                case "age":
                    age = +input.value;
                    break;
            }

            calcTotal();
        });
    }

    getDynamicInformation('#height');
    getDynamicInformation('#weight');
    getDynamicInformation('#age');

});
