import TasksList from '@/components/TasksList/TasksList';

import styles from './styles.module.less';

export default function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Hello!</h1>
      <p className={styles.caption}>Stay productive.</p>
      <TasksList />
    </div>
  );
}
