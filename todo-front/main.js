(function() {

    let container = document.querySelector('.container')


    


    function createContainerForm() {
        let containerForm = document.createElement('div')
        let containerFormTitle = document.createElement('h1')
        let form = document.createElement('form')
        let input = document.createElement('input')
        let btnNewList = document.createElement('button')

        containerForm.classList = 'container__form'
        containerFormTitle.classList = 'container__form-title'
        containerFormTitle.textContent = 'Список дел'
        form.classList = 'form'
        input.classList = 'input'
        input.placeholder = 'Введите название нового дела'
        btnNewList.classList = 'btn_new-list'
        btnNewList.textContent = 'Добавить дело'

        container.append(containerForm)
        containerForm.append(containerFormTitle)
        containerForm.append(form)
        form.append(input)
        form.append(btnNewList)
    }


    function createContainerList() {
        let containerList = document.createElement('div')
        let list = document.createElement('ul')


        containerList.classList = 'container__list'
        list.classList = 'list'



        container.append(containerList)
        containerList.append(list)

    }



    async function createItem(name) {
        let item = document.createElement('li')
        let itemTitle = document.createElement('h3')
        let itemButtons = document.createElement('div')
        let btnDone = document.createElement('button')
        let btnDelete = document.createElement('button')
        let list1 = document.querySelector('.list')

        item.classList = 'item'
        itemTitle.classList = 'item-title'
        itemTitle.textContent = name
        itemButtons.classList = 'item-buttons'
        btnDone.classList = 'btn btn_done'
        btnDone.textContent = 'Готво' 
        btnDelete.classList = 'btn btn_delete'
        btnDelete.textContent = 'Удалить'


        list1.append(item)
        item.append(itemTitle)
        item.append(itemButtons)
        itemButtons.append(btnDone)
        itemButtons.append(btnDelete)
    }

    function Fn() {
        createContainerForm()
        createContainerList()


        
    }
    Fn()

    let button1 = document.querySelector('.btn_new-list')
    let input1 = document.querySelector('.input')

    button1.addEventListener('click', function(e) {
        e.preventDefault()

        if (!input1.value) {
            return
        }

        async function createItemToBd() {
            const response = await fetch('http://localhost:3000/api/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: input1.value,
                    owner: 'My'
                })
            })
            const data = await response.json()
            console.log(data)
        }

        createItemToBd()
        
        createItem(input1.value)
        input1.value = ''
        update()
    })
    

    async function update() {
        document.querySelectorAll('.item').forEach((e) => {
            e.remove()
        })

        const response = await fetch('http://localhost:3000/api/todos/')
        const data = await response.json()

        console.log(data)
        
        if(data.length >= 1) {
            for(let key of data) {
                createItem(key.name)
            }
            for(let key in data) {
                if(data[key].done) {
                    document.querySelectorAll('.item')[key].classList.add('item_bg')
                }           
            }
            myFn()           
        }
    }

    update()

    function myFn() {
        document.querySelectorAll('.btn_done').forEach(function(el, key) {
            el.addEventListener('click', async function(){

                const response = await fetch('http://localhost:3000/api/todos/')
                const data = await response.json()

                data[key].done = !data[key].done
                document.querySelectorAll('.item')[key].classList.toggle('item_bg', data[key].done)

                fetch(`http://localhost:3000/api/todos/${data[key].id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({done: data[key].done})
                })
                console.log(data)

                console.log(data[key].done)
               
            })
           })
           
           document.querySelectorAll('.btn_delete').forEach((el, key) => {
               el.addEventListener('click', async () => {
                   if (confirm('Вы уверены?')) {

                        const response = await fetch('http://localhost:3000/api/todos/')
                        const data = await response.json()

                        await fetch(`http://localhost:3000/api/todos/${data[key].id}`, {
                            method: 'DELETE'
                        })
                   update()
                   }
               })
           })
    }
}) ()

