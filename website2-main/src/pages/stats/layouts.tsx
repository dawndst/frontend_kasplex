import React, { PropsWithChildren } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import StatsHeader from '@/pages/stats/components/Header';
import StatsSiderMenu from '@/pages/stats/components/Menu';
// import Footer from '@/pages/stats/components/Footer';
import '@/styles/stats/index.less';

const { Content } = Layout;

const StatsLayout: React.FC<PropsWithChildren> = () => {
  return (
    <Layout className="stats-layout">
      <StatsHeader />
      <Layout>
        <StatsSiderMenu />
        <Layout className="stats-layout__main">
          <Content className="stats-layout__content">
            <Outlet />
          </Content>
          {/* <Footer /> */}
        </Layout>
      </Layout>
    </Layout>
  );
};

export default StatsLayout;
