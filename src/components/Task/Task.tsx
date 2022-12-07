import CalendarDaysIcon from '@heroicons/react/20/solid/CalendarDaysIcon';
import Cog6ToothIcon from '@heroicons/react/20/solid/Cog6ToothIcon';
import TrashIcon from '@heroicons/react/20/solid/TrashIcon';
import cx from 'clsx';
import { format } from 'date-fns';
import { useState } from 'react';

import Button from '@/components/Button';
import TaskForm from '@/components/TaskForm';
import type { TaskPayload } from '@/context/tasks/types';
import { useTaskExpire } from '@/hooks/useTaskExpire';
import type { Task as TaskType, TaskStatus } from '@/types/task';

import styles from './styles.module.less';

export default function Task({
  task,
  onChangeStatus,
  onUpdate,
  onRemove,
}: {
  task: TaskType;
  onChangeStatus: (taskId: string, status: TaskStatus) => Promise<void>;
  onUpdate?: (taskId: string, data: TaskPayload) => Promise<void>;
  onRemove?: (taskId: string) => void;
}) {
  const [isEditing, toggleEdit] = useState<boolean>(false);
  useTaskExpire(task, () => onChangeStatus(task.id, 'expired'));

  const handleChange = () =>
    task.status === 'completed'
      ? onChangeStatus(task.id, 'active')
      : onChangeStatus(task.id, 'completed');

  return (
    <div
      className={cx(styles.container, {
        [styles.completed]: task.status === 'completed',
        [styles.expired]: task.status === 'expired',
      })}
    >
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <div className={styles.head}>
            <input
              type="checkbox"
              checked={task.status === 'completed'}
              onChange={handleChange}
            />
            <h2 className={styles.title}>{task.title}</h2>
            {task.status === 'expired' && <span className={styles.label}>expired</span>}
          </div>
          {task.due && (
            <div className={styles.footer}>
              <div className={styles.footer__item}>
                {<CalendarDaysIcon width={20} height={20} />}
                <span>{format(task.due, 'dd MMM yyyy h:mma')}</span>
              </div>
            </div>
          )}
        </div>
        <div className={styles.actions}>
          <Button
            appearance={isEditing ? 'primary' : 'secondary'}
            icon
            onClick={() => toggleEdit(!isEditing)}
          >
            {<Cog6ToothIcon width={16} height={16} />}
          </Button>
          {onRemove && (
            <Button appearance="secondary" icon onClick={() => onRemove(task.id)}>
              {<TrashIcon width={16} height={16} />}
            </Button>
          )}
        </div>
      </div>

      {isEditing && onUpdate ? (
        <div>
          <TaskForm
            submitButtonText="Update task"
            title="Update task"
            task={task}
            onSubmit={(data) => onUpdate(task.id, data)}
          />
        </div>
      ) : null}
    </div>
  );
}
