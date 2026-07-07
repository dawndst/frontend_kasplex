import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

import AppLayout from '../pages/layout'
import StatsLayout from "@/pages/stats/layouts";
import Index from "../pages/index";
import Faucet from '../pages/faucet'
import Privacypolicy from '../pages/privacypolicy'
import Ecosystem from '../pages/ecosystem'
// import Nopage from '../pages/nopage'
import StatsIndex from '@/pages/stats/index'

import MediaKit from '@/pages/mediaKit';

const AppRouter: React.FC = () => {
    return (
      <HashRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/index" element={<Index />} />
            <Route path="/faucet" element={<Faucet />} />
            <Route path="/privacypolicy" element={<Privacypolicy />} />
            <Route path="/evm" element={<Ecosystem />} />
            <Route path="/mediaKit" element={<MediaKit />} />
            <Route path="*" element={<Index />} />
          </Route>
          <Route element={<StatsLayout />}>
            <Route path="/stats" element={<StatsIndex />} />
          </Route>
        </Routes>
      </HashRouter>
    );
  };

  export default AppRouter

