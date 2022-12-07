import { forwardRef, InputHTMLAttributes, Ref } from 'react';

import styles from './styles.module.less';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input = ({ label, ...props }: Props, ref: Ref<HTMLInputElement>) => {
  return (
    <label>
      <span className={styles.label}>{label}</span>
      <input ref={ref} className={styles.input} {...props} />
    </label>
  );
};

export default forwardRef<HTMLInputElement, Props>(Input);
