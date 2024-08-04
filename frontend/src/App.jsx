import React from 'react'
import { FiPlus } from 'react-icons/fi'
import { GetTodos, InsertTodo, ToggleTodo } from '../wailsjs/go/main/App'

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
]

const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesdey",
    "Thursday",
    "Friday",
    "Saturday"
]

function App() {

    const date = new Date()
    const month = months[date.getMonth()]

    const [todos, setTodos] = React.useState([])

    const submitTodo = async (e) => {
        e.preventDefault()
        const { value: todo } = e.target.todo
        await InsertTodo(todo)
        await getData()
        document.getElementById("add").close()
        e.target.reset()
    }

    const updateTodo = async (id) => {
        await ToggleTodo(id)
        await getData()
    }

    const getData = async () => {
        const data = await GetTodos()
        if( data !== null){
            setTodos(data)
        }
    }

    React.useEffect(() => {
        getData()
    }, [])

    return (
        <>
            <div className='p-5 bg-gray-600 min-h-screen'>
                <div className='mx-auto max-w-md w-full bg-white rounded'>
                    <div className='border-b-2 border-gray-600'>
                        <div className='flex items-center justify-between p-10'>
                            <div>
                                <div className='text-2xl'>{days[date.getDay()]}</div>
                                <div className='text-3xl font-bold'>{date.getDate()} {month} {date.getFullYear()}</div>
                            </div>
                            <div className='text-xl'>{todos.filter(o=>o.Finish).length} / {todos.length} Tasks</div>
                        </div>
                        <div className='flex justify-end px-10 relative -bottom-7'>
                            <button onClick={() => document.getElementById("add").showModal()} className='btn btn-primary rounded-full h-16 w-16'>
                                <FiPlus size={30} />
                            </button>
                        </div>
                    </div>
                    <div className={`h-[calc(theme('height.screen')-16rem)] overflow-y-scroll`}>
                        {todos.map(item => (
                            <label key={`todos-${item.Id}`} className='flex gap-3 px-8 py-5 cursor-pointer hover:bg-gray-200'>
                                <input onChange={()=>updateTodo(item.Id)} className='checkbox peer' type="checkbox" defaultChecked={item.Finish} />
                                <span className='flex-1 select-none peer-checked:line-through'>{item.Todo}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
            <dialog id="add" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-8">Add Todo</h3>
                    <form onSubmit={submitTodo} className='flex flex-col gap-5'>
                        <div>
                            <label htmlFor="todo">What you want to do?</label>
                            <input autoFocus className='input input-bordered w-full' type="text" id='todo' name='todo' />
                        </div>
                        <div>
                            <button className='btn btn-primary w-full'>Add</button>
                        </div>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    )
}

export default App