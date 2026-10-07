/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript (props, refs and handlers typed, sibling sizes passed to parseFloat as strings), components from @afframe/ui, icons from @afframe/ui icons, classnames inlined, the size prop that Carbon's Tabs ignores removed, eslint-disable comments for plugins this repo does not use removed. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

// cspell:ignore resizer
import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
  type RefObject,
} from 'react';
import {
  ChevronDown,
  ChevronUp,
  Folders,
  Search,
  SettingsAdjust,
  OpenPanelBottom,
  OpenPanelFilledBottom,
  OpenPanelFilledLeft,
  OpenPanelLeft,
  OpenPanelFilledRight,
  OpenPanelRight,
  Close,
} from '../../icons.js';
import {
  Resizer,
  Search as SearchComponent,
  Layer,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  IconButton,
  TreeView,
  TreeNode,
  Button,
  OverflowMenu,
  OverflowMenuItem,
} from '../../index.js';

type ResizerArgs = ComponentProps<typeof Resizer>;
type ResizerRef = RefObject<HTMLDivElement | null>;
type ResizeEndHandler = (
  event: MouseEvent | KeyboardEvent,
  ref: RefObject<HTMLDivElement>
) => void;
type CollapsedState = Record<string, boolean>;
type EditorTab = { label: string; content: string | undefined };
type FileSelectHandler = (event: unknown, node: { value?: string }) => void;
type ExplorerViewProps = {
  explorerCollapsed: boolean | undefined;
  outlineCollapsed: boolean | undefined;
  onToggleExplorer: () => void;
  onToggleOutline: () => void;
  onFileSelect: FileSelectHandler;
  resizerProps: ResizerArgs;
  explorerResizerRef: ResizerRef;
};

const VIEWS = {
  EXPLORER: 'explorer',
  SEARCH: 'search',
};

const FILE_CONTENTS: Record<string, string> = {
  'App.tsx': `import React from 'react';
import { Resizer } from '@carbon/ibm-products';

const App = () => {
  return (
    <div className="app">
      <h1>Hello World</h1>
      <p>This is a resizable layout demo</p>
    </div>
  );
};

export default App;`,
  'index.tsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
  'Header.tsx': `import React from 'react';

export const Header = () => {
  return (
    <header>
      <h1>My Application</h1>
    </header>
  );
};`,
  'Footer.tsx': `import React from 'react';

export const Footer = () => {
  return (
    <footer>
      <p>&copy; Copyright IBM Corp. 2026</p>
    </footer>
  );
};`,
};

// Toolbar button configuration constants
const ICON_SIZE = 16;
const BUTTON_SIZE = 'md';
const BUTTON_KIND = 'ghost';
const BUTTON_ALIGN = 'left';

const TOOLBAR_BUTTONS = [
  {
    key: 'primarySidebar',
    collapsedLabel: 'Show Primary Sidebar',
    expandedLabel: 'Hide Primary Sidebar',
    CollapsedIcon: OpenPanelLeft,
    ExpandedIcon: OpenPanelFilledLeft,
  },
  {
    key: 'panel',
    collapsedLabel: 'Show Panel',
    expandedLabel: 'Hide Panel',
    CollapsedIcon: OpenPanelBottom,
    ExpandedIcon: OpenPanelFilledBottom,
  },
  {
    key: 'secondarySidebar',
    collapsedLabel: 'Show Secondary Sidebar',
    expandedLabel: 'Hide Secondary Sidebar',
    CollapsedIcon: OpenPanelRight,
    ExpandedIcon: OpenPanelFilledRight,
  },
];

/**
 * Top toolbar component with collapse buttons
 */
