import {useState, useEffect} from "react";

const API_BASE = "https://todo-list-mern-peach.vercel.app"

function App() {
    const [todos, setTodos] = useState([]);
    const [popupActive, setPopupActive] = useState(false);
    const [newItem, setNewItem] = useState("");
    
    useEffect(() => {
        getTodos();  
    }, []);

    const getTodos = () => {
        fetch(`${API_BASE}/todos`)
        .then((response) => response.json())
        .then((data) => setTodos(data))
        .catch((err) => console.log("Error", err));
    }

    const handleCheckbox = async (id) => {
		const data = await fetch(`${API_BASE}/todo/complete/${id}`, {method:"PUT"}).then(response => response.json());

		setTodos(todos => todos.map(item => {
			if (item._id === data._id) {
				item.complete = data.complete;
			}

			return item;
		}));
		
	}

    const handleDeleteItem = async (id, event) => {
        event.stopPropagation();
        const response = await fetch(`${API_BASE}/todo/delete/${id}`, {method: "DELETE"})
        if (!response.ok) {
            const message = `An error has occurred: ${response.status}`;
            throw new Error(message);
        }
        const data = await response.json();
        setTodos(todos => todos.filter(item => item._id !== data._id));
    }

    const addNewItem = async () => {
        const data = await fetch(`${API_BASE}/todo/new`, {
            headers: {"Content-Type": "application/json"},
            method: "POST",
            body: JSON.stringify({
                text: newItem
            })
        }).then((response) => response.json());

        setTodos([...todos, data]);
        setPopupActive(false);
        setNewItem("");
   
    }

	return (
		<div className="App">
			<h1>Welcome!</h1>
            <h4>Your Tasks</h4>

            <div className="todos-list">
                {todos.length > 0 ? todos.map(item => (
                    <div className={`item ${item.complete ? "completed" : ""}`} key={item._id} onClick={() => handleCheckbox(item._id)}>
                        <div className="checkbox"></div>
                        <div className="text">{item.text}</div>
                        <div className="delete-item" onClick={(event) => handleDeleteItem(item._id, event)}>X</div>
                    </div>
                    
                )) : (<p></p>)}
            </div>

            <div className="addPopup" onClick={() => setPopupActive(true)}>+</div>
        
            {popupActive ? (
                <div className="popup">
                    <div className="closePopup" onClick={() => setPopupActive(false)}>X</div>
                    <div className="content">
                        <h3>Add Task</h3>
                        <input 
                            type="text"
                            className="add-todo-input"
                            onChange={event => setNewItem(event.target.value)}
                            value={newItem}/>
                        <div className="button" onClick={() => addNewItem()}>Add New Item</div>
                    </div>
                </div>
            ) : ""}

		</div>
	);
}

export default App;
