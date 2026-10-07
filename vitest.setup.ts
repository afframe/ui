/// <reference types="vite/client" />
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import './dist/styles.css';
import './dist/charts.css';

afterEach(cleanup);
