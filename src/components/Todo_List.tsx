import React, { useState } from "react"
import { gql, useMutation, useQuery } from "@apollo/client"



const DELETE_TODO = gql`
  mutation deleteTodo($id: String!) {
    deleteTodo(id: $id)
  }
`
const UPDATE_TODO = gql`
  mutation updateTodo($id: String!, $status: Boolean!) {
    updateTodo(id: $id, status: $status)
  }
`

const GET_TODOS = gql`
  query GetTodos {
    todos {
      id
      task
      status
    }
  }
`

const TodoList = ({ todos }) => {
    const [deleteTodo] = useMutation(DELETE_TODO)
    const [updateTodo] = useMutation(UPDATE_TODO)
    const { refetch } = useQuery(GET_TODOS)
    const [checked, setChecked] = useState(todos.status)
    const [done,setDone] = useState(false)

    const updateTodoFunc = (id, status) => {
        updateTodo({
            variables: { id: id, status: status },
            refetchQueries: [{ query: GET_TODOS }]

        })
        refetch()

    }
    return (
        <div>
         {todos.length === 0 ? <div>No Todos Pending Add some..</div> : (   
        <ul className="list-group">
            <li className="list-group-item" key={todos.id}>              

                <li id={todos.id}>
                    <h3>{todos.task}</h3>
                    <h4>status: {done ? "Completed" : "Not done Yet"}</h4>
                </li>
                <input
                    className="form-check-input" 
                    type="checkbox"
                    value={checked}                    
                    onChange={() => {
                        setChecked(!checked)
                        setDone(true)
                        updateTodoFunc(todos.id, todos.status)
                    }}
                />
                <button 
                 type="button" 
                 className="btn btn-danger"
                 onClick={() => {
                    deleteTodo({
                        variables: { id: todos.id },
                        refetchQueries: [{ query: GET_TODOS }]
                    })

                }}>Delelte</button>

            </li>
        </ul>
        )}
        </div>
    )
}

export default TodoList