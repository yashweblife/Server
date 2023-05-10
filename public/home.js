const list = document.querySelector('#list')
const item_name = document.querySelector('#item-name')
const item_info = document.querySelector('#item-info')
const add_item_button = document.querySelector('#add-item-button')
const discard_item_button = document.querySelector('#discard-item-button')

window.addEventListener('load', () => {
    load_initial_todos();
})

add_item_button.addEventListener('click', ()=>{
    server_add_todo()
})

discard_item_button.addEventListener('click', ()=>{
    item_name=""
    item_info="";
})

function create_id(size){
    let output = ""
    for(let i=0;i<size;i++){
        output+= Math.floor(Math.random()*10)
    }
    return(output);
}

async function load_initial_todos() {
    const todos = await server_get_todo_data();
    const refine = JSON.parse(JSON.parse(todos))
    console.log(refine)
    refine.forEach((data) => {
        const item = create_item_component(data)
        list.append(item);
    })
}

function server_get_todo_data() {
    const url = '/get_todo_data'
    return (
        fetch(url)
            .then(data => data.json())
    )
}

function create_dom(data) {
    const output = document.createElement(data.type || 'div')
    if(data.class){
        output.classList.add(data.class);
    }
    output.innerText = data.text || ''
    return (output)
}

function create_item_component(data) {
    let { name, info, id, time, completed } = data;

    const body = create_dom({
        class: 'item'
    })
    body.id = id;
    const header = create_dom({
        class: 'header'
    })
    const h2 = create_dom({
        type: 'h2',
        text: name
    })
    const nav = create_dom({
        type: 'nav',
    })
    const button = create_dom({
        type: 'button'
    })
    const close_icon = create_dom({
        type: 'ion-icon'
    })
    close_icon.name='close-outline'
    const button_1 = create_dom({
        type: 'button'
    })
    const radio = create_dom({
        type: 'ion-icon'
    })
    radio.name = completed ? 'radio-button-on-outline':'radio-button-off-outline'

    const content = create_dom({text:info,class:'content'})

    const footer = create_dom({class:'footer'})
    
    const p = create_dom({type:'p',text:time})


    button.append(close_icon);
    button_1.append(radio);
    nav.append(button, button_1);
    header.append(h2, nav);
    footer.append(p);
    body.append(header, content, footer);
    button.addEventListener('click',()=>{
        body.remove();
        server_remove_todo(id)
    })
    button_1.addEventListener('click',()=>{
        completed = !completed;
        console.log(completed)
        radio.name = completed ? 'radio-button-on-outline':'radio-button-off-outline'
        server_toggle_todo_completed(id, completed);
    })
    return(body);
}

function server_add_todo(){
    const url = '/add_item';
    const data = {
        name:item_name.value,
        info:item_info.value,
        time:new Date(),
        completed:false,
        id: create_id(10)
    }
    list.append(create_item_component(data))
    fetch(url, {
        method:"POST",
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(data)
    })
}

function server_toggle_todo_completed(id, check){
    const url = '/toggle_todo_complete'
    fetch(url,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({id:id, completed:check})
    })
}

function server_remove_todo(id){
    const url = '/remove_item'
    fetch(url,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({id:id})
    })
}