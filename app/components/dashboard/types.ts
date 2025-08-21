export type Task = {
  id: number;
  householdId: number;
  assignedToUserId: number | null;
  createdByUserId: number;
  taskName: string;
  taskDescription: string;
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
  completedTasks: number;
  tasks: Task[];
  household: Household;
};

export type Board = {
  unassigned: Task[];
  assigned: Task[];
  done: Task[];
};
