import 'bulma/css/bulma.css';
import './App.css';
import TodoList from "./TodoList";

const App: React.FC = () => {
    return (
        <div className="gradient-background">
            <TodoList />
        </div>
    );
};

export default App;