import React, { useState, useEffect, useCallback } from "react";
import { useRecoilState } from "recoil";
import { todoState } from "../atoms/todoState";
import { createTodo, getTodos, updateTodo } from "../api/api"; // Ensure getTodos is implemented
import { TodoData } from "../types";
import {
  TextField,
  Button,
  Typography,
  Checkbox,
  List,
  ListItem,
  Container,
  Box,
} from "@mui/material";

const Todo: React.FC = () => {
  const [todos, setTodos] = useRecoilState(todoState);
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getTodos(); // Fetch todos from API
        setTodos(response.data);
      } catch (error) {
        console.error("Failed to fetch todos", error);
        setError("Failed to fetch todos");
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [setTodos]);

  const handleCreateTodo = async () => {
    if (!inputVal.trim()) return;
    setLoading(true);
    setError(null);
    const newTodo: Omit<TodoData, "id"> = {
      title: inputVal,
      description: "",
      completed: false,
    };
    try {
      const response = await createTodo(newTodo);
      setTodos([...todos, response.data]);
      setInputVal("");
    } catch (error) {
      console.error("Failed to create todo", error);
      setError("Failed to create todo");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTodo = useCallback(
    async (todo: TodoData) => {
      if (todo.id === undefined) {
        console.error("Todo ID is undefined");
        setError("Invalid todo ID");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await updateTodo(todo.id, {
          completed: !todo.completed,
        });
        if (response?.data) {
          setTodos(
            todos.map((t) =>
              t.id === todo.id ? { ...t, completed: !todo.completed } : t
            )
          );
        }
      } catch (error) {
        console.error("Failed to update todo", error);
        setError(
          `Failed to update todo: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      } finally {
        setLoading(false);
      }
    },
    [todos, setTodos]
  );

  const handleEdit = (todo: TodoData) => {
    setInputVal(todo.title);
    setIsEditing(true);
    setEditingId(todo.id);
  };

  const handleEditSubmit = async () => {
    if (editingId === null || !inputVal.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await updateTodo(editingId, { title: inputVal });
      if (response?.data) {
        setTodos(
          todos.map((t) => (t.id === editingId ? { ...t, title: inputVal } : t))
        );
      }
      setInputVal("");
      setIsEditing(false);
      setEditingId(null);
    } catch (error) {
      console.error("Failed to update todo", error);
      setError(
        `Failed to update todo: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await updateTodo(id, { deleted: true });
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Failed to delete todo", error);
      setError(
        `Failed to delete todo: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      component="main"
      sx={{
        textAlign: "center",
        marginTop: 10,
        padding: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          maxWidth: 600,
          gap: 2, // Gap between input and button
          marginBottom: 2, // Adjusted spacing between input/button and todos list
        }}
      >
        <TextField
          variant="outlined"
          onChange={(e) => setInputVal(e.target.value)}
          label="Type your task"
          value={inputVal}
          sx={{ flexGrow: 1 }}
        />
        <Button
          size="large"
          variant={isEditing ? "outlined" : "contained"}
          color="primary"
          onClick={isEditing ? handleEditSubmit : handleCreateTodo}
          sx={{ height: 55 }}
          disabled={!inputVal.trim() || loading}
        >
          {isEditing ? "Edit Task" : "Add Task"}
        </Button>
      </Box>
      {error && (
        <Typography color="error" sx={{ marginBottom: 2 }}>
          {error}
        </Typography>
      )}
      <List
        sx={{
          width: "100%",
          maxWidth: 600,
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          border: "1px solid light-gray",
          padding: 1, // Reduced padding for closer spacing
        }}
      >
        {todos.map((todo) => (
          <ListItem
            key={todo.id}
            divider
            sx={{ width: "100%", display: "flex", alignItems: "center" }}
          >
            <Checkbox
              onClick={() => handleUpdateTodo(todo)}
              checked={todo.completed}
            />
            <Typography
              sx={{ width: "70%", color: todo.completed ? "green" : "" }}
            >
              {todo.title}
            </Typography>
            <Button
              onClick={() => handleEdit(todo)}
              variant="contained"
              sx={{ marginLeft: 1 }}
            >
              Edit
            </Button>
            <Button
              onClick={() => handleDelete(todo.id)}
              color="secondary"
              variant="contained"
              sx={{ marginLeft: 1 }}
            >
              Delete
            </Button>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Todo;
