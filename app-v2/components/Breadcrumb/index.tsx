import { Breadcrumb, PageHeader } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

import './index.less';

interface IProps {
  routes: {
    path: string;
    breadcrumbName: string;
  }[];
  extraNode?: JSX.Element;
}

const itemRender = (route, _params, routes, _paths) => {
  const last = routes.indexOf(route) === routes.length - 1;
  const first = routes.indexOf(route) === 0;
  return last ? (
    <span>{route.breadcrumbName}</span>
  ) : (
    <Link to={route.path}>
      {first ? (
        <>
          {/* <BorderVerticleOutlined className="arrow-icon" /> */}
          {route.breadcrumbName}
        </>
      ) : (
        route.breadcrumbName
      )}
    </Link>
  );
};

const NebulaBreadcrumb: React.FC<IProps> = (props: IProps) => {
  const { routes, extraNode } = props;
  return (
    <PageHeader
      title={null}
      className="nebula-breadcrumb"
      breadcrumbRender={() => {
        return <>
          <Breadcrumb 
            className="center-layout"
            routes={routes} 
            itemRender={itemRender} 
          />
          {extraNode}
        </>;
      }}
    />
  );
};

export default NebulaBreadcrumb;
