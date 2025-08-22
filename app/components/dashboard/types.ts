export type Task = {
  id: number;
  assignedTo: {
    id: number;
    userName: string;
  } | null;
  createdBy: {
    id: number;
    userName: string;
  };
  name: string;
  description: string;
  createdAt: Date | string;
  completed: boolean;
};

export type Household = {
  id: number;
  inviteCode: string;
  houseName: string;
};

export type DashboardProps = {
  userName: string;
  userId: number;
  avatar: string | null;
  completedTasks: number;
  tasks: Task[] | [];
  household: Household | null;
};

export type Board = {
  unassigned: Task[];
  assigned: Task[];
  done: Task[];
};
