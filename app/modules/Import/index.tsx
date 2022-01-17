import { Spin } from 'antd';
import React from 'react';
import { connect } from 'react-redux';

import { trackPageView } from '#app/utils/stat';

import './index.less';
import Progress from './Progress';
import Tasks from './Tasks';

const mapState = (state: any) => ({
  loading: state.loading.effects.importData.testImport,
});

const mapDispatch = () => ({});

interface IProps
  extends ReturnType<typeof mapState>,
    ReturnType<typeof mapDispatch> {}

class Import extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  componentDidMount() {
    trackPageView('/import');
  }

  render() {
    const { loading } = this.props;
    return (
      <Spin tip="test config" spinning={loading} wrapperClassName="spin-import">
        <div className="data-import">
          <Progress />
          <Tasks />
        </div>
      </Spin>
    );
  }
}

export default connect(mapState)(Import);
