import { Button, Collapse, Select, Table, Tooltip } from 'antd';
import React, { useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import cls from 'classnames';
import { useStore } from '@app/stores';
import { useI18n } from '@vesoft-inc/i18n';
import CSVPreviewLink from '@app/components/CSVPreviewLink';
import { CloseOutlined } from '@ant-design/icons';
import Instruction from '@app/components/Instruction';
import { ISchemaEnum } from '@app/interfaces/schema';
import { IEdgeFileItem, ITagFileItem } from '@app/stores/import';
import { IImportFile } from '@app/interfaces/import';
import styles from '../index.module.less';
import FileSelectModal from './FileSelectModal';

const Option = Select.Option;
const Panel = Collapse.Panel;

interface IProps {
  item: ITagFileItem | IEdgeFileItem
  onRemove: (file: ITagFileItem | IEdgeFileItem) => void;
  onReset: (item: ITagFileItem | IEdgeFileItem, file: IImportFile) => void;
  type: ISchemaEnum
}


const VIDSetting = observer((props: {
  data: ITagFileItem | IEdgeFileItem,
  keyMap: {
    idKey: string,
    idFunction?: string,
    idPrefix?: string,
    label: string
  }
}) => {
  const { keyMap: { idKey, idFunction, idPrefix, label }, data } = props;
  const { intl } = useI18n();
  const { schema } = useStore();
  const { spaceVidType } = schema;
  return <div className={styles.row}>
    <Collapse bordered={false} ghost className={styles.vidCollapse}>
      <Panel header={<div className={cls(styles.panelTitle, styles.spaceBetween)}>
        <div>
          <span className={cls(styles.label, styles.required)}>{intl.get(`import.${label}`)}</span>
          <CSVPreviewLink
            onMapping={(index) => data.update({ [idKey]: index })}
            file={data.file}
          >
            {!data[idKey] && data[idKey] !== 0 ? intl.get('import.selectCsvColumn') : `Column ${data[idKey]}`}
          </CSVPreviewLink>
        </div>
        <Instruction description={<>
          <div>
            <span className={styles.title}>{intl.get('import.vidFunction')}</span>
            <span>{intl.get('import.vidFunctionTip')}</span>
          </div>
        </>} />
      </div>} key="default">
        {spaceVidType === 'INT64' && idFunction && <div className={styles.rowItem}>
          <span className={styles.label}>{intl.get('import.vidFunction')}</span>
          <Select
            bordered={false}
            placeholder="Select"
            className={styles.functionSelect}
            allowClear={true}
            value={data[idFunction]}
            dropdownMatchSelectWidth={false}
            popupClassName={styles.selectItems}
            onClick={e => e.stopPropagation()}
            onChange={value => data.update({ [idFunction]: value })}
          >
            <Option value="hash">Hash</Option>
          </Select>
        </div>}
      </Panel>
    </Collapse>
  </div>;
});

const idMap = {
  [ISchemaEnum.Tag]: [{
    idKey: 'vidIndex',
    idFunction: 'vidFunction',
    label: 'vidColumn'
  }],
  [ISchemaEnum.Edge]: [{
    idKey: 'srcIdIndex',
    idFunction: 'srcIdFunction',
    label: 'srcVidColumn'
  }, {
    idKey: 'dstIdIndex',
    idFunction: 'dstIdFunction',
    label: 'dstVidColumn'
  }],
};

const FileMapping = (props: IProps) => {
  const { item, onRemove, type, onReset } = props;
  const { file, props: mappingProps } = item;
  const { intl } = useI18n();
  const [visible, setVisible] = useState(false);
  const [selectFile, setSelectFile] = useState({
    file: null,
    cachedState: null,
  });

  const updateFilePropMapping = (index: number, value: number) => item.updatePropItem(index, { mapping: value });
  const columns = [
    {
      title: intl.get('import.prop'),
      dataIndex: 'name',
      ellipsis: {
        showTitle: false,
      },
      render: (value, record) => {
        return (
          <Tooltip placement="topLeft" title={value}>
            <div className={cls({ [styles.required]: !record.isDefault && !record.allowNull })}>
              {value}
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: intl.get('import.mapping'),
      dataIndex: 'mapping',
      render: (mappingIndex, _, propIndex) => (
        <CSVPreviewLink
          onMapping={columnIndex => updateFilePropMapping(propIndex, columnIndex)}
          file={file}
        >
          {!mappingIndex && mappingIndex !== 0 ? intl.get('import.choose') : `Column ${mappingIndex}`}
        </CSVPreviewLink>
      ),
    },
    {
      title: intl.get('common.type'),
      dataIndex: 'type',
    },
  ];

  const handleUpdateFile = (file, cachedState) => {
    setSelectFile({ file, cachedState });
    onReset(item, file);
    setVisible(false);
  };

  const idConfig = useMemo(() => type === ISchemaEnum.Tag ? idMap[ISchemaEnum.Tag] : idMap[ISchemaEnum.Edge], [type]);
  return (
    <div className={styles.fileMappingContainer}>
      <div className={cls(styles.row, styles.spaceBetween)}>
        <div className={styles.operation}>
          <span className={cls(styles.label, styles.required)}>{intl.get('import.dataSourceFile')}</span>
          <Button type="link" onClick={() => setVisible(true)}>{selectFile.file ? selectFile.file.name : intl.get('import.selectFile')}</Button>
          {selectFile.file && <div className={styles.pathRow}>
            <span className={styles.pathLabel}>{intl.get('import.filePath')}</span>
            <span className={styles.pathValue}>{selectFile.cachedState.path + selectFile.file.name}</span>
          </div>}
        </div>
        <CloseOutlined className={styles.btnClose} onClick={() => onRemove(item)} />
      </div>
      {idConfig.map((idItem, index) => <VIDSetting key={index} keyMap={idItem} data={item} />)}
      <Table
        className={styles.propsMappingTable}
        dataSource={mappingProps.toJSON()}
        columns={columns}
        rowKey="name"
        pagination={false}
      />
      {visible && <FileSelectModal 
        visible={visible}
        cachedDatasourceState={selectFile.cachedState}
        onCancel={() => setVisible(false)} 
        onConfirm={handleUpdateFile} />}
    </div>
  );
};

export default observer(FileMapping);
