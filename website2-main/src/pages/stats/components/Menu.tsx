import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import {
  AppstoreOutlined,
  SafetyCertificateOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from "react-router-dom";

const { Sider } = Layout;
const items = [
  { key: 'stats', icon: <AppstoreOutlined style={{ fontSize: '18px' }} />, label: 'Stats' },
  { key: 'verify', icon: <SafetyCertificateOutlined style={{ fontSize: '18px' }} />, label: 'Verify' },
];

const StatsSiderMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const selectMenu = location.pathname.split('/')[1] || 'stats';
  const menuClick = (e: string) => {
    navigate(`${e}`);
  };

  return (
    <Sider width={collapsed ? 80 : 256} className="stats-sider" breakpoint="lg" collapsedWidth={0}>
      <div className="stats-sider__inner">
        <div className="stats-sider__meta">
          <div className="stats-sider__meta-box">
          <Button
            className="stats-sider__toggle-btn"
            onClick={() => setCollapsed((prev) => !prev)}
            icon={collapsed ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
          />
          </div>
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={[selectMenu]}
          selectedKeys={[selectMenu]}
          inlineCollapsed={collapsed}
          items={items}
          onClick={(e) => menuClick(e.key)}
          className="stats-sider__menu"
        />
      </div>
    </Sider>
  );
};

export default StatsSiderMenu;
