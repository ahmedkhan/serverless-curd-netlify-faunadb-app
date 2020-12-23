
 
const { ApolloServer, gql } = require("apollo-server-lambda")
const faunadb = require("faunadb")
const q = faunadb.query
require('dotenv').config()

var client = new faunadb.Client({
  secret: process.env.FAUNA_DB,
})

const typeDefs = gql`
  type Query {
    todos: [Todo]!
  }
  type Todo {
    id: ID!
    task: String!
    status: Boolean!
  }
  type Mutation {
    addTodo(task: String): Todo
    deleteTodo(id: String): String
    updateTodo(id: String, done: Boolean): String
  }
`

const resolvers = {
  Query: {
    todos: async (parent, args) => {
      const results = await client.query(
        q.Map(
          q.Paginate(q.Match(q.Index("task"))),
          q.Lambda(x => q.Get(x))
        )
      )
      return results.data.map(todo => ({
        id: todo.ref.id,
        task: todo.data.task,
        status: todo.data.status,
      }))
    },
  },
  Mutation: {
    addTodo: async (_, { task }) => {
      const results = await client.query(
        q.Create(q.Collection("todos"), {
          data: {
            task,
            status: false,
          },
        })
      )
      return {
        ...results.data,
        id: results.ts,
      }
    },
    deleteTodo: async (_, { id }) => {
      const results = await client.query(
        q.Delete(q.Ref(q.Collection("todos"), `${id}`))
      )
      return results.ref.id
    },
    updateTodo: async (_, { id, status }) => {
      const results = await client.query(
        q.Update(q.Ref(q.Collection("todos"), `${id}`), {
          data: {
           status : !status,
          },
        })
      )
      return results.ref.id
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

exports.handler = server.createHandler()

