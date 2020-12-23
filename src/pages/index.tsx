import React, { useRef } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import TodoList from "../components/Todo_List";
import Header from "../components/Header";



const ADD_TODO = gql`
  mutation AddTodo($task: String!) {
    addTodo(task: $task) {
      id
    }
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

export default function Home() {
  const { data, loading, error, refetch } = useQuery(GET_TODOS, { pollInterval: 100 })
  const inputRef = useRef(null);
  const [addTodo] = useMutation(ADD_TODO)
  


  const addTodoFunc = () => {
    addTodo({
      variables: { task: inputRef.current.value },
      refetchQueries: [{ query: GET_TODOS }]
    })
    refetch() 
    inputRef.current.value="";   
  }

  return (
    <>
      <Header/>
      {loading ? <div>Loading</div> : null}
      {error ? <div>{error.message}</div> : null}
      <div className="input-group mb-3">        
        <input ref={inputRef} type="text" className="form-control" />
        <button
          type="button"
          className="btn btn-primary"
          onClick={addTodoFunc}>Add Todo</button>
      </div>

      <ul className="list-group">
        <li className="list-group-item">
          {data?.todos.map(todo => (
            <TodoList todos={todo} />
          ))}
        </li>
      </ul>
    </>
  )
}
