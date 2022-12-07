import { useEffect } from 'react';

import Task from '@/components/Task/Task';
import TaskForm from '@/components/TaskForm';
import { useTasks } from '@/hooks/useTasks';

import styles from './styles.module.less';

export default function TasksList() {
  const { fetch, tasks, create, changeStatus, remove, update } = useTasks();

  const activeTasksList = tasks.filter((task) => task.status !== 'completed');
  const completedTasksList = tasks.filter((task) => task.status === 'completed');

  useEffect(() => {
    fetch();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <TaskForm title="Create task" onSubmit={create} submitButtonText="Create task" />
      </div>
      <div>
        <h2 className={styles.title}>Tasks &mdash; {activeTasksList.length}</h2>
        <ul className={styles.list}>
          {activeTasksList.map((task) => (
            <li key={task.id}>
              {
                <Task
                  onChangeStatus={changeStatus}
                  onUpdate={update}
                  onRemove={remove}
                  task={task}
                />
              }
            </li>
          ))}
        </ul>
      </div>

      {completedTasksList.length > 0 && (
        <div>
          <h2 className={styles.title}>Completed &mdash; {completedTasksList.length}</h2>
          <ul className={styles.list}>
            {completedTasksList.map((task) => (
              <li key={task.id}>{<Task onChangeStatus={changeStatus} task={task} />}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