const TopToolbar = memo(
  ({
    collapsed,
    onTogglePrimarySidebar,
    onToggleSecondarySidebar,
    onTogglePanel,
  }: {
    collapsed: CollapsedState;
    onTogglePrimarySidebar: () => void;
    onToggleSecondarySidebar: () => void;
    onTogglePanel: () => void;
  }) => {
    const handlers: Record<string, () => void> = {
      primarySidebar: onTogglePrimarySidebar,
      panel: onTogglePanel,
      secondarySidebar: onToggleSecondarySidebar,
    };

    return (
      <div className="web-ide__top-toolbar">
        <div className="web-ide__top-toolbar-left">
          <span className="web-ide__top-toolbar-title">Web IDE Demo</span>
        </div>
        <div className="web-ide__top-toolbar-right">
          {TOOLBAR_BUTTONS.map(
            ({
              key,
              collapsedLabel,
              expandedLabel,
              CollapsedIcon,
              ExpandedIcon,
            }) => {
              const isCollapsed = collapsed[key];
              const Icon = isCollapsed ? CollapsedIcon : ExpandedIcon;

              return (
                <IconButton
                  key={key}
                  label={isCollapsed ? collapsedLabel : expandedLabel}
                  align={BUTTON_ALIGN}
                  kind={BUTTON_KIND}
                  isSelected={!isCollapsed}
                  size={BUTTON_SIZE}
                  onClick={handlers[key]}>
                  <Icon size={ICON_SIZE} />
                </IconButton>
              );
            }
          )}
        </div>
      </div>
    );
  }
);

TopToolbar.displayName = 'TopToolbar';

/**
 * Vertical toolbar (Activity Bar)
 */
const VerticalToolbar = ({
  activeView,
  onViewChange,
  primarySidebarCollapsed,
}: {
  activeView: string;
  onViewChange: (view: string) => void;
  primarySidebarCollapsed: boolean | undefined;
}) => (
  <div className="web-ide__activity-bar">
    <div className="web-ide__activity-bar-top">
      <Button
        hasIconOnly
        renderIcon={Folders}
        iconDescription="Explorer"
        kind="ghost"
        tooltipPosition="right"
        size="md"
        isSelected={activeView === VIEWS.EXPLORER && !primarySidebarCollapsed}
        onClick={() => onViewChange(VIEWS.EXPLORER)}
      />
      <Button
        hasIconOnly
        renderIcon={Search}
        iconDescription="Search"
        kind="ghost"
        tooltipPosition="right"
        size="md"
        isSelected={activeView === VIEWS.SEARCH && !primarySidebarCollapsed}
        onClick={() => onViewChange(VIEWS.SEARCH)}
      />
    </div>
    <div className="web-ide__activity-bar-bottom">
      <OverflowMenu
        renderIcon={SettingsAdjust}
        iconDescription="Settings"
        aria-label="Settings"
        align="right"
        direction="top"
        size="md">
        <OverflowMenuItem itemText="Preferences" />
        <OverflowMenuItem itemText="Extensions" />
        <OverflowMenuItem itemText="Keyboard Shortcuts" />
        <OverflowMenuItem hasDivider itemText="About" />
      </OverflowMenu>
    </div>
  </div>
);

/**
 * Collapsible section header
 */
