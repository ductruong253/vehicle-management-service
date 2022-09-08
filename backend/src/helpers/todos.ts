import { TodoAccess } from './todosAcess'
// import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

// TODO: Implement businessLogic
const logger = createLogger('todos')
const todoAccess = new TodoAccess()

export const getTodosByUserId = async (userId: string): Promise<TodoItem[]> => {
    return await todoAccess.getTodosByUserId(userId);
}


export const createTodo = async (userId: string, todo: CreateTodoRequest): Promise<TodoItem> => {
    logger.log('info', 'Received todo create request: '.concat(JSON.stringify(todo)))
    const todoId = uuid.v4();
    const newTodo: TodoItem = {
        ...todo,
        userId,
        todoId,
        createdAt: new Date().toISOString(),
        done: false
    }

    await todoAccess.createTodo(newTodo);
    return newTodo;
}

export const updateTodo = async (userId: string, todoId: string, updatedTodo: UpdateTodoRequest): Promise<void> => {
    await todoAccess.updateTodo(userId, todoId, updatedTodo)
}

export const deleteTodo = async (userId: string, todoId: string): Promise<void> => {
    await todoAccess.deleteTodoItem(userId, todoId)
}

export const generateUploadURL = async (userId: string, todoId: string): Promise<string> => {
    const url = await todoAccess.generateUploadURL(userId, todoId)
    return url 
}