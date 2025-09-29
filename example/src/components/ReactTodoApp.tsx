import React, { useState } from "react";

export function ReactTodoApp() {
   const [todos, setTodos] = useState([
      { id: 1, text: "Build reactive framework", done: true },
      { id: 2, text: "Add fine-grained updates", done: true },
      { id: 3, text: "Celebrate!", done: false },
   ]);
   const [inputValue, setInputValue] = useState("");

   const addTodo = () => {
      if (inputValue.trim()) {
         setTodos([...todos, { id: Date.now(), text: inputValue, done: false }]);
         setInputValue("");
      }
   };

   const toggleTodo = (id: number) => {
      setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
   };

   const todosLeft = todos.filter((t) => !t.done).length;

   // Log renders for debugging
   console.log("React TodoApp rendering...");

   return (
      <div className="space-y-4">
         <div className="flex gap-2">
            <input
               type="text"
               value={inputValue}
               onChange={(e) => setInputValue(e.target.value)}
               onKeyDown={(e) => e.key === "Enter" && addTodo()}
               placeholder="What needs to be done?"
               className="flex-1 px-3 py-2 border rounded"
            />
            <button onClick={addTodo} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
               Add
            </button>
         </div>

         <ul className="space-y-2">
            {todos.map((todo) => (
               <li key={todo.id} className="flex items-center gap-2">
                  <input type="checkbox" checked={todo.done} onChange={() => toggleTodo(todo.id)} />
                  <span className={todo.done ? "line-through text-gray-400" : ""}>{todo.text}</span>
               </li>
            ))}
         </ul>

         <div className="text-sm text-gray-600">
            {todosLeft} {todosLeft === 1 ? "item" : "items"} left
         </div>
      </div>
   );
}