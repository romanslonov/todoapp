import cx from 'clsx';
import { ReactNode } from 'react';

import styles from './styles.module.less';

type Props = {
  type?: 'success' | 'warning' | 'danger';
  children: ReactNode;
};

export default function FormMessage({ type = 'danger', children }: Props) {
  return (
    <p className={cx(styles.message, styles[type])} role="alert">
      {children}
    </p>
  );
}
