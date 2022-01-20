import {
  Breadcrumb,
  Button,
  Checkbox,
  Col,
  Collapse,
  Form,
  Input,
  Modal,
  Popover,
  Row,
  Select,
  message
} from 'antd';
import _ from 'lodash';
import React from 'react';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { RouteComponentProps, match, withRouter } from 'react-router-dom';
import { LeftOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/es/form';

import GQLCodeMirror from '#app/components/GQLCodeMirror';
import { nameRulesFn, numberRulesFn } from '#app/config/rules';
import { IDispatch, IRootState } from '#app/store';
import { DATA_TYPE, EXPLAIN_DATA_TYPE } from '#app/utils/constant';
import { getTagOrEdgeCreateGQL } from '#app/utils/gql';
import { trackEvent, trackPageView } from '#app/utils/stat';

import './Create.less';

const Panel = Collapse.Panel;
const Option = Select.Option;
const confirm = Modal.confirm;

let id = 1;

const mapState = (state: IRootState) => ({
  loading: state.loading.effects.nebula.asyncCreateEdge,
});

const mapDispatch = (dispatch: IDispatch) => ({
  asyncCreateEdge: dispatch.nebula.asyncCreateEdge,
});

interface IProps
  extends ReturnType<typeof mapState>,
  ReturnType<typeof mapDispatch>,
  RouteComponentProps {
  match: match<{ space: string }>;
}

interface IState {
  fieldRequired: boolean;
  ttlRequired: boolean;
}

class CreateEdge extends React.Component<IProps, IState> {
  formRef = React.createRef<FormInstance>()
  constructor(props: IProps) {
    super(props);
    this.state = {
      fieldRequired: false,
      ttlRequired: false,
    };
  }

  componentDidMount() {
    trackPageView('/schema/config/edge/create');
  }

  handleAddProperty = async() => {
    const form = this.formRef.current!;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    await form.setFieldsValue({
      keys: nextKeys,
    });
  };

  handleDeleteField = (index: number) => {
    const form = this.formRef.current!;
    const keys = form.getFieldValue('keys');
    const fields = form.getFieldValue('fields');
    if (keys.length === 1) {
      return;
    }
    form.setFieldsValue(
      {
        keys: keys.filter((_, i) => i !== index),
        fields: fields.filter((_, i) => i !== index),
      },
    );
  };

  handleTogglePanels = async(e: string | string[], type: string) => {
    const { setFieldsValue } = this.formRef.current!;
    const self = this;
    const key = `${type}Required`;
    if (e.length > 0) {
      await self.setState({
        [key]: true,
      } as Pick<IState, keyof IState>);
    } else {
      confirm({
        title: intl.get('schema.cancelOperation'),
        content: intl.get('schema.cancelPropmt'),
        okText: intl.get('common.yes'),
        cancelText: intl.get('common.no'),
        onOk: async() => {
          await self.setState({
            [key]: false,
          } as Pick<IState, keyof IState>);
          if (type === 'field') {
            // reset form
            id = 1;
            await setFieldsValue({
              keys: [0],
            });
          } else {
            await setFieldsValue({
              ttl: undefined,
            });
          }
        },
      });
    }
  };

  renderFields = () => {
    const { fieldRequired } = this.state;
    const { getFieldsValue } = this.formRef.current!;
    const form = getFieldsValue();
    const { keys, fields } = form;
    const itemLayout = {
      label: ' ',
      colon: false,
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 12,
      },
    };
    if (fieldRequired) {
      const formItems = keys.map((_, k: number) => (
        <div key={k} className="form-item">
          <Col span={4}>
            <Form.Item {...itemLayout} name={`fields[${k}].name`} initialValue="" rules={nameRulesFn(intl)}>
              <Input placeholder={intl.get('formRules.propertyRequired')} />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item {...itemLayout} wrapperCol={{ span: 18 }} name={`fields[${k}].type`} initialValue="" rules={[
              {
                required: true,
                message: intl.get('formRules.dataTypeRequired'),
              },
            ]}>
              <Select className="select-type" showSearch={true}>
                {DATA_TYPE.map(item => {
                  return (
                    <Option value={item.value} key={item.value}>
                      {item.label}
                    </Option>
                  );
                })}
              </Select>
              {fields && fields[k] && fields[k].type === 'fixed_string' && (
                <Form.Item className="item-string-length" name={`fields[${k}].fixedLength`} rules={[
                  ...numberRulesFn(intl),
                  {
                    required: true,
                    message: intl.get('formRules.numberRequired'),
                  },
                ]}>
                  <Input className="input-string-length" />
                </Form.Item>
              )}
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item {...itemLayout} className="center" name={`fields[${k}].allowNull`} initialValue={true} valuePropName="checked">
              <Checkbox />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item {...itemLayout} name={`fields[${k}].value`} initialValue="">
              {fields &&
              fields[k] &&
              EXPLAIN_DATA_TYPE.includes(fields[k].type) ? (
                  <Popover
                    trigger="focus"
                    placement="right"
                    content={intl.getHTML(`schema.${fields[k].type}Format`)}
                  >
                    <Input
                      placeholder={intl.get('formRules.defaultRequired')}
                    />
                  </Popover>
                ) : (
                  <Input
                    placeholder={intl.get('formRules.defaultRequired')}
                  />
                )}
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item {...itemLayout} name={`fields[${k}].comment`}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={2}>
            {keys.length > 1 && (
              <MinusCircleOutlined
                className="delete-button"
                onClick={() => this.handleDeleteField(k)}
              />
            )}
          </Col>
        </div>
      ));
      return formItems;
    } else {
      return null;
    }
  };

  renderTtlConfig = () => {
    const { ttlRequired } = this.state;
    const { getFieldsValue } = this.formRef.current!;
    const innerItemLayout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 9,
      },
    };
    const fields = getFieldsValue().fields ? getFieldsValue().fields : [];
    const ttlOptions = fields.filter(i =>
      ['int', 'timestamp'].includes(i.type),
    );
    if (ttlRequired) {
      return (
        <>
          <Col span={12}>
            <Form.Item label="TTL_COL" {...innerItemLayout} name="ttl.ttl_col" rules={[
              {
                required: true,
                message: intl.get('formRules.ttlRequired'),
              },
            ]}>
              <Select>
                {ttlOptions.map(i => (
                  <Option value={i.name} key={i.name}>
                    {i.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="TTL_DURATION" {...innerItemLayout} name="ttl.ttl_duration" rules={[
              {
                required: true,
                message: intl.get('formRules.ttlDurationRequired'),
              },
              {
                message: intl.get('formRules.positiveIntegerRequired'),
                pattern: /^\d+$/,
                transform(value) {
                  if (value) {
                    return Number(value);
                  }
                },
              },
            ]}>
              <Input
                placeholder={intl.get('formRules.ttlDurationRequired')}
              />
            </Form.Item>
          </Col>
        </>
      );
    } else {
      return null;
    }
  };

  handleCreate = () => {
    const { match } = this.props;
    const {
      params: { space },
    } = match;
    this.formRef.current!.validateFields().then(value => {
      const { name, fields, ttl: ttlConfig, comment } = value;
      const uniqFields = _.uniqBy(fields, 'name');
      if (fields && fields.length !== uniqFields.length) {
        return message.warning(intl.get('schema.uniqProperty'));
      } else {
        this.props
          .asyncCreateEdge({
            name,
            comment,
            fields,
            ttlConfig,
          })
          .then(res => {
            if (res.code === 0) {
              message.success(intl.get('schema.createSuccess'));
              this.props.history.push(`/space/${space}/edge/edit/${name}`);
            } else {
              message.warning(res.message);
            }
          });
      }
    });
  };

  goBack = e => {
    e.preventDefault();
    const { match, history } = this.props;
    const {
      params: { space },
    } = match;
    confirm({
      title: intl.get('schema.leavePage'),
      content: intl.get('schema.leavePagePrompt'),
      okText: intl.get('common.confirm'),
      cancelText: intl.get('common.cancel'),
      onOk() {
        history.push(`/space/${space}/edge/list`);
        trackEvent('navigation', 'view_edge_list', 'from_edge_create');
      },
    });
  };

  render() {
    const { loading } = this.props;
    const { fieldRequired, ttlRequired } = this.state;
    const { getFieldsValue, getFieldValue } = this.formRef.current!;
    const fieldTable = this.renderFields();
    const ttlTable = this.renderTtlConfig();
    const edgeName = getFieldValue('name');
    const comment = getFieldValue('comment');
    const fields = getFieldsValue().fields
      ? getFieldsValue().fields.filter(i => i)
      : [];
    const ttlConfig = getFieldsValue().ttl ? getFieldsValue().ttl : undefined;
    const outItemLayout = {
      labelCol: {
        span: 2,
      },
      wrapperCol: {
        span: 6,
      },
    };
    const currentGQL = edgeName
      ? getTagOrEdgeCreateGQL({
        type: 'EDGE',
        name: edgeName,
        fields,
        ttlConfig,
        comment,
      })
      : '';
    return (
      <div className="space-config-component nebula-edge-create">
        <header>
          <Breadcrumb className="breadcrumb-bold">
            <Breadcrumb.Item>{intl.get('common.edge')}</Breadcrumb.Item>
            <Breadcrumb.Item>
              <a href="#" onClick={this.goBack}>
                {intl.get('common.list')}
              </a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{intl.get('common.create')}</Breadcrumb.Item>
          </Breadcrumb>
          <Button onClick={this.goBack}>
            <LeftOutlined />
            {intl.get('schema.backToEdgeList')}
          </Button>
        </header>
        <div className="edge-form">
          <Form ref={this.formRef} initialValues={{ keys: 0 }}>
            <Form.Item label={intl.get('common.name')} {...outItemLayout} name="name" rules={nameRulesFn(intl)}>
              <Input />
            </Form.Item>
            <Form.Item label={intl.get('common.comment')} {...outItemLayout} name="comment">
              <Input />
            </Form.Item>
            <Collapse
              activeKey={fieldRequired ? ['field'] : []}
              expandIcon={() => {
                return <Checkbox checked={fieldRequired} />;
              }}
              onChange={e => {
                this.handleTogglePanels(e, 'field');
              }}
            >
              <Panel header={intl.get('schema.defineFields')} key="field">
                <Row className="form-header">
                  <Col span={4}>{intl.get('common.propertyName')}</Col>
                  <Col span={5}>{intl.get('common.dataType')}</Col>
                  <Col span={4}>{intl.get('common.allowNull')}</Col>
                  <Col span={5}>{intl.get('common.defaults')}</Col>
                  <Col span={4}>{intl.get('common.comment')}</Col>
                </Row>
                {fieldTable}
                <Row className="form-footer">
                  <Button type="primary" onClick={this.handleAddProperty}>
                    {intl.get('common.addProperty')}
                  </Button>
                </Row>
              </Panel>
            </Collapse>
            <Collapse
              activeKey={ttlRequired ? ['ttl'] : []}
              expandIcon={() => {
                return <Checkbox checked={ttlRequired} />;
              }}
              onChange={e => {
                this.handleTogglePanels(e, 'ttl');
              }}
            >
              <Panel header={intl.get('schema.setTTL')} key="ttl">
                {ttlTable}
              </Panel>
            </Collapse>
          </Form>
          <GQLCodeMirror currentGQL={currentGQL} />
          <div className="btns">
            <Button
              type="primary"
              loading={!!loading}
              onClick={this.handleCreate}
            >
              <PlusOutlined />
              {intl.get('common.create')}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(
  connect(mapState, mapDispatch)(CreateEdge),
);
