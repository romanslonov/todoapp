import { forwardRef, InputHTMLAttributes, Ref } from 'react';

import styles from './styles.module.less';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const DatetimePicker = ({ label, ...props }: Props, ref: Ref<HTMLInputElement>) => {
  return (
    <label>
      <span className={styles.label}>{label}</span>
      <input className={styles.input} type="datetime-local" {...props} ref={ref} />
    </label>
  );
};

export default forwardRef<HTMLInputElement, Props>(DatetimePicker);
