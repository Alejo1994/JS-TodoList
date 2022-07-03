// Constants - Variables
const formulario = document.getElementById('formulario');
const input = document.getElementById('input')
const listaTarea = document.getElementById('lista-tareas');
const template  = document.getElementById('template').content;
const fragment = document.createDocumentFragment();

let tareas = { };

// Eventos
// Cuando el documento se termina de cargar
document.addEventListener('DOMContentLoaded',() => {
    if(localStorage.getItem('tareas')) tareas= JSON.parse(localStorage.getItem('tareas'));
    pintarTareas()
});

listaTarea.addEventListener('click', e => btnAccion(e));

formulario.addEventListener('submit',e => {
    e.preventDefault();
    
    setTarea(e);
});

// Funciones
const setTarea = e =>{
    if(input.value.trim() === '') return;
    
    const tarea = {
        id: Date.now(),
        texto: input.value,
        estado: false
    };

    tareas[tarea.id] = tarea;

    formulario.reset();
    input.focus();

    pintarTareas();
}

const pintarTareas = () => {

    localStorage.setItem('tareas',JSON.stringify(tareas));

    if(Object.values(tareas).length == 0){
        listaTarea.innerHTML = `
        <div class="alert alert-dark">No hay tareas pendientes 😁</div>
        `;
        return;
    }

    listaTarea.innerHTML = '';
    Object.values(tareas).forEach(tarea => {
        const clone = template.cloneNode(true);
        clone.querySelector('p').textContent = tarea.texto;

        if(tarea.estado){
            clone.querySelector('.alert').classList.replace('alert-warning','alert-info');
            clone.querySelectorAll('.fa-solid')[0].classList.replace('fa-circle-check','fa-rotate-left');
            clone.querySelector('p').style.textDecoration = 'line-through'
        }

        clone.querySelectorAll('.fa-solid')[0].dataset.id = tarea.id;
        clone.querySelectorAll('.fa-solid')[1].dataset.id = tarea.id;
        fragment.appendChild(clone);
    });

    listaTarea.appendChild(fragment);
}

const btnAccion = e => {
    if(e.target.classList.contains('fa-circle-check')){
        tareas[e.target.dataset.id].estado = true;
    }

    if(e.target.classList.contains('fa-rotate-left')){
        tareas[e.target.dataset.id].estado = false;
    }

    if(e.target.classList.contains('fa-circle-minus')){
        delete tareas[e.target.dataset.id];
    }

    pintarTareas();
    e.stopPropagation();
}