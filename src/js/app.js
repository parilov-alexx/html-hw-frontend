const addticket = document.querySelector('.add-ticket');
const ticketPad = document.querySelector('.ticket-pad');
const url = 'http://localhost:1011';
let cancelAdd;
let submitAdd;

addticket.addEventListener('click', () => {
  ticketPad.insertAdjacentHTML(
    'beforeend',
    `<form class="create-ticket">
        <div class="correctPad">
          <h5 class="headerCreate">Добавить тикет</h5>
          <label class="descriptionlabel" for="description">
            Краткое описание</label
          >
          <input
            class="descriptionName"
            placeholder="Задача"
            type="text"
            name="name"
            id="description"
          />
  
          <label class="fullDescriptionlabel" for="fullDescription">
            Подробное описание</label>
          <textarea
            class="fullDescriptionName"
            placeholder="Опишите текущую задачу"
            name="description"
            id="fullDescription"
          ></textarea>
        </div>
        <input class="cancelAddition" type="button" value="Отмена" />
        <input class="submitAddition" type="button" value="Ok" />
      </form>`,
  );

  cancelAdd = document.querySelector('.cancelAddition');
  submitAdd = document.querySelector('.submitAddition');

  cancelAdd.addEventListener('click', () => {
    document.querySelector('.create-ticket').remove();
  });

  submitAdd.addEventListener('click', (e) => {
    e.preventDefault();

    const shortDescription = document.querySelector('.descriptionName').value;
    const fullDescription = document.querySelector('.fullDescriptionName').value;

    document.querySelector('.create-ticket').remove();

    const date = new Date();
    const nowDate = `${date.getDate()}.${
      date.getMonth() + 1
    }.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;

    class Data {
      constructor(name, value, isDate) {
        this.name = name;
        this.value = value;
        this.created = isDate;
      }
    }
    const req = new Data(shortDescription, fullDescription, nowDate);

    /* let data = Array.from(createTicketForm.elements)
      .filter(({ name }) => name)
      .map(({ name, value }) => `${name}=${value}`)

      data = `${data}&created=${encodeURIComponent(nowDate)}`;
   console.log(data)
      */
    try {
      fetch(url, {
        method: 'POST',
        body: JSON.stringify(req),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          ticketPad.insertAdjacentHTML(
            // new ticket
            'beforeend',
            `
                <div class="ticket" data-id ="${data.id}">
            <input class="status" type="checkbox" name="status">
            <span class="name" name="name" data-fulldescription ="${fullDescription}">${shortDescription}</span>
            <span class="created" name="created">${nowDate}</span>
            <div class="control-element">
            <button type="button" class="edit">&#9998</button>
            <button type="button" class="delete">X</button>
            </div>
          </div>
              `,
          ); console.log(data);
        });
    } catch (error) {
      console.error('Ошибка:', error);
    }
  });
});

ticketPad.addEventListener('click', (e) => {
  // delete ticket
  if (e.target.classList.contains('delete')) {
    const targetTicket = e.target.closest('.ticket');
    ticketPad.insertAdjacentHTML(
      'beforeend',
      `
          <form class="delete-ticket">
            <div class="deleteInfo">
              <h5 class="headerDetete-ticket">Вы уверены, что хотите удалить тикет? Это действие необратимо</h5>
              <button type="button" class="cancelDelete">Отмена</button>
              <button type="button" class="submitDelete">Ок</button>
            </div>
          </form>
          `,
    );
    document.querySelector('.cancelDelete').addEventListener('click', (elem) => {
      elem.preventDefault();
      document.querySelector('.delete-ticket').remove();
    });
    document.querySelector('.submitDelete').addEventListener('click', (el) => {
      el.preventDefault();
      const req = targetTicket.dataset.id;

      try {
        fetch(url, {
          method: 'DELETE',
          body: JSON.stringify(req),
          headers: {
            'Content-type': 'application/json',
            req,
          },

        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Тикет не найден');
            } else {
              targetTicket.remove();
              document.querySelector('.delete-ticket').remove();
              console.log(' ticket deleted');
            }
          });
      } catch (error) {
        console.error('Ошибка:', error);
      }
    });
  } else if (e.target.classList.contains('edit')) {
    // edit

    ticketPad.insertAdjacentHTML(
      'beforeend',
      `
                    <form class="create-ticket">
                    <div class="correctPad">
                      <h5 class="headerCreate-ticket">ИЗМЕНИТЬ ТИКЕТ</h5>
                      <label class="descriptionlabel" for="description">
                       </label
                      >
                      <input
                        class="descriptionName"
                        placeholder="Задача"
                        type="text"
                        name="name"
                        id="description"
                      />
              
                      <label class="fullDescriptionlabel" for="fullDescription">
                        Подробное описание</label>
                      <textarea
                        class="fullDescriptionName"
                        placeholder="Описание задачи"
                        name="description"
                        id="fullDescription"
                      ></textarea>
                    </div>

                    <button type="button" class="cancelEdition">Отмена</button>
                    <button type="button" class="submitEdition">Ок</button>
                  </form>
                  `,
    );

    const tiсketCorrectValue = e.target.closest('.ticket');
    document.querySelector('.descriptionName').value = tiсketCorrectValue.querySelector('.name').textContent;
    document.querySelector('.fullDescriptionName').value = tiсketCorrectValue.querySelector('.name').dataset.fulldescription;

    const cancelEdition = document.querySelector('.cancelEdition');
    const submitEdition = document.querySelector('.submitEdition');

    cancelEdition.addEventListener('click', (element) => {
      element.preventDefault();
      document.querySelector('.create-ticket').remove();
    });

    submitEdition.addEventListener('click', (x) => {
      x.preventDefault();
      tiсketCorrectValue.querySelector('.name').textContent = document.querySelector('.descriptionName').value;
      tiсketCorrectValue.querySelector('.name').dataset.fulldescription = document.querySelector('.fullDescriptionName').value;

      const data = {};
      data.id = tiсketCorrectValue.dataset.id;
      data.name = document.querySelector('.descriptionName').value;
      data.value = document.querySelector('.fullDescriptionName').value;
      try {
        fetch(url, {
          method: 'PUT',
          body: JSON.stringify(data),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Тикет не найден');
            } else {
              document.querySelector('.create-ticket').remove();
            }
          });
      } catch (error) {
        console.error('Ошибка:', error);
      }
    });
    // checkbox
  } else if (e.target.classList.contains('status')) {
    const checkbox = e.target.closest('.status');
    const checkedTicket = e.target.closest('.ticket');
    const { id } = checkedTicket.dataset;
    let status;
    if (checkbox.checked) {
      status = true;
    } else {
      status = false;
    }
    const data = {};
    data.id = id;
    data.status = status;
    try {
      fetch(url, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Тикет не найден');
          } else {
            console.log(' ticket checked');
          }
        });
    } catch (error) {
      console.error('Ошибка:', error);
    }
  } else if (e.target.classList.contains('name') || e.target.classList.contains('ticket')) {
    // full description
    const ticketTarg = e.target.closest('.ticket');
    const info = ticketTarg.dataset.id;
    if (!ticketPad.querySelector('.fullDes')) {
      try {
        fetch(url, {
          method: 'GET',
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            info,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            ticketTarg.insertAdjacentHTML(
              'beforeend',
              `
                <div class="fullDes">
                <span class="fullDes_content">${data.value}</span>
              </div>
                  `,
            );
          });
      } catch (error) {
        console.error('Ошибка:', error);
      }
    } else {
      ticketPad.querySelector('.fullDes').remove();
    }
  }
});
