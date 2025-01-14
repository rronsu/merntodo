import React from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import { ImBin2 } from "react-icons/im";
import { ImCheckmark } from "react-icons/im";
import { Plus } from "lucide-react";
import { Input } from "./ui/input";
import EditTodo from "./EditTodo.jsx";
import Profile from "./Profile";

const fetcher = (url, options = {}) =>
  fetch(url, {
    method: options.method || "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    mode: "cors",
    body: options.body ? JSON.stringify(options.body) : undefined,
  }).then((res) => res.json());

const Todos = () => {
  const { data, error, mutate, isLoading } = useSWR(
    "http://localhost:3000/api/todos",
    fetcher
  );
  if (error) {
    return <h1 className="text-2xl py-2 text-center">Failed to load</h1>;
  }
  if (isLoading) {
    return <h1 className="text-2xl py-2 text-center">loading...</h1>;
  }
  console.log(data);

  function handleError(error) {
    toast.error(error);
    throw new Error(error);
  }

  async function handleAddTodo(e) {
    e.preventDefault();
    const formdata = new FormData(e.target);
    const title = formdata.get("title");

    if (!title.trim().length) {
      toast.error("todo cant be empty loser");
      return;
    }
    const newTodo = {
      title: `${title} adding...`,
      _id: Date.now().toString(),
      isCompleted: false,
    };
    async function addTodo() {
      const response = await fetcher("http://localhost:3000/api/todos", {
        method: "POST",
        body: { title },
      });
      if (response.error) {
        handleError(response.error);
      }
      return [...data, response];
    }
    await mutate(addTodo, {
      optimisticData: [...data, newTodo],
      revalidate: true,
      rollbackOnError: true,
    });
    e.target.reset();
  }

  async function deleteTodo(id) {
    toast.success("todo is gone now get over it lol");
    await mutate(
      async () => {
        const response = await fetcher(
          `http://localhost:3000/api/todos/${id}`,
          {
            method: "DELETE",
          }
        );
        if (response.error) {
          handleError(response.error);
        }
        return data.filter((todo) => todo._id !== id);
      },
      {
        optimisticData: data.filter((todo) => todo._id !== id),
        rollbackOnError: true,
        revalidate: false,
      }
    );
  }
  async function handleComplete(id, isCompleted) {
    await mutate(
      async () => {
        const response = await fetcher(
          `http://localhost:3000/api/todos/${id}`,
          {
            method: "PUT",
            body: { isCompleted: !isCompleted },
          }
        );
        if (response.error) {
          handleError(response.error);
        }
        return data.map((todo) => {
          if (todo._id === id) {
            return { ...todo, isCompleted: !isCompleted };
          }
          return todo;
        });
      },
      {
        optimisticData: data.map((todo) => {
          if (todo._id === id) {
            return { ...todo, isCompleted: !isCompleted };
          }
          return todo;
        }),
        rollbackOnError: true,
        revalidate: false,
      }
    );
  }

  async function handleUpdate(formData) {
    const title = formData.get("title");
    const id = formData.get("id");
    console.log({ title, id });
    await mutate(
      async () => {
        const response = await fetcher(
          `http://localhost:3000/api/todos/${id}`,
          {
            method: "PUT",
            body: { title },
          }
        );
        if (response.error) {
          handleError(response.error);
        }
        return data.map((todo) => {
          if (todo._id === id) {
            return { ...todo, title };
          }
          return todo;
        });
      },
      {
        optimisticData: data.map((todo) => {
          if (todo._id === id) {
            return { ...todo, title };
          }
          return todo;
        }),
        rollbackOnError: true,
        revalidate: false,
      }
    );
  }
  return (
    <div className="mx-auto mt-20 max-w-lg px-4 w-full flex flex-col gap-6">
      <div className="flex justify-end">
        <Profile />
      </div>
      <h1 className="bg-gradient-to-r from-green-900 via-green-600 to-green-800 font-bold text-4xl text-center mb-4 text-transparent bg-clip-text">
        Todo app
      </h1>
      <form onSubmit={handleAddTodo} className="flex gap-4 items-center">
        <Input
          type="text"
          placeholder="write something"
          name="title"
          id="title"
          required
          className="shadow-md"
        />
        <button className="h-9 rounded-md border border-input bg-transparent px-4 text-base shadow-md flex items-center hover:bg-primary transition ease-linear group">
          <Plus
            size={20}
            className="transition ease-linear group-hover:stroke-white"
          />
        </button>
      </form>
      {data?.length ? (
        <div className="shadow-md border-2 border-input bg-transparent flex flex-col rounded">
          {data.map((todo, index) => (
            <div
              key={index}
              className={`flex h-10 items-center w-full ${
                index === data.length - 1 ? "border-b-0" : "border-b-2"
              }`}
            >
              <span
                className={`flex-1 px-3 ${
                  todo.isCompleted && "line-through text-[#63657b]"
                }`}
              >
                {todo.title}
              </span>
              <div className="px-3 flex gap-2">
                <ImCheckmark
                  onClick={() => handleComplete(todo._id, todo.isCompleted)}
                  className={`transition ease-in-out hover:cursor-pointer ${
                    todo.isCompleted ? "text-primary" : "text-slate-300"
                  }`}
                />
                <EditTodo
                  handleUpdate={handleUpdate}
                  id={todo._id}
                  title={todo.title}
                />
                <ImBin2
                  className="iconHover"
                  onClick={() => deleteTodo(todo._id)}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <span>"No todos"</span>
      )}
    </div>
  );
};

export default Todos;
