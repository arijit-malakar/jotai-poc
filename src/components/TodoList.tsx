import { atom, useAtom } from "jotai";
import { useState } from "react";

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
        <div key={todo.id} className="panel-block">
            <label className="checkbox">
                <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleTodo(todo.id)}
                />
                {todo.text}
            </label>
        </div>
    ));

    return (
        <section className="section m-auto">
            <div className="columns is-centered">
                <div className="column is-two-fifths">
                    <nav className="panel is-success">
                        <p className="panel-heading">To-do List</p>
                        <div className="panel-block">
                            <div className="block m-auto">
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
                            </div>
                        </div>
                        {todos.length > 0 ? renderedTodos : <div className="panel-block"><span className="m-auto">Seems like you haven't got any tasks!</span></div>}
                        <div className="panel-block">
                            <button className="button is-danger is-outlined is-fullwidth" onClick={handleClearCompleted}>Clear Completed</button>
                        </div>
                    </nav>
                </div>
            </div>
        </section>
    );
};

export default TodoList;