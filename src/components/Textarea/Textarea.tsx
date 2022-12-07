import { forwardRef, InputHTMLAttributes, Ref } from 'react';

import styles from './styles.module.less';

interface Props extends InputHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

const Textarea = ({ label, ...props }: Props, ref: Ref<HTMLTextAreaElement>) => {
  return (
    <label>
      <span className={styles.textarea__label}>{label}</span>
      <textarea ref={ref} className={styles.textarea__input} {...props}></textarea>
    </label>
  );
};

export default forwardRef<HTMLTextAreaElement, Props>(Textarea);
