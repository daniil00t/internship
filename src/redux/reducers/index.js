import { combineReducers } from 'redux'
import { TODO_ADD, TODO_ADD_INIT, TODO_DELETE, TODO_TOGGLE, FILTER_CHANGE, TODO_IMPORT, APP_CHANGE_THEME } from "../types"
import * as localforage from "localforage"

const saveToDB = todo => {
   localforage.setItem(todo.id, todo)
}

const todos = (state = [], action) => {
   switch(action.type){
      case TODO_ADD:
         const todo = {
            id: new Date().valueOf(),
            cnt: action.payload,
            time: new Date().getDay(),
            active: true
         }
         saveToDB(todo)
         return[
            ...state,
            todo
         ]
      case TODO_ADD_INIT:
         return[
            ...state,
            action.payload
         ]
      case TODO_DELETE:
         var newTodos = []
         for (let i = 0; i < state.length; i++) {
            if(state[i].id != action.payload)
               newTodos.push(state[i])
         }
         localforage.removeItem(action.payload).then(item => {
            console.log('deleted')
         })
         return newTodos
      case TODO_TOGGLE:
         var newTodos = []
         let flag = false
         state.map((todo, index) => {
            if(todo.id == action.payload){
               newTodos.push({...todo, active: !todo.active})
               flag = !todo.active
            }
            else
               newTodos.push(todo)
         })
         localforage.getItem(action.payload).then(item => {
            item.active = !item.active
            localforage.setItem(action.payload, item)
         })
         return newTodos
      case TODO_IMPORT:
         action.payload.map(todo => {
            localforage.setItem(todo.id, todo)
         })
         return [
            ...state,
            ...action.payload
         ]
   }
   
   return state
}

const filter = (state="all", action) => {
   switch(action.type){
      case FILTER_CHANGE:
         return action.payload
   }
   return state
}
const app = (state = {theme:"light"}, action) => {
   switch(action.type){
      case APP_CHANGE_THEME:
         // const app =  localforage.createInstance({ name: "mydatabasename" , storeName: "app" })
         localforage.setItem("INTERNSHIP", action.payload)
         return {
            ...state,
            theme: action.payload
         }
   }
   return state
}
const rootReducer = combineReducers({
   app,
	todos,
   filter,
})
 
export default rootReducer