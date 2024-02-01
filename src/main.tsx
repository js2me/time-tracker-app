/* eslint-disable import/order */
import './bootstrap';

import '@/app/styles/globals.css';
import '@/routing';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { rootElement } from '@/shared/config/dom';

import '@/widgets/templates';
import '@/entities';
import '@/features';
import '@/pages';

import { App } from '@/app';

createRoot(rootElement).render(<App />);
