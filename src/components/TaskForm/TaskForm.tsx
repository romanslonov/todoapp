import { format, isAfter, isBefore, parseISO } from 'date-fns';
import type { UploadResult } from 'firebase/storage';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import Button from '@/components/Button';
import DatetimePicker from '@/components/DatetimePicker';
import FormMessage from '@/components/FormMessage';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';
import type { TaskPayload } from '@/context/tasks/types';
import { useStorage } from '@/hooks/useStorage';
import type { Task } from '@/types/task';

import styles from './styles.module.less';

type FormInputs = {
  title: string;
  content: string;
  due: string;
  files: File[];
};

export default function TaskForm({
  onSubmit,
  title,
  submitButtonText,
  task,
}: {
  onSubmit: (payload: TaskPayload) => Promise<void>;
  title: string;
  submitButtonText: string;
  task?: Task;
}) {
  const [filesURLs, setFielsURLs] = useState<{ url: string; id: string }[]>([]);

  const now = new Date()
    .toISOString()
    .slice(0, new Date().toISOString().lastIndexOf(':'));

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormInputs>({
    mode: 'onBlur',
    defaultValues: useMemo(
      () => ({
        ...(task ? { title: task.title, content: task.content } : {}),
        ...(task && task.due ? { due: format(task.due, "yyyy-MM-dd'T'kk:mm") } : {}),
      }),
      [task],
    ),
  });

  const { getFileDownloadURL } = useStorage();

  const handleAddFile = async (task: Task) => {
    const files =
      task.files.length && !filesURLs.length
        ? task.files
        : task.files.filter((file) => !filesURLs.some((url) => url.id === file.id));

    const urls = await Promise.all(
      files.map((file) =>
        getFileDownloadURL(file.path).then((url) => ({ url, id: file.id })),
      ),
    );

    setFielsURLs([...urls, ...filesURLs]);
  };

  const submit = async (data: FormInputs) => {
    try {
      const payload = {
        ...data,
        files: [...data.files],
      };

      await onSubmit(payload);

      if (!task) reset();
    } catch (error) {
      window.console.error(error);
    }
  };

  useEffect(() => {
    if (task) {
      reset({
        title: task?.title,
        content: task?.content,
        files: [],
        ...(task && task.due ? { due: format(task.due, "yyyy-MM-dd'T'kk:mm") } : {}),
      });

      handleAddFile(task);
    }
  }, [task]);

  return (
    <div>
      <h2 className={styles.title}>{title}</h2>
      <form onSubmit={handleSubmit(submit)} className={styles.form}>
        <div>
          <Input
            label="Title"
            placeholder="Make a dinner"
            {...register('title', { required: 'Title is required.' })}
          />
          {errors.title && <FormMessage>{errors.title?.message}</FormMessage>}
        </div>
        <div>
          <Textarea
            label="Note"
            placeholder="Some note about this task"
            {...register('content', { required: 'Content is required.' })}
          />
          {errors.content && <FormMessage>{errors.content?.message}</FormMessage>}
        </div>
        <div>
          <DatetimePicker
            min={now}
            {...register('due', {
              validate: {
                isMinValueCorrect: (value) => {
                  if (value) {
                    return isBefore(new Date(), parseISO(value));
                  }
                  return true;
                },
              },
            })}
            label="Due (optional)"
          />
          {errors.due && errors.due.type === 'isMinValueCorrect' && (
            <FormMessage>
              You cannot select a due time older than the current one.
            </FormMessage>
          )}
        </div>
        {task && task.files.length ? (
          <ul>
            {task.files.map((file, i) => (
              <li key={file.id}>
                {filesURLs[i] ? (
                  <a target="_blank" href={filesURLs[i].url} rel="noreferrer">
                    {file.name}
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}
        <div>
          <input {...register('files')} multiple type="file" />
        </div>
        <Button loading={isSubmitting} disabled={!isValid} type="submit">
          {submitButtonText}
        </Button>
      </form>
    </div>
  );
}
