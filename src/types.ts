export type Category = "work" | "life" | "pet";

export type Task = {
  id: string;
  title: string;
  category: Category;
  dueAt: string; // ISO
  completed: boolean;
  createdAt: string; // ISO
};