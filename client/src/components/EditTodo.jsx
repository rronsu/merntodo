import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { ImPencil } from "react-icons/im";
export default function EditTodo({ title, id, handleUpdate }) {
  const [updatedTitle, setUpdatedTitle] = useState(title);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <ImPencil className="iconHover" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Todo</DialogTitle>
          <DialogDescription>Make changes to your todo</DialogDescription>
        </DialogHeader>
        <DialogTrigger asChild>
          <form className="flex flex-col gap-2" action={handleUpdate}>
            <input type="hidden" value={id} name="id" />
            <Label htmlFor="title">Previous Todo</Label>
            <Input
              id="title"
              name="title"
              value={updatedTitle}
              onChange={(e) => setUpdatedTitle(e.target.value)}
              className="col-span-3"
            />
            <DialogFooter>
              <Button>Save changes</Button>
            </DialogFooter>
          </form>
        </DialogTrigger>
      </DialogContent>
    </Dialog>
  );
}
