import React from "react";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useActionState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { login } from "@/actions/userActions";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [state, formAction, isPending] = useActionState(login, {
    success: null,
    error: null,
  });

  useEffect(() => {
    if (state.success) {
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  }, [state.success]);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  console.log(formData);
  return (
    <div className="h-screen flex justify-center items-center transform -translate-y-16">
      <form
        action={formAction}
        className="flex flex-col gap-6 max-w-xl w-full px-8"
      >
        <div className="flex flex-col gap-2">
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            placeholder="EMAIL"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="PASSWORD"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        {state.error && <span className="message">{state.error}</span>}

        <Button disabled={isPending}>
          {isPending ? "logging in..." : "Login"}
        </Button>
        <span className="text-[#63657b] text-center">
          Dont have an account?{" "}
          <Link
            to="/register"
            className="transition ease-in-out hover:cursor-pointer hover:text-primary hover:underline"
          >
            register
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
