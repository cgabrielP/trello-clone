import React from 'react'
import TodoList from './TodoList'

const Board = ({userId}) => {
    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-lg flex justify-between">
                <h2 className="p-2 order-first text-xl text-black font-semibold ">Tablero</h2>
            </div>
            <TodoList userId={userId} />
        </>
    )
}

export default Board