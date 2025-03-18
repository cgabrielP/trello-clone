import React from 'react'
import TodoList from './TodoList'

const Board = ({ userId }) => {
    return (
        <>
            <div className="w-full bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-black">Tablero</h2>
                <TodoList userId={userId} />
            </div>
        </>
    )
}

export default Board