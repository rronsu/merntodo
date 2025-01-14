import React from "react";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useActionState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { register } from "@/actions/userActions";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [state, formAction, isPending] = useActionState(register, {
    success: null,
    error: null,
  });

  useEffect(() => {
    if (state.success) {
      setTimeout(() => {
        navigate("/login");
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
        {state.success && (
          <span className="message successMsg">
            {state.success}
            {"Redirecting..."}
          </span>
        )}

        {state.error && <span className="message">{state.error}</span>}

        <Button disabled={isPending}>
          {isPending ? "Registering..." : "Register"}
        </Button>
        <span className="text-[#63657b] text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="transition ease-in-out hover:cursor-pointer hover:text-primary hover:underline"
          >
            Login
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Register;
