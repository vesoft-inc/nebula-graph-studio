import { Breadcrumb, Button, Popconfirm, Table, message } from 'antd';
import React from 'react';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { Link, RouteComponentProps, match, withRouter } from 'react-router-dom';

import { DeleteTwoTone, FormOutlined, PlusOutlined } from '@ant-design/icons';
import Search from '../Search';
import { IDispatch, IRootState } from '#app/store';
import { sortByFieldAndFilter } from '#app/utils/function';
import { trackPageView } from '#app/utils/stat';

import './index.less';

const mapState = (state: IRootState) => ({
  loading: state.loading.effects.nebula.asyncGetEdgeList,
  edgeList: state.nebula.edgeList,
});

const mapDispatch = (dispatch: IDispatch) => ({
  asyncGetEdgeList: dispatch.nebula.asyncGetEdgeList,
  asyncDeleteEdge: dispatch.nebula.asyncDeleteEdge,
});

interface IProps
  extends ReturnType<typeof mapState>,
  ReturnType<typeof mapDispatch>,
  RouteComponentProps {
  match: match<{ space: string }>;
}

interface IEdgeInfo {
  name: string;
  fields: IField[];
}

interface IField {
  Field: string;
  Type: string;
}

interface IState {
  expandedRowKeys: number[];
  searchVal: string;
}

function renderEdgeInfo(edge: IEdgeInfo) {
  const fieldsColumn = [
    {
      title: intl.get('common.propertyName'),
      dataIndex: 'Field',
      align: 'center' as const,
    },
    {
      title: intl.get('common.dataType'),
      dataIndex: 'Type',
      align: 'center' as const,
    },
  ];
  return (
    <div>
      <p className="table-inner-title">
        {edge.name} {intl.get('common.relatedProperties')}:
      </p>
      <Table
        columns={fieldsColumn}
        dataSource={edge.fields}
        rowKey="Field"
        pagination={false}
      />
    </div>
  );
}
class EdgeList extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      expandedRowKeys: [],
      searchVal: '',
    };
  }

  componentDidMount() {
    trackPageView('/space/config/edge/list');
    this.props.asyncGetEdgeList();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.space !== this.props.match.params.space) {
      this.props.asyncGetEdgeList();
    }
  }

  handleDeleteEdge = async name => {
    const res = await this.props.asyncDeleteEdge(name);
    if (res.code === 0) {
      message.success(intl.get('common.deleteSuccess'));
      await this.props.asyncGetEdgeList();
    } else {
      message.warning(res.message);
    }
  };

  handleRowClick = async record => {
    const { name: key } = record;
    const { expandedRowKeys } = this.state;
    this.setState({
      expandedRowKeys: expandedRowKeys.includes(key) ? [] : [key],
    });
  };

  handleSearch = value => {
    this.setState({
      searchVal: value,
    });
  };

  renderEdgeList = () => {
    const { loading, edgeList } = this.props;
    const { match } = this.props;
    const {
      params: { space },
    } = match;
    const { expandedRowKeys, searchVal } = this.state;
    const data = sortByFieldAndFilter({
      field: 'name',
      searchVal,
      list: edgeList,
    });
    const edgeColumn = [
      {
        title: intl.get('common.name'),
        dataIndex: 'name',
        align: 'center' as const,
      },
      {
        title: intl.get('common.operation'),
        dataIndex: 'operation',
        align: 'center' as const,
        render: (_1, edge) => {
          if (edge.name) {
            return (
              <div className="operation">
                <div>
                  <Button shape="circle">
                    <Link
                      to={`/space/${space}/edge/edit/${edge.name}`}
                      data-track-category="navigation"
                      data-track-action="view_edge_edit"
                      data-track-label="from_edge_list"
                    >
                      <FormOutlined className="edit-btn" />
                    </Link>
                  </Button>
                  <Popconfirm
                    onConfirm={() => {
                      this.handleDeleteEdge(edge.name);
                    }}
                    title={intl.get('common.ask')}
                    okText={intl.get('common.ok')}
                    cancelText={intl.get('common.cancel')}
                  >
                    <Button shape="circle">
                      <DeleteTwoTone
                        twoToneColor="#CF1322"
                      />
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            );
          }
        },
      },
    ];
    return (
      <Table
        className="expanded-table"
        dataSource={data}
        columns={edgeColumn}
        expandedRowRender={renderEdgeInfo}
        onRow={record => {
          return {
            onClick: () => {
              this.handleRowClick(record);
            },
          };
        }}
        expandedRowKeys={expandedRowKeys}
        loading={!!loading}
        rowKey="name"
      />
    );
  };

  render() {
    const { match } = this.props;
    const {
      params: { space },
    } = match;
    return (
      <div className="nebula-edge">
        <header>
          <Breadcrumb className="breadcrumb-bold">
            <Breadcrumb.Item>{intl.get('common.edge')}</Breadcrumb.Item>
            <Breadcrumb.Item>{intl.get('common.list')}</Breadcrumb.Item>
          </Breadcrumb>
        </header>
        <div className="btns">
          <Button type="primary">
            <Link
              to={`/space/${space}/edge/create`}
              data-track-category="navigation"
              data-track-action="view_edge_create"
              data-track-label="from_edge_list"
            >
              <PlusOutlined />
              {intl.get('common.create')}
            </Link>
          </Button>
          <Search onSearch={this.handleSearch} />
        </div>
        {this.renderEdgeList()}
      </div>
    );
  }
}

export default withRouter(connect(mapState, mapDispatch)(EdgeList));
