import { Box, Button, Container, Divider, Grid, IconButton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Dropdown } from '@vesoft-inc/ui-components';
import { useTheme } from '@emotion/react';
import { AddFilled, DeleteOutline, EditFilled, MoreHorizFilled } from '@vesoft-inc/icons';
import { useStore } from '@/stores';
import { GraphCard, TypeCountTypography } from './styles';
import { HeaderContainer } from './styles';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import CreateGraphModal from './CreateGraphModal';

function GraphType() {
  const { t } = useTranslation(['graphtype', 'common']);
  const theme = useTheme();
  const navigate = useNavigate();
  const { graphtypeStore } = useStore();
  const [modalOpen, setModalOpen] = useState(false);

  const { graphTypeList, getGraphTypeList } = graphtypeStore;

  useEffect(() => {
    getGraphTypeList();
  }, []);

  const handleCreateGraphType = () => {
    navigate('create');
  };

  const handleCreateGraph = () => {
    setModalOpen(true);
  };

  return (
    <Container maxWidth="xl">
      <HeaderContainer>
        <Typography variant="h4" fontSize={24} lineHeight={'36px'}>
          {t('graphTypeList', { ns: 'graphtype' })}
        </Typography>
        <Box>
          <Button variant="outlined" color="primary" sx={{ marginRight: 2 }}>
            {t('draft', { ns: 'graphtype', number: 1 })}
          </Button>
          <Button onClick={handleCreateGraphType} startIcon={<AddFilled />} variant="contained" color="primary">
            {t('createGraphType', { ns: 'graphtype' })}
          </Button>
        </Box>
      </HeaderContainer>
      <Divider />
      <Box>
        {graphTypeList.map((graphtype, index) => {
          return (
            <Box key={index}>
              <Box sx={{ marginTop: 2, marginBottom: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h4" fontSize={16} fontWeight={500} color={theme.palette.vesoft.textColor1}>
                  {graphtype.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TypeCountTypography>{t('nodeTypeCount', { ns: 'graphtype', count: 23 })}</TypeCountTypography>
                  <TypeCountTypography>{t('edgeTypeCount', { ns: 'graphtype', count: 30 })}</TypeCountTypography>
                  <Button variant="outlined" sx={{ marginRight: 2, height: theme.spacing(4.5) }}>
                    <EditFilled fontSize="medium" />
                  </Button>
                  <Button
                    onClick={handleCreateGraph}
                    startIcon={<AddFilled />}
                    sx={{ height: theme.spacing(4.5) }}
                    variant="outlined"
                  >
                    {t('createGraph', { ns: 'graphtype' })}
                  </Button>
                </Box>
              </Box>
              <Grid container spacing={2.5}>
                {graphtype.graphList.map((graph, index) => (
                  <Grid item xs={4} md={4} key={index}>
                    <GraphCard>
                      <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                        <Typography variant="h5" fontSize={20} fontWeight={500} color={theme.palette.vesoft.textColor1}>
                          {graph}
                        </Typography>
                        <Dropdown
                          items={[
                            {
                              key: 'delete',
                              label: (
                                <Typography color={theme.palette.error.main}>
                                  {t('delete', { ns: 'graphtype' })}
                                </Typography>
                              ),
                              icon: <DeleteOutline color="error" fontSize="medium" />,
                            },
                          ]}
                          slotProps={{
                            menuList: {
                              sx: {
                                width: '120px',
                              },
                            },
                          }}
                        >
                          <IconButton>
                            <MoreHorizFilled
                              fontSize="medium"
                              sx={{
                                color: theme.palette.vesoft.textColor1,
                              }}
                            />
                          </IconButton>
                        </Dropdown>
                      </Box>
                    </GraphCard>
                  </Grid>
                ))}
              </Grid>
              <Divider sx={{ mt: theme.spacing(4), mb: theme.spacing(4) }} />
            </Box>
          );
        })}
      </Box>
      <CreateGraphModal
        onCancel={() => {
          setModalOpen(false);
        }}
        open={modalOpen}
      />
    </Container>
  );
}

export default observer(GraphType);