const SectionHeader = ({
  title,
  collapsed,
  onToggle,
}: {
  title: string;
  collapsed: boolean | undefined;
  onToggle: () => void;
}) => (
  <Layer>
    <div
      className="web-ide__section-header"
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
      role="button"
      tabIndex={0}
      aria-expanded={!collapsed}
      aria-label={`${collapsed ? 'Expand' : 'Collapse'} ${title}`}>
      <span>{title}</span>
      {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
    </div>
  </Layer>
);

/**
 * File explorer tree
 */
const FileExplorer = ({
  onFileSelect,
}: {
  onFileSelect: FileSelectHandler;
}) => (
  <TreeView label="File Explorer" hideLabel size="xs" onSelect={onFileSelect}>
    <TreeNode id="src" label="src" value="src" isExpanded>
      <TreeNode id="app" label="App.tsx" value="App.tsx" />
      <TreeNode id="index" label="index.tsx" value="index.tsx" />
      <TreeNode
        id="components"
        label="components"
        value="components"
        isExpanded>
        <TreeNode id="header" label="Header.tsx" value="Header.tsx" />
        <TreeNode id="footer" label="Footer.tsx" value="Footer.tsx" />
      </TreeNode>
    </TreeNode>
  </TreeView>
);

/**
 * Code outline tree
 */
const OutlineView = () => (
  <TreeView label="Outline" hideLabel size="xs">
    <TreeNode id="functions" label="Functions" value="Functions" isExpanded>
      <TreeNode id="handleClick" label="handleClick()" value="handleClick()" />
      <TreeNode id="render" label="render()" value="render()" />
    </TreeNode>
    <TreeNode
      id="components-outline"
      label="Components"
      value="Components"
      isExpanded>
      <TreeNode id="header-component" label="Header" value="Header" />
    </TreeNode>
  </TreeView>
);

/**
 * Updates aria attributes for a resizer based on sibling element dimensions
 * @param {React.RefObject} resizerRef - Reference to the resizer element
 * @param {Function} onResizeEnd - Optional callback to invoke after update
 * @returns {Function} Event handler for onResizeEnd
 */
const createResizerAriaHandler =
  (_resizerRef: ResizerRef, onResizeEnd?: ResizeEndHandler) =>
  (event: MouseEvent | KeyboardEvent, ref: RefObject<HTMLDivElement>) => {
    const prevSibling = ref.current
      ?.previousElementSibling as HTMLElement | null;
    const nextSibling = ref.current?.nextElementSibling as HTMLElement | null;

    if (prevSibling && nextSibling) {
      const prevHeight = parseFloat(
        prevSibling.style.height || String(prevSibling.offsetHeight)
      );
      const nextHeight = parseFloat(
        nextSibling.style.height || String(nextSibling.offsetHeight)
      );
      const total = prevHeight + nextHeight;

      if (total > 0) {
        const percentage = Math.round((prevHeight / total) * 100);
        ref.current.setAttribute('aria-valuenow', String(percentage));
        ref.current.setAttribute('aria-expanded', String(percentage > 0));
      }
    }

    onResizeEnd?.(event, ref);
  };

/**
 * Collapsible section component
 */
const CollapsibleSection = ({
  title,
  collapsed,
  onToggle,
  children,
  className,
}: {
  title: string;
  collapsed: boolean | undefined;
  onToggle: () => void;
  children: ReactNode;
  className: string;
}) => (
  <div
    className={`web-ide__section ${className}${collapsed ? ' web-ide__section--collapsed' : ''}`}>
    <SectionHeader title={title} collapsed={collapsed} onToggle={onToggle} />
    {!collapsed && <div className="web-ide__section-content">{children}</div>}
  </div>
);

/**
 * Explorer view with file tree and outline
 */
const ExplorerView = ({
  explorerCollapsed,
  outlineCollapsed,
  onToggleExplorer,
  onToggleOutline,
  onFileSelect,
  resizerProps,
  explorerResizerRef,
}: ExplorerViewProps) => (
  <>
    <CollapsibleSection
      title="Explorer"
      collapsed={explorerCollapsed}
      onToggle={onToggleExplorer}
      className="web-ide__section--explorer">
      <FileExplorer onFileSelect={onFileSelect} />
    </CollapsibleSection>

    <Resizer
      {...resizerProps}
      ref={explorerResizerRef}
      orientation="horizontal"
      thickness={1}
      aria-valuemin={0}
      aria-valuemax={100}
      onResizeEnd={createResizerAriaHandler(
        explorerResizerRef,
        resizerProps.onResizeEnd
      )}
    />

    <CollapsibleSection
      title="Outline"
      collapsed={outlineCollapsed}
      onToggle={onToggleOutline}
      className="web-ide__section--outline">
      <OutlineView />
    </CollapsibleSection>
  </>
);

/**
 * Renders the active view content based on the current view type
 */
const renderActiveView = (
  activeView: string,
  explorerCollapsed: ExplorerViewProps['explorerCollapsed'],
  outlineCollapsed: ExplorerViewProps['outlineCollapsed'],
  onToggleExplorer: () => void,
  onToggleOutline: () => void,
  onFileSelect: FileSelectHandler,
  resizerProps: ResizerArgs,
  explorerResizerRef: ResizerRef
) => {
  if (activeView === VIEWS.EXPLORER) {
    return (
      <ExplorerView
        explorerCollapsed={explorerCollapsed}
        outlineCollapsed={outlineCollapsed}
        onToggleExplorer={onToggleExplorer}
        onToggleOutline={onToggleOutline}
        onFileSelect={onFileSelect}
        resizerProps={resizerProps}
        explorerResizerRef={explorerResizerRef}
      />
    );
  }

  if (activeView === VIEWS.SEARCH) {
    return (
      <div className="web-ide__section">
        <div className="web-ide__section-content">
          <Layer>
            <SearchComponent
              labelText="Search"
              placeholder="Search in files"
              size="sm"
            />
          </Layer>
        </div>
      </div>
    );
  }

  return null;
};

/**
 * Primary sidebar with explorer and search views
 */
const PrimarySideBar = ({
  activeView,
  collapsed,
  explorerCollapsed,
  outlineCollapsed,
  onToggleExplorer,
  onToggleOutline,
  onFileSelect,
  resizerProps,
  explorerResizerRef,
  primarySidebarResizerRef,
  updateAllResizerAriaValues,
}: ExplorerViewProps & {
  activeView: string;
  collapsed: boolean | undefined;
  primarySidebarResizerRef: ResizerRef;
  updateAllResizerAriaValues: () => void;
}) => {
  const handleResizeEnd = useCallback(
    (event: MouseEvent | KeyboardEvent, ref: RefObject<HTMLDivElement>) => {
      updateAllResizerAriaValues();
      resizerProps.onResizeEnd?.(event, ref);
    },
    [updateAllResizerAriaValues, resizerProps]
  );

  useEffect(() => {
    updateAllResizerAriaValues();
  }, [
    activeView,
    explorerCollapsed,
    outlineCollapsed,
    collapsed,
    updateAllResizerAriaValues,
  ]);

  return (
    <>
      <div
        className={`web-ide__primary-sidebar${collapsed ? ' web-ide__primary-sidebar--collapsed' : ''}`}>
        {renderActiveView(
          activeView,
          explorerCollapsed,
          outlineCollapsed,
          onToggleExplorer,
          onToggleOutline,
          onFileSelect,
          resizerProps,
          explorerResizerRef
        )}
      </div>

      <Resizer
        {...resizerProps}
        ref={primarySidebarResizerRef}
        orientation="vertical"
        thickness={1}
        className={collapsed ? 'clabs__resizer--hidden' : ''}
        aria-valuemin={0}
        aria-valuemax={100}
        onResizeEnd={handleResizeEnd}
      />
    </>
  );
};

/**
 * Main content area with editor
 */
const MainContent = ({
  tabs,
  selectedIndex,
  onTabChange,
  onTabClose,
}: {
  tabs: EditorTab[];
  selectedIndex: number;
  onTabChange: (state: { selectedIndex: number }) => void;
  onTabClose: (index: number) => void;
}) => (
  <div className="web-ide__editor">
    {tabs.length > 0 ? (
      <Tabs
        selectedIndex={selectedIndex}
        onChange={onTabChange}
        dismissable
        onTabCloseRequest={onTabClose}>
        <TabList contained>
          {tabs.map((tab, index) => (
            <Tab key={index}>{tab.label}</Tab>
          ))}
        </TabList>
        <TabPanels>
          {tabs.map((tab, index) => (
            <TabPanel key={index}>
              <pre className="web-ide__editor-content">{tab.content}</pre>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    ) : (
      <div className="web-ide__empty-state">No files open</div>
    )}
  </div>
);

/**
 * Secondary sidebar
 */
const SecondarySideBar = ({
  collapsed,
  secondarySidebarResizerRef,
  updateAllResizerAriaValues,
}: {
  collapsed: boolean | undefined;
  secondarySidebarResizerRef: ResizerRef;
  updateAllResizerAriaValues: () => void;
}) => {
  useEffect(() => {
    updateAllResizerAriaValues();
  }, [collapsed, updateAllResizerAriaValues]);

  return (
    <>
      <Resizer
        ref={secondarySidebarResizerRef}
        orientation="vertical"
        thickness={1}
        style={{ display: collapsed ? 'none' : 'block' }}
        aria-valuemin={0}
        aria-valuemax={100}
        onResizeEnd={() => {
          updateAllResizerAriaValues();
        }}
      />
      <div
        className={`web-ide__secondary-sidebar${collapsed ? ' web-ide__secondary-sidebar--collapsed' : ''}`}>
        <div className="web-ide__empty-state">Secondary Sidebar</div>
      </div>
    </>
  );
};

/**
 * Panel component (bottom panel)
 */
const Panel = ({
  collapsed,
  onToggle,
  panelResizerRef,
  updateAllResizerAriaValues,
}: {
  collapsed: boolean | undefined;
  onToggle: () => void;
  panelResizerRef: ResizerRef;
  updateAllResizerAriaValues: () => void;
}) => {
  const [panelTabIndex, setPanelTabIndex] = useState(3);

  useEffect(() => {
    updateAllResizerAriaValues();
  }, [collapsed, updateAllResizerAriaValues]);

  return (
    <>
      <Resizer
        ref={panelResizerRef}
        orientation="horizontal"
        thickness={1}
        style={{ display: collapsed ? 'none' : 'block' }}
        aria-valuemin={0}
        aria-valuemax={100}
        onResizeEnd={() => {
          updateAllResizerAriaValues();
        }}
      />
      <div
        className={`web-ide__panel${collapsed ? ' web-ide__panel--collapsed' : ''}`}>
        <div className="web-ide__panel-tabs">
          <Tabs
            selectedIndex={panelTabIndex}
            onChange={({ selectedIndex: newIndex }) =>
              setPanelTabIndex(newIndex)
            }>
            <div className="web-ide__panel-tabs-wrapper">
              <TabList aria-label="Panel tabs">
                <Tab>Problems</Tab>
                <Tab>Output</Tab>
                <Tab>Debug Console</Tab>
                <Tab>Terminal</Tab>
              </TabList>
              <IconButton
                label="Close Panel"
                align="left"
                kind="ghost"
                size="md"
                onClick={onToggle}>
                <Close size={16} />
              </IconButton>
            </div>
            <TabPanels>
              <TabPanel>
                <div className="web-ide__panel-content">
                  <div>⚠️ No problems detected</div>
                </div>
              </TabPanel>
              <TabPanel>
                <div className="web-ide__panel-content">
                  <div>$ npm run build</div>
                  <div className="web-ide__panel-text--secondary">
                    {'>'} my-app@1.0.0 build
                  </div>
                  <div className="web-ide__panel-text--secondary">
                    {'>'} tsc && vite build
                  </div>
                  <div className="web-ide__panel-line--spaced">
                    vite v5.0.0 building for production...
                  </div>
                  <div className="web-ide__panel-text--success">
                    ✓ 127 modules transformed.
                  </div>
                  <div className="web-ide__panel-line">
                    dist/index.html 0.45 kB │ gzip: 0.30 kB
                  </div>
                  <div>
                    dist/assets/index-a1b2c3d4.css 2.15 kB │ gzip: 0.89 kB
                  </div>
                  <div>
                    dist/assets/index-e5f6g7h8.js 143.21 kB │ gzip: 46.33 kB
                  </div>
                  <div className="web-ide__panel-text--success web-ide__panel-line--spaced">
                    ✓ built in 2.34s
                  </div>
                </div>
              </TabPanel>
              <TabPanel>
                <div className="web-ide__panel-content">
                  <div className="web-ide__panel-text--secondary">
                    Debug console output will appear here...
                  </div>
                </div>
              </TabPanel>
              <TabPanel>
                <div className="web-ide__panel-content">
                  <div>$ npm start</div>
                  <div className="web-ide__panel-text--secondary">
                    {'>'} my-app@1.0.0 start
                  </div>
                  <div className="web-ide__panel-text--secondary">
                    {'>'} vite
                  </div>
                  <div className="web-ide__panel-line--spaced">
                    VITE v5.0.0 ready in 423 ms
                  </div>
                  <div className="web-ide__panel-line">
                    ➜ Local:{' '}
                    <span className="web-ide__panel-text--link">
                      http://localhost:5173/
                    </span>
                  </div>
                  <div>➜ Network: use --host to expose</div>
                  <div className="web-ide__panel-line--spaced">
                    ➜ press h + enter to show help
                  </div>
                </div>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </div>
    </>
  );
};

/**
 * Custom hook for managing collapse state
 * @param {Object} initialState - Initial collapse state for all panels
 * @returns {Object} Collapse state and toggle function
 */
const useCollapseState = (initialState: CollapsedState = {}) => {
  const [collapsed, setCollapsed] = useState(initialState);

  const togglePanel = useCallback((panelName: string) => {
    setCollapsed((prev) => ({
      ...prev,
      [panelName]: !prev[panelName],
    }));
  }, []);

  return { collapsed, togglePanel };
};

/**
 * Custom hook for updating resizer ARIA attributes
 * @param {Object} refs - Object containing all resizer refs
 * @returns {Function} Function to update all resizer ARIA values
 */
const useResizerAriaUpdates = (refs: Record<string, ResizerRef>) => {
  const {
    explorerResizerRef,
    primarySidebarResizerRef,
    secondarySidebarResizerRef,
    panelResizerRef,
  } = refs;

  const updateResizer = useCallback(
    (ref: ResizerRef | undefined, orientation: string) => {
      if (!ref?.current) {
        return;
      }

      const prevSibling = ref.current
        .previousElementSibling as HTMLElement | null;
      const nextSibling = ref.current.nextElementSibling as HTMLElement | null;

      if (prevSibling && nextSibling) {
        const dimension = orientation === 'horizontal' ? 'height' : 'width';
        const offsetDimension =
          orientation === 'horizontal' ? 'offsetHeight' : 'offsetWidth';

        const prevSize = parseFloat(
          prevSibling.style[dimension] || String(prevSibling[offsetDimension])
        );
        const nextSize = parseFloat(
          nextSibling.style[dimension] || String(nextSibling[offsetDimension])
        );
        const total = prevSize + nextSize;

        if (total > 0 && !isNaN(prevSize) && !isNaN(nextSize)) {
          const percentage = Math.round((prevSize / total) * 100);
          ref.current.setAttribute('aria-valuenow', String(percentage));
        }
      }
    },
    []
  );

  useEffect(() => {
    updateResizer(explorerResizerRef, 'horizontal');
    updateResizer(primarySidebarResizerRef, 'vertical');
    updateResizer(secondarySidebarResizerRef, 'vertical');
    updateResizer(panelResizerRef, 'horizontal');
  }, [
    updateResizer,
    explorerResizerRef,
    primarySidebarResizerRef,
    secondarySidebarResizerRef,
    panelResizerRef,
  ]);

  return updateResizer;
};

/**
 * Web IDE Story Component
 */
export const WebIDEStory = (args: ResizerArgs) => {
  // State management with custom hooks
  const { collapsed, togglePanel } = useCollapseState({
    primarySidebar: false,
    secondarySidebar: false,
    panel: false,
    explorer: false,
    outline: false,
  });

  const [activeView, setActiveView] = useState(VIEWS.EXPLORER);
  const [tabs, setTabs] = useState<EditorTab[]>([
    { label: 'App.tsx', content: FILE_CONTENTS['App.tsx'] },
    { label: 'index.tsx', content: FILE_CONTENTS['index.tsx'] },
    { label: 'Header.tsx', content: FILE_CONTENTS['Header.tsx'] },
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const explorerResizerRef = useRef<HTMLDivElement>(null);
  const primarySidebarResizerRef = useRef<HTMLDivElement>(null);
  const secondarySidebarResizerRef = useRef<HTMLDivElement>(null);
  const panelResizerRef = useRef<HTMLDivElement>(null);

  // Update ARIA values using custom hook
  const updateResizer = useResizerAriaUpdates({
    explorerResizerRef,
    primarySidebarResizerRef,
    secondarySidebarResizerRef,
    panelResizerRef,
  });

  // Create callback for manual ARIA updates (used by child components)
  const updateAllResizerAriaValues = useCallback(() => {
    updateResizer(explorerResizerRef, 'horizontal');
    updateResizer(primarySidebarResizerRef, 'vertical');
    updateResizer(secondarySidebarResizerRef, 'vertical');
    updateResizer(panelResizerRef, 'horizontal');
  }, [
    updateResizer,
    explorerResizerRef,
    primarySidebarResizerRef,
    secondarySidebarResizerRef,
    panelResizerRef,
  ]);

  const handleViewToggle = useCallback(
    (view: string) => {
      if (activeView === view && !collapsed.primarySidebar) {
        togglePanel('primarySidebar');
      } else {
        setActiveView(view);
        if (collapsed.primarySidebar) {
          togglePanel('primarySidebar');
        }
      }
    },
    [activeView, collapsed.primarySidebar, togglePanel]
  );

  const openTab = useCallback((fileName: string, content: string) => {
    setTabs((prevTabs) => {
      const existingIndex = prevTabs.findIndex((tab) => tab.label === fileName);

      if (existingIndex !== -1) {
        setSelectedIndex(existingIndex);
        return prevTabs;
      }

      const newTabs = [...prevTabs, { label: fileName, content }];
      setSelectedIndex(newTabs.length - 1);
      return newTabs;
    });
  }, []);

  const closeTab = useCallback((index: number) => {
    setTabs((prevTabs) => {
      const newTabs = prevTabs.filter((_, i) => i !== index);

      // Update selectedIndex atomically within the same state update
      setSelectedIndex((prevSelectedIndex) => {
        if (newTabs.length === 0) {
          return 0;
        }
        if (prevSelectedIndex >= newTabs.length) {
          return newTabs.length - 1;
        }
        if (index < prevSelectedIndex) {
          return prevSelectedIndex - 1;
        }
        return prevSelectedIndex;
      });

      return newTabs;
    });
  }, []);

  const selectTab = useCallback(
    ({ selectedIndex: newIndex }: { selectedIndex: number }) => {
      setSelectedIndex(newIndex);
    },
    []
  );

  const handleFileSelect = useCallback(
    (_event: unknown, node: { value?: string }) => {
      const fileName = node.value ?? '';
      if (!fileName.endsWith('.tsx')) {
        return;
      }

      const content =
        FILE_CONTENTS[fileName] ||
        `import React from 'react';\n\nexport const ${fileName.replace(
          '.tsx',
          ''
        )} = () => {\n  return (\n    <div>\n      <h2>${fileName.replace(
          '.tsx',
          ''
        )} Component</h2>\n    </div>\n  );\n};`;

      openTab(fileName, content);
    },
    [openTab]
  );

  return (
    <div className="web-ide">
      <TopToolbar
        collapsed={collapsed}
        onTogglePrimarySidebar={() => togglePanel('primarySidebar')}
        onToggleSecondarySidebar={() => togglePanel('secondarySidebar')}
        onTogglePanel={() => togglePanel('panel')}
      />

      <div className="web-ide__body">
        <VerticalToolbar
          activeView={activeView}
          onViewChange={handleViewToggle}
          primarySidebarCollapsed={collapsed.primarySidebar}
        />

        <PrimarySideBar
          activeView={activeView}
          collapsed={collapsed.primarySidebar}
          explorerCollapsed={collapsed.explorer}
          outlineCollapsed={collapsed.outline}
          onToggleExplorer={() => togglePanel('explorer')}
          onToggleOutline={() => togglePanel('outline')}
          onFileSelect={handleFileSelect}
          resizerProps={args}
          explorerResizerRef={explorerResizerRef}
          primarySidebarResizerRef={primarySidebarResizerRef}
          updateAllResizerAriaValues={updateAllResizerAriaValues}
        />

        <div className="web-ide__main-content">
          <MainContent
            tabs={tabs}
            selectedIndex={selectedIndex}
            onTabChange={selectTab}
            onTabClose={closeTab}
          />

          <Panel
            collapsed={collapsed.panel}
            onToggle={() => togglePanel('panel')}
            panelResizerRef={panelResizerRef}
            updateAllResizerAriaValues={updateAllResizerAriaValues}
          />
        </div>

        <SecondarySideBar
          collapsed={collapsed.secondarySidebar}
          secondarySidebarResizerRef={secondarySidebarResizerRef}
          updateAllResizerAriaValues={updateAllResizerAriaValues}
        />
      </div>
    </div>
  );
};
