const API_URL = 'https://randomuser.me/api/?results=5';

const button = document.getElementById('download-btn');
const statusEl = document.getElementById('status');
const usersEl = document.getElementById('users');

function setStatus(text, isError) {
  statusEl.textContent = text;
  statusEl.classList.toggle('error', Boolean(isError));
}

function createCard(user) {
  const card = document.createElement('article');
  card.className = 'card';

  const img = document.createElement('img');
  img.src = user.picture.large;
  img.alt = 'Фото користувача';

  const info = document.createElement('div');
  info.className = 'info';

  const fields = [
    ['Cell', user.cell],
    ['City', user.location.city],
    ['Postcode', user.location.postcode],
    ['E-mail', user.email]
  ];

  fields.forEach(([label, value]) => {
    const p = document.createElement('p');
    p.textContent = label + ': ' + value;
    info.appendChild(p);
  });

  card.append(img, info);
  return card;
}

function showUsers(users) {
  usersEl.innerHTML = '';
  users.forEach((user) => usersEl.appendChild(createCard(user)));
}

function loadUsers() {
  button.disabled = true;
  setStatus('loading...');

  fetch(API_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error('HTTP ' + response.status);
      }
      return response.json();
    })
    .then((data) => {
      showUsers(data.results);
      setStatus('success!');
    })
    .catch((error) => {
      setStatus('Не вдалося завантажити дані: ' + error.message, true);
    })
    .finally(() => {
      button.disabled = false;
    });
}

button.addEventListener('click', loadUsers);
