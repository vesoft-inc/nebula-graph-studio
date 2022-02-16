import { Button, Form, Modal, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import { observer } from 'mobx-react-lite';
import { useStore } from '@appv2/stores';
import { v4 as uuidv4 } from 'uuid';
import './index.less';

const Option = Select.Option;

interface IProps {
  type: 'vertices' | 'edge';
}
const FormItem = Form.Item;

const FileSelect = (props: IProps) => {
  const { type } = props;
  const { files, dataImport: { update, verticesConfig, edgesConfig } } = useStore();
  const { fileList, asyncGetFiles } = files;
  const [modalVisible, setModalVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const onFinish = (value) => {
    const file = fileList.filter(item => item.name === value.name)[0];
    if(type === 'vertices') {
      update({
        verticesConfig: [...verticesConfig, {
          name: uuidv4(),
          file,
          tags: [],
          idMapping: null,
        }]
      });
    } else {
      update({
        edgesConfig: [...edgesConfig, {
          name: uuidv4(),
          file,
          props: [],
          type: '',
        }]
      });
    }
    setModalVisible(false);
  };
  const handleOpen = e => {
    setPosition({
      x: e.clientX,
      y: e.clientY,
    });
    setModalVisible(true);
  };
  useEffect(() => {
    asyncGetFiles();
  }, []);
  return (
    <div className="file-select">
      <Button type="primary" onClick={handleOpen}>
        + {intl.get('import.bindDatasource')}
      </Button>
      <Modal
        width={300}
        className="add-file-select"
        visible={modalVisible}
        destroyOnClose={true}
        onCancel={() => setModalVisible(false)}
        footer={false}
        closable={false}
        mask={false}
        style={{ top: position.y || undefined, left: position.x || undefined }}
      >
        <Form onFinish={onFinish}>
          <FormItem label={intl.get('import.fileName')} name="name" rules={[{ required: true }]}>
            <Select showSearch={true}>
              {fileList.map((file: any) => (
                <Option value={file.name} key={file.name}>
                  {file.name}
                </Option>
              ))}
            </Select>
          </FormItem>
          <Button htmlType="submit">
            {intl.get('import.confirm')}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default observer(FileSelect);
