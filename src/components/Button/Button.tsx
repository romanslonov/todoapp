import cx from 'clsx';
import { ButtonHTMLAttributes } from 'react';

import styles from './styles.module.less';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  appearance?: 'primary' | 'secondary';
  loading?: boolean;
  disabled?: boolean;
  icon?: boolean;
}

export default function Button({
  appearance = 'primary',
  children,
  loading,
  disabled,
  icon,
  ...props
}: Props) {
  return (
    <button
      className={cx([
        styles.button,
        { [styles.icon]: icon },
        { [styles.disabled]: disabled || loading },
        styles[appearance],
      ])}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Submitting...' : children}
    </button>
  );
}
