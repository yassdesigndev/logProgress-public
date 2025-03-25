export interface Activity {
  id: string;
  name: string;
  quantity: {
    value: number;
    unit: string;
  };
  date: string;
  type: 'quantity';
}

export interface ActivityLog {
  activities: Activity[];
}