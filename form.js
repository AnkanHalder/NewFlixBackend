const addActorButton = document.getElementById('addActorButton');
const actorFieldsContainer = document.getElementById('actorFields');

let actorCount = 1;

addActorButton.addEventListener('click', () => {
  const actorField = document.createElement('input');
  actorField.type = 'text';
  actorField.name = `vidActors`; // Use the correct name attribute

  actorFieldsContainer.appendChild(actorField);

  actorCount++;
});

document.querySelector('form').addEventListener('submit', (event) => {
  const actorFields = document.querySelectorAll('input[name="vidActors"]');
  const actorValues = Array.from(actorFields).map((field) => field.value);
  document.getElementById('vidActors').value = JSON.stringify(actorValues);
});
