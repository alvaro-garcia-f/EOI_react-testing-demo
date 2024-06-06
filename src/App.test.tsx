import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import App from './App';
import { act } from 'react-dom/test-utils';
import { getUsers } from './services/userService';

test('renders users heading', () => {
  // Given
  render(<App />);
  // When
  const linkElement = screen.getByText("Users");
  // Then
  expect(linkElement).toBeInTheDocument();
});

test('renders user input', () => {
  // Given
  render(<App />);
  // When
  const userInputElement = screen.getByPlaceholderText("Add user");
  // Then
  expect(userInputElement).toBeInTheDocument();
})

test('renders user button', () => {
  // Given
  render(<App />);
  // When
  const userButtonElement = screen.getByText("Add User");
  // Then
  expect(userButtonElement).toBeInTheDocument();
})

test('renders five first users', async () => {
  // Given
  render(<App />)
  let userList
  // When
  await waitFor(() => {
    userList = screen.getAllByTestId("user-item");
  })
  // Then
  expect(userList).toHaveLength(5)
})

test('Add user to list', async () => {
  // Given
  render(<App />)
  // When
  const userInputElement = screen.getByPlaceholderText("Add user");
  const userButtonElement = screen.getByText("Add User");
  fireEvent.change(userInputElement, {target: {value: "Patata"}})
  fireEvent.click(userButtonElement)
  // Then
  expect(screen.getByText(/Patata/)).toBeInTheDocument();
  expect(userInputElement).toHaveValue('')
})

test('New user cannot be empty', async () => {
  // Given
  render(<App />)
  let userList = []
  // When
  const userButtonElement = screen.getByText("Add User");
  await waitFor(() => {
    userList = screen.getAllByTestId("user-item");
  }) 
  fireEvent.click(userButtonElement);
  // Then
  expect(screen.getAllByTestId("user-item")).toHaveLength(userList.length);
})

test('User deletes', async () => {
  // Given
  render(<App />)
  let userList: any
  let deleteButtons: any
  // When
  await waitFor(() => {
    userList = screen.getAllByTestId("user-item");
    deleteButtons = screen.getAllByText("Delete");
  })
  fireEvent.click(deleteButtons[0]);
  // Then
  expect(screen.getAllByTestId("user-item")).toHaveLength(userList.length - 1);
})
    
test('New user cannot be blank spaces', async () => {
  // Given / Arrange
  render(<App />)
  let userList = []
  // When / Act
  const userInputElement = screen.getByPlaceholderText("Add user");
  fireEvent.change(userInputElement, {target: {value: "    "}})
  const userButtonElement = screen.getByText("Add User");
  await waitFor(() => {
    userList = screen.getAllByTestId("user-item");
  }) 
  fireEvent.click(userButtonElement)
  // Then / Assert
  expect(screen.getAllByTestId("user-item")).toHaveLength(userList.length);
})

test('Filter users when clicking in search button', async () => {
  // Given
  render(<App />)
  let userList = []
  // When
  const userInputElement = screen.getByPlaceholderText("Add user");
  fireEvent.change(userInputElement, {target: {value: "Ervin"}});
  const searchButton = screen.getByText("Search User");
  await waitFor(() => {
    userList = screen.getAllByTestId("user-item");
  })
  fireEvent.click(searchButton);
  // Then / Assert
  expect(screen.getAllByTestId("user-item")).toHaveLength(1);
})

test('All users are shown when clicking in search button and input is empty', async () => {
  // Given
  render(<App />)
  let userList = []
  // When
  const userInputElement = screen.getByPlaceholderText("Add user");
  fireEvent.change(userInputElement, {target: {value: ""}});
  const searchButton = screen.getByText("Search User");
  await waitFor(() => {
    userList = screen.getAllByTestId("user-item");
  })
  fireEvent.click(searchButton);
  // Then / Assert
  expect(screen.getAllByTestId("user-item")).toHaveLength(userList.length);
})

test('User list resets when clicking in search button and input is empty', async () => {
  // Given
  render(<App />)
  let userList = []
  const userInputElement = screen.getByPlaceholderText("Add user");
  fireEvent.change(userInputElement, {target: {value: "Ervin"}});
  const searchButton = screen.getByText("Search User");
  await waitFor(() => {
    userList = screen.getAllByTestId("user-item");
  })
  fireEvent.click(searchButton);
  // When
  fireEvent.change(userInputElement, {target: {value: ""}});
  fireEvent.click(searchButton);
  // Then
  expect(screen.getAllByTestId("user-item")).toHaveLength(userList.length);
})

test('When deleting a user does not appear again', async () => {
  // Given
  render(<App />)
  let userList: any
  let deleteButtons: any
  await waitFor(() => {
    userList = screen.getAllByTestId("user-item");
    deleteButtons = screen.getAllByText("Delete");
  })
  fireEvent.click(deleteButtons[0]);
  // When
  const searchButton = screen.getByText("Search User");
  fireEvent.click(searchButton);
  // Then
  expect(screen.getAllByTestId("user-item")).toHaveLength(userList.length - 1);
})

test('renders sort button', () => {
  // Given
  render(<App />);
  // When
  const sortButton = screen.getByText("Sort");
  // Then
  expect(sortButton).toBeInTheDocument();
})

test('Users sort', async () => {
  // Given
  render(<App />);
  let userList: any
  await waitFor(() => {
    screen.getAllByTestId("user-item");
  })
  // When
  const sortButton = screen.getByText("Sort");
  fireEvent.click(sortButton);
  await waitFor(() => {
    userList = screen.getAllByTestId("user-item");
  })
  // Docu within -> https://medium.com/@AbbasPlusPlus/react-testing-library-the-power-of-within-and-getbyrole-586b6435c59c
  console.log(within(userList[0]))
  // Then
  expect(sortButton).toBeInTheDocument();
})