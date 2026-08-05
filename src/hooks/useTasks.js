import { supabase } from "../supabase";

export function useTasks({
  user,
  setTasks,
  setSubtasks,
  setLoading,
}) {

  const fetchTasks = async () => {
    if (!user) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("position", { ascending: true });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setTasks(data || []);
    setLoading(false);
  };

  const fetchSubtasks = async () => {
    const { data, error } = await supabase
      .from("subtasks")
      .select("*");

    if (error) {
      console.error(error);
      return;
    }

    setSubtasks(data || []);
  };

  return {
    fetchTasks,
    fetchSubtasks,
    addTask,
  };
}