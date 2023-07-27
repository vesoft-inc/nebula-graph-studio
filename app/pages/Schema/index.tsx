import { Button, Popconfirm, Table, message, Popover, Form, Input, Dropdown, Menu, Tooltip, MenuProps } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useI18n } from '@vesoft-inc/i18n';
import Icon from '@app/components/Icon';
import { trackPageView } from '@app/utils/stat';
import { observer } from 'mobx-react-lite';
import { useStore } from '@app/stores';
import cls from 'classnames';
import { Link, useHistory } from 'react-router-dom';
import styles from './index.module.less';
import Search from './SchemaConfig/List/Search';
import DDLButton from './SchemaConfig/DDLButton';

interface ICloneOperations {
  space: string;
  onClone: (name: string, oldSpace: string) => void;
}

const CloneSpacePopover = (props: ICloneOperations) => {
  const { space, onClone } = props;
  const [visible, setVisible] = useState(false);
  const { intl } = useI18n();
  const handleClone = (values) => {
    const { name } = values;
    onClone(name, space);
    setVisible(false);
  };
  return (
    <Popover
      overlayClassName={styles.clonePopover}
      destroyTooltipOnHide={true}
      placement="leftTop"
      open={visible}
      trigger="click"
      onOpenChange={(visible) => setVisible(visible)}
      content={
        <Form onFinish={handleClone} layout="inline">
          <Form.Item
            label={intl.get('schema.spaceName')}
            name="name"
            rules={[{ required: true, message: intl.get('formRules.nameRequired') }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary">
              {intl.get('common.confirm')}
            </Button>
          </Form.Item>
        </Form>
      }
    >
      <Button type="link" onClick={() => setVisible(true)}>
        {intl.get('schema.cloneSpace')}
      </Button>
    </Popover>
  );
};

const Schema = () => {
  const { schema, moduleConfiguration } = useStore();
  const [loading, setLoading] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const history = useHistory();
  const { intl } = useI18n();
  const { currentSpace, switchSpace, getSpacesList, deleteSpace, spaceList, cloneSpace } = schema;
  const activeSpace = location.hash.slice(1);
  useEffect(() => {
    trackPageView('/schema');
    getSpaces();
  }, []);

  const handleDeleteSpace = async (name: string) => {
    setLoading(true);
    const res = await deleteSpace(name);
    setLoading(false);
    if (res.code === 0) {
      message.success(intl.get('common.deleteSuccess'));
      await getSpaces();
      if (currentSpace === name) {
        schema.update({
          currentSpace: '',
        });
        localStorage.removeItem('currentSpace');
      }
    }
  };

  const viewSpaceDetail = useCallback(async (space: string) => {
    const ok = await switchSpace(space);
    ok && history.push(`/schema/tag/list`);
  }, []);
  const getSpaces = useCallback(async () => {
    setLoading(true);
    await getSpacesList();
    setLoading(false);
  }, []);

  const handleCloneSpace = useCallback(async (name: string, oldSpace: string) => {
    const { code } = await cloneSpace(name, oldSpace);
    if (code === 0) {
      message.success(intl.get('schema.createSuccess'));
      getSpaces();
    }
  }, []);
  const columns = [
    {
      title: intl.get('schema.No'),
      dataIndex: 'serialNumber',
      align: 'center' as const,
    },
    {
      title: intl.get('schema.spaceName'),
      dataIndex: 'Name',
      width: 150,
      ellipsis: {
        showTitle: false,
      },
      render: (data) => (
        <Tooltip placement="topLeft" title={data}>
          <a
            className={styles.cellBtn}
            type="link"
            onClick={() => viewSpaceDetail(data)}
            data-track-category="navigation"
            data-track-action="view_space_list"
            data-track-label="from_space_list"
          >
            {data}
          </a>
        </Tooltip>
      ),
    },
    {
      title: intl.get('schema.partitionNumber'),
      dataIndex: 'Partition Number',
    },
    {
      title: intl.get('schema.replicaFactor'),
      dataIndex: 'Replica Factor',
    },
    {
      title: intl.get('schema.charset'),
      dataIndex: 'Charset',
    },
    {
      title: intl.get('schema.collate'),
      dataIndex: 'Collate',
    },
    {
      title: intl.get('schema.vidType'),
      dataIndex: 'Vid Type',
    },
    {
      title: intl.get('schema.group'),
      dataIndex: 'Group',
    },
    {
      title: intl.get('schema.comment'),
      dataIndex: 'Comment',
      ellipsis: {
        showTitle: false,
      },
      render: (data) => (
        <Tooltip placement="topLeft" title={data}>
          {data}
        </Tooltip>
      ),
    },
    {
      title: intl.get('schema.operations'),
      dataIndex: 'operation',
      width: 180,
      render: (_, space) => {
        if (space.ID) {
          return (
            <div className={styles.operation}>
              <Button
                className="primaryBtn"
                onClick={() => viewSpaceDetail(space.Name)}
                data-track-category="navigation"
                data-track-action="view_space_list"
                data-track-label="from_space_list"
              >
                {intl.get('common.schema')}
              </Button>
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'ddl',
                      label: <DDLButton space={space.Name} />,
                    },
                    {
                      key: 'clone',
                      label: <CloneSpacePopover space={space.Name} onClone={handleCloneSpace} />,
                    },
                    {
                      key: 'delete',
                      label: (
                        <Popconfirm
                          onConfirm={() => handleDeleteSpace(space.Name)}
                          title={intl.get('common.ask')}
                          okText={intl.get('common.ok')}
                          cancelText={intl.get('common.cancel')}
                        >
                          <Button type="link" danger>
                            {intl.get('schema.deleteSpace')}
                          </Button>
                        </Popconfirm>
                      ),
                    },
                  ],
                }}
                placement="bottomLeft"
              >
                <Icon className={styles.btnMore} type="icon-studio-more" />
              </Dropdown>
            </div>
          );
        }
      },
    },
  ];
  const data = useMemo(() => spaceList.filter((item) => item.Name.includes(searchVal)), [spaceList, searchVal]);
  return (
    <div className={cls(styles.schemaPage, 'studioCenterLayout')}>
      <div className={styles.schemaHeader}>{intl.get('schema.spaceList')}</div>
      <div className={styles.schemaContainer}>
        <div className={styles.row}>
          <Search type={intl.get('common.space')} onSearch={setSearchVal} />
          {moduleConfiguration.schema.supportCreateSpace && (
            <Button className={cls(styles.btnCreate, 'studioAddBtn')} type="primary">
              <Link
                to="/schema/space/create"
                data-track-category="navigation"
                data-track-action="view_space_create"
                data-track-label="from_space_list"
              >
                <Icon className="studioAddBtnIcon" type="icon-studio-btn-add" />
                {intl.get('schema.createSpace')}
              </Link>
            </Button>
          )}
        </div>
        <Table
          className={styles.tableSpaceList}
          dataSource={data}
          columns={columns}
          loading={!!loading}
          rowKey="ID"
          rowClassName={(item) => (item.Name === activeSpace ? styles.active : '')}
        />
      </div>
    </div>
  );
};

export default observer(Schema);
