import 'modern-normalize';
import '@/css/common.less';

import { Route, Routes } from 'react-router';

import { TasksProvider } from '@/context/tasks/tasks.provider';
import DefaultLayout from '@/layouts/Default';
import Home from '@/pages/Home';

const App = () => {
  return (
    <TasksProvider>
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </TasksProvider>
  );
};

export default App;
