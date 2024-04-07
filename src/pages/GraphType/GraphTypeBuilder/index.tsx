import { Button, ButtonGroup, Container, Grid, TextField } from '@mui/material';
import { Stepper } from '@vesoft-inc/ui-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { CheckboxElement, FormContainer, TextFieldElement, useForm } from 'react-hook-form-mui';
import { useLocation, useNavigate } from 'react-router-dom';
import isEqual from 'lodash.isequal';

import { useModal, useStore } from '@/stores';
import {
  ActionContainer,
  ContentContainer,
  CreateGraphContainer,
  FooterContainer,
  MainContainer,
  StepContainer,
  TableContainer,
} from './styles';
import VisualBuilder from './VisualBuilder';
import NodeTypeTable from './NodeType';
import EdgeTypeTable from './EdgeType';
import Preview from './Preview';
import { IEdgeTypeItem, INodeTypeItem } from '@/interfaces';
import { EdgeDirectionType, MultiEdgeKeyMode } from '@/utils/constant';
import LabelTable from './LabelTable';

enum CreateGraphTypeStep {
  create,
  preview,
}

enum CreateFunction {
  VisiualBuilder,
  NodeTyppe,
  EdgeType,
  Label,
  Index,
}

const FunctionTabs = [
  {
    name: 'Visiual Builder',
    type: CreateFunction.VisiualBuilder,
  },
  {
    name: 'Node Type',
    type: CreateFunction.NodeTyppe,
  },
  {
    name: 'Edge Type',
    type: CreateFunction.EdgeType,
  },
  {
    name: 'Label',
    type: CreateFunction.Label,
  },
  // {
  //   name: 'Index',
  //   type: CreateFunction.Index,
  // },
];

interface GraphTypeBuilderProps {
  mode: 'edit' | 'create' | 'readonly';
}

