import React, { useEffect, useState } from 'react';

import './App.css';

import { getUsers } from './services/userService';



function App() {
  type User = {
    id: number;
    name: string;
  }

  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<string>('')

  useEffect(() => {
    getUsers().then((response) => {
      return response.json();
    }).then((data) => {
      setUsers(data.slice(0, 5));
    })
  }, []);

  const addUser = (name: string) => {
    setUsers((prev: any) => [...prev, { id: users.length + 1, name }])
  }

  return (
    <div className="App">
      <main>
        <h1>Users</h1>
        <ul>
          {users.map((user: any) => (
            <li key={user.id}>{user.id}: {user.name}</li>
          ))}
        </ul>

        <div>
          <input type="text" onChange={(e) => {
            setNewUser(e.target.value);
          }
          } />
          <button onClick={() => addUser(newUser)}>Add User</button>
        </div>
      </main >
    </div >
  );
}



export default App;