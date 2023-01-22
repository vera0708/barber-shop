import { addPreload, removePreload } from "./util.js";
import { API_URL } from "./const.js";

const addDisabled = (arr) => {
    arr.forEach(elem => {
        elem.disabled = true;
    })
}

const removeDisabled = (arr) => {
    arr.forEach(elem => {
        elem.disabled = false;
    })
}

const renderSpec = (wrapper, data) => {
    const labels = data.map(item => {
        const label = document.createElement('label')
        label.classList.add('radio')
        label.innerHTML = `
        <input class="radio__input" type="radio" name="spec" value="${item.id}">
        <span class="radio__label radio__label_spec"
            style="--bg-image: url(${API_URL}${item.img})">${item.name}</span>
        `;
        return label;
    })
    wrapper.append(...labels)
};

const renderMonth = (wrapper, data) => {
    const labels = data.map((month) => {
        const label = document.createElement('label')
        label.classList.add('radio')
        label.innerHTML = `
        <input class="radio__input" type="radio" name="month" value="${month}">
        <span class="radio__label">${new Intl.DateTimeFormat('ru-RU', { month: 'long' }).format(new Date(month))}</span>
    `;
        return label;
    })
    wrapper.append(...labels)
};

const renderDay = (wrapper, data, month) => {
    const labels = data.map((day) => {
        const label = document.createElement('label')
        label.classList.add('radio')
        label.innerHTML = `
        <input class="radio__input" type="radio" name="day" value="${day}">
        <span class="radio__label">${new Intl.DateTimeFormat('ru-RU', { month: 'long', day: 'numeric' }).format(new Date(`${month}/${day}`))}</span>
    `;
        return label;
    })
    wrapper.append(...labels)
};

const renderTime = (wrapper, data) => {
    // data.sort((a, b) => a > b ? 1 : -1)
    const labels = data.map((time) => {
        const label = document.createElement('label')
        label.classList.add('radio')
        label.innerHTML = `
        <input class="radio__input" type="radio" name="time" value="${time}">
        <span class="radio__label">${time}</span>
    `;
        return label;
    })
    wrapper.append(...labels)
};

export const initReserve = () => {
    const reserveForm = document.querySelector('.reserve__form')
    console.log('reserveForm:  ', reserveForm.fieldspec)
    const { fieldservice, fieldspec, fielddata, fieldmonth, fieldday, fieldtime,
        btn_reserve } = reserveForm;


    addDisabled([fieldspec, fielddata, fieldmonth, fieldday, fieldtime, btn_reserve]);

    reserveForm.addEventListener('change', async (event) => {
        const target = event.target;

        if (target.name === 'service') {
            addDisabled([fieldspec, fielddata, fieldmonth, fieldday, fieldtime, btn_reserve]);
            fieldspec.innerHTML = `<legend class="reserve__legent">Специалист</legend>`
            addPreload(fieldspec)
            const response = await fetch(`${API_URL}/api?service=${target.value}`)
            const data = await response.json();

            renderSpec(fieldspec, data);
            removePreload(fieldspec);
            removeDisabled([fieldspec])
        }

        if (target.name === 'spec') {
            addDisabled([fielddata, fieldmonth, fieldday, fieldtime, btn_reserve]);
            // fielddata.innerHTML = `<legend class="reserve__legent">Дата и время</legend>`
            addPreload(fieldmonth)
            const response = await fetch(`${API_URL}/api?spec=${target.value}`)
            const data = await response.json();
            console.log('data: ', data)
            fieldmonth.textContent = ''
            renderMonth(fieldmonth, data);
            removePreload(fieldmonth);
            removeDisabled([fielddata, fieldmonth])
        }

        if (target.name === 'month') {
            addDisabled([fieldday, fieldtime, btn_reserve]);
            addPreload(fieldday)
            const response = await fetch(`${API_URL}/api?spec=${reserveForm.spec.value}&month=${reserveForm.month.value}`)
            const data = await response.json();
            fieldday.textContent = ''
            renderDay(fieldday, data, reserveForm.month.value);
            removePreload(fieldday);
            removeDisabled([fieldday])
        }

        if (target.name === 'day') {
            addDisabled([fieldtime, btn_reserve]);
            addPreload(fieldtime)
            const response = await fetch(`${API_URL}/api?spec=${reserveForm.spec.value}&month=${reserveForm.month.value}&day=${target.value}`)
            const data = await response.json();
            fieldtime.textContent = ''
            renderTime(fieldtime, data);
            removePreload(fieldtime);
            removeDisabled([fieldtime])
        }

        if (target.name === 'time') {
            removeDisabled([btn_reserve])
        }
    })

    reserveForm.addEventListener('submit', async (eve) => {
        eve.preventDefault()

        const formData = new FormData(reserveForm);
        const json = (JSON.stringify(Object.fromEntries(formData)))


        const response = await fetch(`${API_URL}api/order`, {
            method: 'POST',
            body: json,
        })

        const data = await response.json()
        console.log('data:  ', data)

        addDisabled([
            fieldservice,
            fieldspec,
            fielddata,
            fieldmonth,
            fieldday,
            fieldtime,
            btn_reserve]);

        const order = document.createElement('p')
        order.textContent = `
        -------
        Спасибо за бронь #${data.id}!
        Ждём вас ${new Intl.DateTimeFormat('ru-RU', {
            month: 'long',
            day: 'numeric',
        }).format(new Date(`${data.month}/${data.day}`))},
        время ${data.time}
        `;

        reserveForm.append(order)
    })

};