function GraphTypeBuilder(props: GraphTypeBuilderProps) {
  const { mode } = props;
  const { t } = useTranslation(['graphtype']);
  const [curStep, setCurStep] = useState<CreateGraphTypeStep>(CreateGraphTypeStep.create);
  const { graphtypeStore } = useStore();
  const [curTab, setCurTab] = useState<CreateFunction>(CreateFunction.VisiualBuilder);
  const message = useModal().message;
  const navigate = useNavigate();

  const location = useLocation();

  const form = useForm({
    defaultValues: {
      graphTypeName: '',
      ifNotExists: true,
    },
  });

  useEffect(() => {
    const graphTypeName = location.pathname.split('/').filter((path) => path.length > 0)?.[2];
    if (mode === 'create') {
      graphtypeStore.initSchemaStore();
    } else if (mode === 'edit' && graphTypeName) {
      graphtypeStore.initSchemaStore(graphTypeName);
      form.setValue('graphTypeName', graphTypeName);
    }
    return () => {
      graphtypeStore.destroySchemaStore();
    };
  }, []);

  const handeNextClick = () => {
    form.handleSubmit(() => {
      setCurStep(curStep + 1);
    })();
  };

  const handlePreviousClick = () => {
    setCurStep(curStep - 1);
  };

  const getCreateGraphNgql = () => {
    const { graphTypeName, ifNotExists } = form.getValues();
    const nodeTypeList = graphtypeStore.schemaStore?.nodeTypeList || [];
    const edgeTypeList = graphtypeStore.schemaStore?.edgeTypeList || [];
    const getNodeTypeNgql = (nodeType: INodeTypeItem) => {
      let label = '';
      if (nodeType.labels.length > 0) {
        label += nodeType.labels.length > 1 ? 'LABELS ' : 'LABEL ';
        label += nodeType.labels.map((label) => `${label}`).join('&');
      }
      let property = ``;
      if (nodeType.properties.length > 0) {
        property += `{${nodeType.properties.map((property) => `${property.name} ${property.type} ${property.isPrimaryKey ? 'PRIMARY KEY' : ''}`)}}`;
      }
      return `(${nodeType.name} ${label} ${property})`;
    };
    const getEdgeTypeNgql = (edgeType: IEdgeTypeItem) => {
      let label = '';
      if (edgeType.labels.length > 0) {
        label += edgeType.labels.length > 1 ? 'LABELS ' : 'LABEL ';
        label += edgeType.labels.map((label) => `${label}`).join('&');
      }
      let multiEdge = '';
      if (edgeType.multiEdgeKeyMode === MultiEdgeKeyMode.Auto) {
        multiEdge = ', MULTIEDGE KEY()';
      } else if (edgeType.multiEdgeKeyMode === MultiEdgeKeyMode.Customize) {
        multiEdge = `, MULTIEDGE KEY(${edgeType.properties.map((p) => p.name).join(',')})`;
      }
      let property = ``;
      if (edgeType.properties.length > 0) {
        property += `${edgeType.properties.map((property) => `${property.name} ${property.type}`)}`;
      }
      property = `{${property} ${multiEdge}}`;

      let directions = ['-', '->'];
      if (edgeType.direction === EdgeDirectionType.Backword) {
        directions = ['<-', '-'];
      } else if (edgeType.direction === EdgeDirectionType.Undirected) {
        directions = ['-', '-'];
      }
      return `(${edgeType.srcNode.name})${directions[0]}[${edgeType.name} ${label} ${property}]${directions[1]}(${edgeType.dstNode.name})`;
    };
    const ngql = `CREATE GRAPH TYPE ${ifNotExists ? 'IF NOT EXISTS' : ''} ${graphTypeName} AS {
  ${nodeTypeList
    .map((nodeType) => getNodeTypeNgql(nodeType))
    .concat(edgeTypeList.map((edgeType) => getEdgeTypeNgql(edgeType)))
    .join(',\n  ')}
}`;
    return ngql;
  };

  const getEditGraphNgql = () => {
    if (!graphtypeStore.schemaStore) return '';
    const {
      graphtype: original_graphType,
      nodeTypeList,
      edgeTypeList,
      originalEdgeTypeList,
      originalNodeTypeList,
    } = graphtypeStore.schemaStore;
    if (!original_graphType) return '';
    let ngql = '';
    // const [originalNodeTypeList, originalEdgeTypeList] = await transformGrapTypeByDDL(original_graphType);
    const curGraphTypeName = form.getValues('graphTypeName');
    if (curGraphTypeName !== original_graphType) {
      ngql += `RENAME GRAPH TYPE ${original_graphType} to ${curGraphTypeName} \n`;
    }
    const createNodeTypeList = nodeTypeList.filter(
      (nodeType) => !originalNodeTypeList.find((ot) => ot.name === nodeType.name)
    );
    const dropNodeTypeList = originalNodeTypeList.filter(
      (nodeType) => !nodeTypeList.find((nt) => nt.name === nodeType.name)
    );
    const createEdgeTypeList = edgeTypeList.filter(
      (edgeType) => !originalEdgeTypeList.find((ot) => ot.name === edgeType.name)
    );
    const dropEdgeTypeList = originalEdgeTypeList.filter(
      (edgeType) => !edgeTypeList.find((et) => et.name === edgeType.name)
    );
    const alterNodeTypeList = nodeTypeList.filter((nodeType) => {
      const originalNodeType = originalNodeTypeList.find((ot) => ot.name === nodeType.name);
      if (!originalNodeType) return false;
      return !isEqual(nodeType, originalNodeType);
    });
    const aleterEdgeTypeList = edgeTypeList.filter((edgeType) => {
      const originalEdgeType = originalEdgeTypeList.find((ot) => ot.name === edgeType.name);
      if (!originalEdgeType) return false;
      return !isEqual(edgeType, originalEdgeType);
    });
    createNodeTypeList.forEach((node) => {
      ngql += `CREATE NODE TYPE ${node.name} \n`;
    });
    console.log('createNodeTypeList', createNodeTypeList);
    console.log('dropNodeTypeList', dropNodeTypeList);
    console.log('createEdgeTypeList', createEdgeTypeList);
    console.log('dropEdgeTypeList', dropEdgeTypeList);
    console.log('alterNodeTypeList', alterNodeTypeList);
    console.log('aleterEdgeTypeList', aleterEdgeTypeList);
    return ngql;
  };

  const handleCreateGraphType = async () => {
    const res = await graphtypeStore.createGraphType(getCreateGraphNgql());
    if (res.code === 0) {
      message.success(t('createGraphTypeSuccess', { ns: 'graphtype' }));
      navigate('/graphtype');
    } else {
      message.error(res.message);
    }
  };

  const handleSaveDraft = () => {};

  return (
    <ContentContainer>
      <Container maxWidth="md">
        <Stepper
          activeStep={curStep}
          items={[
            {
              name: t('createGraphType', { ns: 'graphtype' }),
            },
            {
              name: t('preview', { ns: 'graphtype' }),
            },
          ]}
        />
      </Container>
      <MainContainer>
        <ActionContainer sx={{ mb: 2 }}>
          <FormContainer
            formContext={form}
            FormProps={{
              style: {
                width: '100%',
              },
            }}
          >
            <Grid container rowSpacing={2} columnSpacing={3}>
              <Grid item xs={4}>
                <TextFieldElement
                  label={t('graphTypeName', { ns: 'graphtype' })}
                  name="graphTypeName"
                  required
                  size="small"
                  fullWidth
                  component={(props) => (
                    <TextField {...props} disabled={curStep === CreateGraphTypeStep.preview || mode === 'readonly'} />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <CheckboxElement
                  disabled={curStep === CreateGraphTypeStep.preview}
                  label={t('ifNotExsits', { ns: 'graphtype' })}
                  name="ifNotExists"
                />
              </Grid>
            </Grid>
          </FormContainer>
        </ActionContainer>
        <StepContainer display={curStep === CreateGraphTypeStep.create ? 'block' : 'none'}>
          <Container maxWidth="md" sx={{ justifyContent: 'center', display: 'flex', mb: 2 }}>
            <ButtonGroup size="small">
              {FunctionTabs.map((tab) => (
                <Button
                  key={tab.type}
                  onClick={() => setCurTab(tab.type)}
                  variant={curTab === tab.type ? 'contained' : 'outlined'}
                >
                  {tab.name}
                </Button>
              ))}
            </ButtonGroup>
          </Container>
          {curTab === CreateFunction.VisiualBuilder && (
            <CreateGraphContainer>
              <VisualBuilder />
            </CreateGraphContainer>
          )}
          {curTab === CreateFunction.NodeTyppe && (
            <TableContainer>
              <NodeTypeTable />
            </TableContainer>
          )}
          {curTab === CreateFunction.EdgeType && (
            <TableContainer>
              <EdgeTypeTable />
            </TableContainer>
          )}
          {curTab === CreateFunction.Label && (
            <TableContainer>
              <LabelTable />
            </TableContainer>
          )}
        </StepContainer>
        {curStep === CreateGraphTypeStep.preview && (
          <Preview ngql={mode === 'create' ? getCreateGraphNgql() : getEditGraphNgql()} />
        )}
      </MainContainer>
      <FooterContainer>
        {curStep === CreateGraphTypeStep.preview && (
          <Button variant="text" sx={{ mr: '10px', width: '120px' }} onClick={handleSaveDraft}>
            {t('saveAsDraft', { ns: 'graphtype' })}
          </Button>
        )}
        <Button
          disabled={curStep === CreateGraphTypeStep.create}
          variant="outlined"
          onClick={handlePreviousClick}
          sx={{ width: '120px' }}
        >
          {t('previous', { ns: 'graphtype' })}
        </Button>
        {curStep === CreateGraphTypeStep.create && (
          <Button variant="contained" sx={{ ml: '10px', width: '120px' }} onClick={handeNextClick}>
            {t('preview', { ns: 'graphtype' })}
          </Button>
        )}
        {curStep === CreateGraphTypeStep.preview && (
          <Button variant="contained" sx={{ ml: '10px', minWidth: '120px' }} onClick={handleCreateGraphType}>
            {mode === 'create' && t('createGraphType', { ns: 'graphtype' })}
            {mode === 'edit' && t('editGraphType', { ns: 'graphtype' })}
          </Button>
        )}
      </FooterContainer>
    </ContentContainer>
  );
}

export default observer(GraphTypeBuilder);
