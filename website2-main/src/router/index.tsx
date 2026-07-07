import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppLayout from '../pages/layout'
import Index from "../pages/index";
import Faucet from '../pages/faucet'
import Privacypolicy from '../pages/privacypolicy'
import Ecosystem from '../pages/ecosystem'
import MediaKit from '@/pages/mediaKit';

const AppRouter: React.FC = () => {
    return (
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/faucet" element={<Faucet />} />
            <Route path="/privacypolicy" element={<Privacypolicy />} />
            <Route path="/evm" element={<Ecosystem />} />
            <Route path="/mediaKit" element={<MediaKit />} />
            <Route path="*" element={<Index />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  };

  export default AppRouter
