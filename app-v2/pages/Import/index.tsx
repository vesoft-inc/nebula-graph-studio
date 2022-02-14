import { Radio } from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation, Route } from 'react-router-dom';

import { trackPageView } from '@appv2/utils/stat';

import FileUpload from './FileUpload';
import './index.less';
import TaskList from './TaskList';

const NewImport = () => {
  const history = useHistory();
  const location = useLocation();
  const [tab, setTab] = useState('files');
  useEffect(() => {
    const path = location.pathname;
    console.log('path', path)
    setTab(path.includes('files') ? 'files' : 'tasks')
    trackPageView('/import');
  }, []);
  const handleTabChange = e => {
    setTab(e.target.value)
    history.push(`/import/${e.target.value}`);
  };
  return (
    <div className="nebua-import-page">
      <div className="tab-header">
        <Radio.Group
          className="import-tab"
          value={tab}
          buttonStyle="solid"
          onChange={handleTabChange}
        >
          <Radio.Button value="files">Upload Files</Radio.Button>
          <Radio.Button value="tasks">Import Data</Radio.Button>
        </Radio.Group>
      </div>
      <div>
        <Route
          path={`/import/files`}
          exact={true}
          component={FileUpload}
        />
        <Route
          path={`/import/tasks`}
          exact={true}
          component={TaskList}
        />
      </div>
    </div>
  );
};

export default NewImport;
