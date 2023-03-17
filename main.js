let listOfItems = [];
let itemToEdit;

const form = document.getElementById('form-itens');
const itemsInput = document.getElementById('receber-item');
const ulItems = document.getElementById('lista-de-itens');
const ulBoughtItems = document.getElementById('itens-comprados');
const retrievedList = localStorage.getItem('listOfItems');

function updateLocalStorage() {
   localStorage.setItem('listOfItems', JSON.stringify(listOfItems));
}

if (retrievedList) {
   listOfItems = JSON.parse(retrievedList);
   
   showItem();
} else {
   listOfItems = [];
   
   showItem();
}

form.addEventListener('submit', function (event) {
   event.preventDefault();

   storageItem();
   showItem();

   itemsInput.focus();
});

function storageItem() {
   const newItem = itemsInput.value;
   const itemAlreadyExists = listOfItems.some((item) => item.value.toUpperCase() === newItem.toUpperCase());

   if (itemAlreadyExists) {
      alert('Item já existe');

      return;
   }

   listOfItems.push({
      value: newItem,
      check: false,
   });

   itemsInput.value = '';
}

function showItem() {
   ulItems.innerHTML = '';
   ulBoughtItems.innerHTML = '';

   listOfItems.forEach((element, index) => {
      if (element.check) {
         ulBoughtItems.innerHTML += `
            <li class="item-compra is-flex is-justify-content-space-between" data-value="${index}">
               <div>
                     <input type="checkbox" checked="${element.check}" class="is-clickable" />  
                     <span class="itens-comprados is-size-5">${element.value}</span>
               </div>
               <div>
                     <i class="fa-solid fa-trash is-clickable deletar"></i>
               </div>
            </li>
         `;

         return;
      }

      ulItems.innerHTML += `
         <li class="item-compra is-flex is-justify-content-space-between" data-value="${index}">
            <div>
                  <input type="checkbox" class="is-clickable" />
                  <input type="text" class="is-size-5" value="${element.value}" ${index !== Number(itemToEdit) ? 'disabled' : ''}></input>
            </div>
            <div>
                  ${index === Number(itemToEdit) ?
                     `<buton onClick="saveEdition()">
                        <i class="fa-regular fa-floppy-disk is-clickable"></i>
                     </buton>` :
                     `<i class="fa-regular is-clickable fa-pen-to-square editar"></i>`}
                     <i class="fa-solid fa-trash is-clickable deletar"></i>
            </div>
         </li>
      `;
   });

   const inputsCheck = document.querySelectorAll('input[type="checkbox"]');

   inputsCheck.forEach(input => {
      input.addEventListener('click', (event) => {
         const elementValue = event.target.parentElement.parentElement.getAttribute('data-value');

         listOfItems[elementValue].check = event.target.checked;
         
         showItem();
      });
   });

   const deleteObject = document.querySelectorAll('.deletar');

   deleteObject.forEach(input => {
      input.addEventListener('click', (event) => {
         const elementValue = event.target.parentElement.parentElement.getAttribute('data-value');

         listOfItems.splice(elementValue, 1);
         
         showItem();
      });
   });

   const editItems = document.querySelectorAll('.editar');

   editItems.forEach(input => {
      input.addEventListener('click', (event) => {
         itemToEdit = event.target.parentElement.parentElement.getAttribute('data-value');

         showItem();
      });
   });

   updateLocalStorage();
}

function saveEdition() {
   const itemEdited = document.querySelector(`[data-value="${itemToEdit}"] input[type="text"]`);

   listOfItems[itemToEdit].value = itemEdited.value;
   itemToEdit = -1;

   showItem();
}