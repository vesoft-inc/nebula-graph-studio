import { Button, Divider, Form, Input, Select } from 'antd';
import _ from 'lodash';
import React from 'react';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';

import { FormInstance } from 'antd/es/form';
import { Instruction } from '#app/components';
import GQLCodeMirror from '#app/components/GQLCodeMirror';
import { GRAPH_ALOGORITHM } from '#app/config/explore';
import { IDispatch, IRootState } from '#app/store';
import { getPathGQL } from '#app/utils/gql';

import './index.less';

const Option = Select.Option;

const mapState = (state: IRootState) => ({
  edgeTypes: state.nebula.edgeTypes,
  spaceVidType: state.nebula.spaceVidType,
  loading: state.loading.effects.explore.asyncGetPathResult,
});

const mapDispatch = (dispatch: IDispatch) => ({
  asyncGetEdges: dispatch.nebula.asyncGetEdges,
  asyncGetPathResult: dispatch.explore.asyncGetPathResult,
});

interface IProps
  extends ReturnType<typeof mapState>,
  ReturnType<typeof mapDispatch> {
  closeHandler: any;
}

class AlgorithmQuery extends React.Component<IProps> {
  formRef = React.createRef<FormInstance>()
  componentDidMount() {
    this.props.asyncGetEdges();
  }

  viewDoc = () => {
    window.open(intl.get('explore.docForFindPath'), '_blank');
  };

  handleInquiry = async(data) => {
    const { spaceVidType } = this.props;
    const {
      type,
      srcId,
      dstId,
      relation,
      direction,
      stepLimit,
      quantityLimit,
    } = data;
    await this.props.asyncGetPathResult({
      spaceVidType,
      type,
      srcId,
      dstId,
      relation,
      direction,
      stepLimit,
      quantityLimit,
    });
    this.props.closeHandler();
  };

  render() {
    const { getFieldsValue } = this.formRef.current!;
    const { edgeTypes, spaceVidType, loading } = this.props;
    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 11,
      },
    };
    const {
      type,
      srcId,
      dstId,
      relation,
      direction,
      stepLimit,
      quantityLimit,
    } = getFieldsValue();
    const currentGQL =
      type && srcId && dstId
        ? getPathGQL({
          spaceVidType,
          type,
          srcId,
          dstId,
          relation,
          direction,
          stepLimit,
          quantityLimit,
        })
        : '';
    return (
      <div className="algorithm-query">
        <Form {...formItemLayout} className="algorithm-form" onFinish={this.handleInquiry}>
          <Form.Item
            label={intl.get('common.algorithm')}
            className="select-algorithm"
            name="type"
            rules={[{ required: true }]}
          >
            <Select>
              {GRAPH_ALOGORITHM(intl).map(item => (
                <Option value={item.value} key={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
            <Instruction
              description={intl.get('common.viewDocs')}
              onClick={this.viewDoc}
            />
          </Form.Item>
          <Divider orientation="center">
            {intl.get('explore.algorithmParams')}
          </Divider>
          <Form.Item label={intl.get('explore.srcId')} name="srcId" rules={[
            {
              required: true,
              message: 'Src ID is required',
            },
          ]}>
            <Select mode="tags" />
          </Form.Item>
          <Form.Item label={intl.get('explore.dstId')} name="dstId" rules={[
            {
              required: true,
              message: 'Dst ID is required',
            },
          ]}>
            <Select mode="tags" />
          </Form.Item>
          <Form.Item label={intl.get('explore.relation')} name="relation">
            <Select mode="multiple">
              {edgeTypes.map(e => (
                <Option value={e} key={e}>
                  {e}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label={intl.get('explore.direction')} name="direction">
            <Select allowClear={true}>
              <Option value="REVERSELY" key="REVERSELY">
                  REVERSELY
              </Option>
              <Option value="BIDIRECT" key="BIDIRECT">
                  BIDIRECT
              </Option>
            </Select>
          </Form.Item>
          <Form.Item label={intl.get('explore.stepLimit')} name="stepLimit" rules={[
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
            <Input type="number" />
          </Form.Item>
          <Form.Item label={intl.get('explore.quantityLimit')} name="quantityLimit" rules={[
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
            <Input type="number" />
          </Form.Item>
        </Form>
        <GQLCodeMirror currentGQL={currentGQL} />
        <Form.Item noStyle={true}>
          <Button
            data-track-category="explore"
            data-track-action="query_by_path"
            htmlType="submit"
            type="primary"
            loading={!!loading}
          >
            {intl.get('explore.quiry')}
          </Button>
        </Form.Item>
      </div>
    );
  }
}

export default connect(mapState, mapDispatch)(AlgorithmQuery);
