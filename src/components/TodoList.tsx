import { atom, useAtom } from "jotai";
import { useState } from "react";
import './TodoList.css';

type Todo = {
    id: number;
    text: string;
    completed: boolean;
}

type Todos = Todo[];

const todosAtom = atom<Todos>([]);

const addTodoAtom = atom(null, (get, set, text: string) => {
    const todos = get(todosAtom);
    const newTodo = {
        id: todos.length + 1,
        text,
        completed: false,
    };
    set(todosAtom, [...todos, newTodo]);
});

const toggleTodoAtom = atom(null, (get, set, id: number) => {
    const todos = get(todosAtom);
    const updatedTodos = todos.map((todo) => {
        if (todo.id === id) {
            return {
                ...todo,
                completed: !todo.completed
            };
        }
        return todo;
    });
    set(todosAtom, updatedTodos);
});

const clearCheckedTodo = atom(null, (get, set) => {
    const todos = get(todosAtom);
    const updatedTodos = todos.filter((todo) => !todo.completed);
    set(todosAtom, updatedTodos);
})

const TodoList: React.FC = () => {
    const [text, setText] = useState('');
    const [todos] = useAtom(todosAtom);
    const [, addTodo] = useAtom(addTodoAtom);
    const [, toggleTodo] = useAtom(toggleTodoAtom);
    const [, clearChecked] = useAtom(clearCheckedTodo);

    const handleAddTodo = () => {
        if (text.trim()) {
            addTodo(text);
            setText('');
        }
    };

    const handleToggleTodo = (id: number) => {
        toggleTodo(id);
    };

    const handleClearCompleted = () => {
        clearChecked();
    };

    const renderedTodos = todos.map((todo) => (
        <div key={todo.id} className="todo-list-item mb-3">
            <label className="checkbox">
                <input className="mr-3"
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleTodo(todo.id)}
                />
                <span>{todo.text}</span>
            </label>
        </div>
    ));

    return (
        <section className="section m-auto">
            <div className="columns is-centered m-auto">
                    <div className="panel is-success w-40">
                        <h3 className="panel-heading py-4">To-do List</h3>
                        <div className="todo-add">
                                <div className="field is-grouped">
                                    <div className="control is-expanded">
                                        <input
                                            className="input is-success"
                                            placeholder="New Task"
                                            value={text}
                                            autoComplete="off"
                                            onChange={(e) => setText(e.target.value)} />
                                    </div>
                                    <div className="control">
                                        <button className="button is-primary" onClick={handleAddTodo}>Add</button>
                                    </div>
                                </div>
                        <div className="mt-5">
                            {todos.length > 0 ? renderedTodos : <div className="todo-box-empty">Seems like you haven't got any tasks!</div>}
                        </div>                            
                        <div className="panel-block p-0 mt-5">
                            <button className="button is-danger is-outlined is-fullwidth" onClick={handleClearCompleted}>Clear Completed</button>
                        </div>
                        </div>
                    </div>
          
            </div>
        </section>
    );
};

export default TodoList;