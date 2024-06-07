import React, { useEffect, useState } from 'react';

import './App.css';

import { getUsers } from './services/userService';

function App() {
  type User = {
    id: number;
    name: string;
    purchases: number;
  }

  const [userList, setUserList] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<string>('')

  useEffect(() => {
    getUsers().then((response) => {
      return response.json();
    }).then((data) => {
      const formattedUsers = data.slice(0, 5).map((user: User) => {
        return {...user, purchases: Math.floor(Math.random()*20)}
      })
      setUserList(() => [...formattedUsers]);
      setUsers(() => [...formattedUsers]);
    })

    return () => {
      setUsers([])
    }
  }, []);

  const addUser = (name: string) => {
    if (!/^\s*$/.test(name)) {
      let newUser = { id: userList.length + 1, name, purchases: Math.floor(Math.random()*20)}
      setUsers((prev: any) => [...prev, newUser])
      setUserList((prev: any) => [...prev, newUser])
      setNewUser('')
    }
  }

  const searchUser = (name: string) => {
    if(name === '') setUsers(() => [...userList])
    if (!/^\s*$/.test(name)) {
      setNewUser('')
      const filteredUsers = userList.filter((user) => {
        return user.name.toLocaleLowerCase().includes(name.toLocaleLowerCase())
      })
      setUsers(() => [...filteredUsers])
    }
  }

  const deleteUser = (id: number) => {
    setUsers((prev: any) => prev.filter((user: any) => user.id !== id))
    setUserList((prev: any) => prev.filter((user: any) => user.id !== id))
  }

  const listUsers = () => {
    return users.length > 0 ? users.map((user: any) => (
      <div data-testid="user-item" className="UserItem" key={user.id}>
        <div>{user.name}</div>
        <div >{user.purchases}</div>
        <div>
          <button className='Delete' onClick={() => deleteUser(user.id)}>Delete</button>
        </div>
      </div>
    )) : "No users found"
  }

  return (
    <div className="App">
        <header className="Header">
          <h1>Users</h1>
        </header>
      
      <main className="Main">
        <section className="AddUser">
          <input 
            type="text" 
            placeholder="Add user" 
            value={newUser}
            onChange={(e) => {
              setNewUser(e.target.value);
            }}
          />
          <button className="Add" onClick={() => addUser(newUser)}>Add User</button>
          <button className="Search" onClick={() => searchUser(newUser)}>Search User</button>
          <button className="Sort">Sort</button>
        </section>

        <section className="UserList-Container">
            <div className="UserList">
              <div className='UserItem'>
                <div>Name</div>
                <div>Purchases</div>
                <div>Action</div>
              </div>
              {listUsers()}
            </div>
        </section>
      </main >
    </div >
  );
}



export default App;