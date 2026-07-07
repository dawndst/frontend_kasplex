import React from 'react';
import { useNavigate } from "react-router-dom";

// import { Badge, Button, Input, Space, Typography } from 'antd';
// import {
//   BellOutlined,
//   SearchOutlined,
//   SettingOutlined,
//   WalletOutlined,
// } from '@ant-design/icons';

// const { Text } = Typography;
import logo from '@/assets/LOGO1-1.png';
const local = window.location.origin;
const topNavItems = [
    {
    key: 'stats',
    label: 'Stats',
    href: `${local}/#/stats`,
  },
  {
    key: 'explorer',
    label: 'Explorer',
    href: 'https://explorer.kasplex.org/',
  }];
const StatsHeader: React.FC = () => {
  const navigate = useNavigate();
  return (
    <header className="stats-header">
      <div className="stats-header__left">
        <div className="stats-header__bran logo-box" onClick={() => navigate('/')}>
          <img src={logo} alt="Kasplex" />
        </div>
        <nav className="stats-header__nav">
          {topNavItems.map((item, index) => (
            <a
              key={item.key}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={index === 0 ? 'stats-header__nav-link is-active' : 'stats-header__nav-link'}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      {/* <div className="stats-header__right">
        <Input
          allowClear
          prefix={<SearchOutlined />}
          placeholder="Search address, tx, block..."
          className="stats-header__search"
        />
        <Space size={8}>
          <Button type="text" shape="circle" icon={<WalletOutlined />} className="stats-header__icon-btn" />
          <Button type="text" shape="circle" icon={<SettingOutlined />} className="stats-header__icon-btn" />
          <Badge dot>
            <Button type="text" shape="circle" icon={<BellOutlined />} className="stats-header__icon-btn" />
          </Badge>
        </Space>
        <Text className="stats-header__mobile-brand">Kasplex</Text>
      </div> */}
    </header>
  );
};

export default StatsHeader;
